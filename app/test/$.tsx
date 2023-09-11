import { type LoaderFunction, redirect } from "@remix-run/node";
/** ES UN SPLAT ROUTE
 * Esto quiere decir que si no hay un match en la url
 * esta es la pagina que va a mostrar y contiene toda la url
 * un ejemplo /dasdas/nani
 *
 * params { '*': 'dasdas/nani' }
 */

// ! Esta funciona para hacer redirects

export const loader: LoaderFunction = ({ params }) => {
  if (params["*"] === "exp") {
    return redirect("/expenses");
  }

  throw new Response("Not Found", { status: 404 });
};

/**
 * * It's common to add a routes/$.tsx file build custom 404 pages with data from a loader
 * *  (without it, Remix renders your root ErrorBoundary with no ability to load data for the page when the URL doesn't match any routes).
 */
