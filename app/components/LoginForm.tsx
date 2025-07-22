/* eslint-disable */
import { Form, useSearchParams } from "@remix-run/react";

export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleGoogleLogin = (event: React.MouseEvent) => {
    // The Form's submit handles the redirection automatically,
    // so no loading state needs to be managed here.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bolt-elements-background-depth-1">
      <div className="bg-bolt-elements-background-depth-2 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-bolt-elements-textPrimary">
          登录
        </h1>
        
        <div className="space-y-4">
          <Form action="/auth/google" method="post">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <span className="i-ph:google-logo-thin w-5 h-5" />
              使用 Google 登录
            </button>
          </Form>
          
          {searchParams.get("error") && (
            <div className="text-red-500 text-sm text-center">
              登录失败，请重试
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 