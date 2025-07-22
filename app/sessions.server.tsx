import { createThemeSessionResolver } from "remix-themes"
import { createCookieSessionStorage } from "@remix-run/cloudflare";

// 改成函数，传 env
export function createThemeSessionResolverWithEnv(env: any) {
  const isProduction = env.NODE_ENV === "production"

  const sessionStorage = createCookieSessionStorage({
      cookie: {
          name: "__theme",
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secrets: ["s3cr3t"],
          secure: env.NODE_ENV === "production",
      },
  })

  return createThemeSessionResolver(sessionStorage)
}
