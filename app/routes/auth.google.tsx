/* eslint-disable */
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/services/auth.server";

// 处理直接访问此路由的情况
export const loader: LoaderFunction = () => redirect("/login");

// 处理登录表单提交和 OAuth 回调
export const action: ActionFunction = async ({ request }) => {
    const url = new URL(request.url);
    return authenticator.authenticate("google", request);
}; 