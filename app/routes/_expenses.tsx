import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ExpensesHeader } from "~/components/navigation/ExpensesHeader";
import { requireUserSession } from "~/data/auth.server";
// * Styles
import expensesStyles from "~/styles/expenses.css";

export default function ExpensesAppLayout() {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: expensesStyles }];
};

export const loader: LoaderFunction = ({ request }) => {
  return requireUserSession(request);
};
