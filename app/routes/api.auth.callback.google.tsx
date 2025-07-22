/* eslint-disable */
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { authenticator, commitSession, getSession } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // 处理 Google OAuth 回调并获取用户信息
  const user = await authenticator.authenticate("google", request);
  console.log('OAuth callback - authenticated user:', user);
  
  // 获取 session 并保存用户信息
  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", user);
  
  // 认证成功后重定向到首页，同时提交 session
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
} 