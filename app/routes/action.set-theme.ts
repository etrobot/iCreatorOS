import { createThemeAction } from "remix-themes";
import { createThemeSessionResolverWithEnv } from "~/sessions.server";

const themeSessionResolver = createThemeSessionResolverWithEnv(process.env)
export const action = createThemeAction(themeSessionResolver); 