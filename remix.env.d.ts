import type { AppLoadContext as RemixAppLoadContext } from "@remix-run/cloudflare";

declare module "@remix-run/cloudflare" {
  export interface AppLoadContext extends RemixAppLoadContext {
    cloudflare: {
      env: {
        MY_DB: D1Database;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        APP_URL: string;
        SESSION_SECRET: string;
      };
    };
  }
}
