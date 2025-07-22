/* eslint-disable */
import { json, type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import LoginForm from "~/components/LoginForm";
import { createAuthServices } from "~/services/auth.server";
import BackgroundRays from "~/components/ui/BackgroundRays";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getSession } = createAuthServices(context.env);
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  
  // 如果用户已登录，直接重定向到主页
  if (user) {
    return redirect("/");
  }
  
  return json({ user });
}

export default function Login() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen">
      <BackgroundRays />
      <LoginForm />
    </div>
  );
}