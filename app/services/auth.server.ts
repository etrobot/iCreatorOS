/* eslint-disable */
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import {users, accounts } from "~/db/schema";
import { eq } from "drizzle-orm";
import { OAuth2Strategy } from 'remix-auth-oauth2';

// 类型和导出全部移到函数外部
// 只保留 createAuthServices 的 export，其它 type/const 不加 export

type GoogleScope = string;
type GoogleStrategyOptions = {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  /**
   * @default "openid profile email"
   */
  scope?: GoogleScope[] | string;
  accessType?: 'online' | 'offline';
  includeGrantedScopes?: boolean;
  prompt?: 'none' | 'consent' | 'select_account';
  hd?: string;
  loginHint?: string;
};
type GoogleProfile = {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [{
    value: string;
  }];
  photos: [{
    value: string;
  }];
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    email: string;
    email_verified: boolean;
    hd: string;
  };
};
type GoogleExtraParams = {
  expires_in: 3920;
  token_type: 'Bearer';
  scope: string;
  id_token: string;
} & Record<string, string | number>;
const GoogleStrategyScopeSeperator = " ";
const GoogleStrategyDefaultScopes: string = "openid profile email";
const GoogleStrategyDefaultName = "google";
type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

export function createAuthServices(env: any) {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "__session", // cookie 名称
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [env.SESSION_SECRET || "defaultSecret"],
      secure: env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 有效期7天
    },
  });

  const authenticator = new Authenticator();
  const { getSession, commitSession, destroySession } = sessionStorage;

  class GoogleStrategy extends OAuth2Strategy<User> {
    protected authorizationParams(params: URLSearchParams): URLSearchParams {
      params.set("access_type", "online");
      params.set("prompt", "select_account");
      const scopes = this.options.scopes;
      if (Array.isArray(scopes)) {
        params.set("scope", scopes.join(" "));
      }
      return params;
    }
  }

  // 用于闭包传递 db
  let _googleStrategyDb: any = null;
  function setGoogleStrategyDb(db: any) { _googleStrategyDb = db; }
  function getGoogleStrategyDb() { return _googleStrategyDb; }

  const googleStrategy = new GoogleStrategy(
    {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${env.APP_URL}/api/auth/callback/google`,
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      scopes: ["openid", "profile", "email"]
    },
    async ({ tokens }) => {
        const db = getGoogleStrategyDb();
        if (!db) throw new Error("db is not available");
        const idToken = tokens.idToken();
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        const email = payload.email;
        const userId = payload.sub;

        // 查找现有用户
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
          .execute();

        if (existingUser.length > 0) {
          return existingUser[0] as User;
        }

        // 创建新用户 - 确保字段与 schema 匹配
        const newUser = await db
          .insert(users)
          .values({
            id: userId,
            email: email,
            name: payload.name,
            image: payload.picture,
          })
          .returning();

        // 创建账户关联
        const idTokenValue = tokens.idToken();
        const accessTokenValue = tokens.accessToken();
        await db
          .insert(accounts)
          .values({
            userId: userId,
            type: "oauth",
            provider: "google",
            providerAccountId: userId,
            access_token: accessTokenValue,
            id_token: idTokenValue,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          });

        return newUser[0] as User;
    }
  );

  authenticator.use(googleStrategy, "google");

  async function logout(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }

  return {
    authenticator,
    getSession,
    commitSession,
    destroySession,
    logout,
  };
} 