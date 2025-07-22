import type { MetaFunction } from "@remix-run/cloudflare";
import { WorkspacePage } from "~/pages/WorkspacePage";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Chat App" },
    { name: "description", content: "Chat with AI" },
  ];
};

export const handle = {
  title: "Workspace",
};

export default function Index() {

  return <WorkspacePage />;
}