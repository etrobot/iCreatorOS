import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, Link, useMatches, type UIMatch } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import {ThemeProvider, useTheme, PreventFlashOnWrongTheme, Theme} from "remix-themes";
import { createThemeSessionResolverWithEnv } from "~/sessions.server";
import { Settings, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { socialLinkConfig } from "~/pages/SettingsPage";
import { SettingDialog } from "~/components/setting-dialog";
import {SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarFooter, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent} from "~/components/ui/sidebar";
import "./tailwind.css";
import { ModeToggle } from "~/components/mode-toggle";

// Define a type for the handle property
interface Handle {
  title?: string;
}

// 添加loader获取主题
export const loader: LoaderFunction = async ({ request, context }) => {
  console.log("context in loader:", context);
  const env = context?.env || process.env;
  const { getTheme } = await createThemeSessionResolverWithEnv(env)(request);
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
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<(typeof socialLinkConfig)[number] & { url?: string } | null>(null);

  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem('socialLinks');
      if (savedLinks) {
        setSocialLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error("Failed to parse social links from localStorage", error);
    }
  }, []);

  const handleLinkClick = (link: (typeof socialLinkConfig)[number]) => {
    setSelectedLink({ ...link, url: socialLinks[link.id] || '' });
    setIsDialogOpen(true);
  };

  const handleSaveLink = (url: string) => {
    if (selectedLink) {
      const newLinks = { ...socialLinks, [selectedLink.id]: url };
      setSocialLinks(newLinks);
      localStorage.setItem('socialLinks', JSON.stringify(newLinks));
    }
  };

  const currentRoute = matches[matches.length - 1];
  const title = currentRoute?.handle?.title || "CreatorOS";

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <Document theme={data.theme}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="px-4 py-2">
              <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Creator OS</h1>
              <ModeToggle />
              </div>
            </SidebarHeader>
            <SidebarContent className="py-6 px-2 flex flex-col">
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
              <div className="mt-auto mb-3">
              <SidebarGroup className="border-t">
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Media Links
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1 px-3">
                    {socialLinkConfig.map((link) => (
                      <SidebarMenuItem key={link.id} onClick={() => handleLinkClick(link)}>
                        <SidebarMenuButton className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-muted-foreground hover:bg-accent transition-colors text-sm">
                          <span className="text-sm">{link.icon}</span>
                          <span>{link.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
            </SidebarContent>
            <SidebarFooter>{/* Footer content */}</SidebarFooter>
          </Sidebar>
          <SidebarInset className="p-2">
            <header className="flex justify-between items-center w-full mb-2 fixed">
              <div>
              <SidebarTrigger />
              <span className="text-2xl font-bold">{title}</span>
              </div>
            </header>
            <main className="mt-12">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
        {selectedLink && (
        <SettingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveLink}
          setting={{
            id: selectedLink.id,
            name: selectedLink.name,
            value: selectedLink.url,
            placeholder: selectedLink.placeholder,
            label: 'URL'
          }}
        />
      )}
      </Document>
    </ThemeProvider>
  );
}