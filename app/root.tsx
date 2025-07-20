import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  useMatches,
  type UIMatch,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  ThemeProvider,
  useTheme,
  PreventFlashOnWrongTheme,
  Theme,
} from "remix-themes";
import { themeSessionResolver } from "~/sessions.server";
import { useEffect } from "react";
import { Settings, Briefcase } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import "./tailwind.css";
import { ModeToggle } from "./components/mode-toggle";

// Define a type for the handle property
interface Handle {
  title?: string;
}

// 添加loader获取主题
export const loader: LoaderFunction = async ({ request }) => {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function Document({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme | null;
}) {
  const [resolvedTheme] = useTheme();
  const currentTheme = resolvedTheme || theme || Theme.LIGHT;

  return (
    <html lang="en" className={currentTheme === Theme.DARK ? "dark" : ""} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<{ theme: Theme | null }>();
  const matches = useMatches() as UIMatch<unknown, Handle>[];

  const currentRoute = matches[matches.length - 1];
  const title = currentRoute?.handle?.title || "CreatorOS";

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <Document theme={data.theme}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Creator OS</h1>
              <ModeToggle />
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                      <Briefcase size={16} />
                      <span>Workspace</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/settings">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>{/* Footer content */}</SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="flex items-center gap-4 p-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <main className="p-4">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </Document>
    </ThemeProvider>
  );
}