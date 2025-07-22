/* eslint-disable */
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { createAuthServices } from "~/services/auth.server";
import { getDb } from '~/db/server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  console.log('context:', context);
  // 处理 Google OAuth 回调并获取用户信息
  const { authenticator, commitSession, getSession } = createAuthServices(context?.env || {});
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