import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
// * Styles
import sharedStyles from "~/styles/shared.css";
import Error from "./components/util/Error";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: sharedStyles },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap",
  },
];

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ title, children }) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={"Error page"}>
        <Error title="Error">
          <h1>Upps: {error.statusText}</h1>
          <p>Status: {error.status}</p>
          <p>
            Back to <Link to="/">safety</Link>.
          </p>
        </Error>
      </Document>
    );
  }

  // Algun error en cualquier parte de la app por ejemplo un error al momendo de modificar la base de datos
  return (
    <Document title={"Error"}>
      <Error title="Error">
        Es un problema de nuestro lado por favor vuelve a intentarlo :c
        <p>{error.message}</p>
        <p>
          Back to <Link to="/">safety</Link>.
        </p>
      </Error>
    </Document>
  );
}
