import { createThemeSessionResolver } from "remix-themes"
import { createCookieSessionStorage } from "@remix-run/node";
// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__theme",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: ["s3cr3t"],
        secure: process.env.NODE_ENV === "production",
    },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
