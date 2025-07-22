import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({
    env: context.env,
    cf: context.request.cf,
    ctx: context,
    cloudflare: context, // 补充 cloudflare 字段，保证类型兼容
  }),
});