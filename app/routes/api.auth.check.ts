/* eslint-disable */
import { json } from "@remix-run/cloudflare";
import { getSession } from "~/services/auth.server";

export async function loader({ request }: { request: Request }) {
  // console.log('Auth check - cookies:', request.headers.get("Cookie"));
  const session = await getSession(request.headers.get("Cookie"));
  // console.log('Auth check - session:', session);
  const user = session.get("user");
  // console.log('Auth check - user from session:', user);
  
  return json({ 
    isAuthenticated: Boolean(user), 
    user,
    redirectUrl: user ? null : '/login'
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
} 