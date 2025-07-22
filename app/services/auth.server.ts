/* eslint-disable */
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import {db,users, accounts } from "~/db/schema-sqlite";
import { eq } from "drizzle-orm";
import { OAuth2Strategy } from 'remix-auth-oauth2';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // cookie 名称
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "defaultSecret"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 有效期7天
  },
});

export const authenticator = new Authenticator();
export const { getSession, commitSession, destroySession } = sessionStorage;

export type GoogleScope = string;
export type GoogleStrategyOptions = {
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
export type GoogleProfile = {
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
export type GoogleExtraParams = {
  expires_in: 3920;
  token_type: 'Bearer';
  scope: string;
  id_token: string;
} & Record<string, string | number>;
export declare const GoogleStrategyScopeSeperator = " ";
export declare const GoogleStrategyDefaultScopes: string;
export declare const GoogleStrategyDefaultName = "google";

// 定义用户类型
export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

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

const googleStrategy = new GoogleStrategy(
  {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectURI: `${process.env.APP_URL}/api/auth/callback/google`,
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scopes: ["openid", "profile", "email"]
  },
  async ({ tokens }) => {
    try {
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
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("认证失败");
    }
  }
);

authenticator.use(googleStrategy, "google");

// 添加登出函数
export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
} 