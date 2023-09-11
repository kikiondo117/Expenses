import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
// * Custom components
import { MainHeader } from "~/components/navigation/MainHeader";
import { getUserFromSession } from "~/data/auth.server";

// * Styles
import marketingStyles from "~/styles/marketing.css";

export default function MarketingLayoutPath() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: marketingStyles }];
};

export const loader: LoaderFunction = ({ request }) => {
  return getUserFromSession(request);
};
