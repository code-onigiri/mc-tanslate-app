import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "エラーが発生しました";
  let details = "予期しないエラーが発生しました。";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - ページが見つかりません" : "エラー";
    details =
      error.status === 404
        ? "お探しのページは存在しないか、移動した可能性があります。"
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-8 p-4 container mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl border border-red-500 rounded-md bg-red-50 dark:bg-red-900/20 p-6 relative">
        <Link 
          to="/"
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
          aria-label="ホームへ戻る"
        >
          ☓
        </Link>
        
        <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
          {message}
        </h1>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {details}
        </p>
        
        {stack && (
          <details className="mb-6 cursor-pointer">
            <summary className="font-medium text-red-600 dark:text-red-400">詳細情報</summary>
            <pre className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-800 text-sm overflow-auto">
              <code>{stack}</code>
            </pre>
          </details>
        )}
        
        <div className="flex justify-end mt-4">
          <Link
            to="/"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
