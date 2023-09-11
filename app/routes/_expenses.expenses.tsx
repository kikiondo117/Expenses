import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { ExpensesList } from "~/components/expenses/ExpensesList";
import { getExpenses } from "~/data/expenses.server";
// * Styles
import expensesStyles from "~/styles/expenses.css";
import { FaDownload, FaPlus } from "react-icons/fa";
import { requireUserSession } from "~/data/auth.server";

// const DUMMY_EXPENSES: expenceInterface[] = [
//   {
//     id: "e1",
//     title: "First expense",
//     amount: 12.99,
//     date: new Date().toISOString(),
//   },
//   {
//     id: "e2",
//     title: "Second expense",
//     amount: 16.99,
//     date: new Date().toISOString(),
//   },
// ];

export default function Expenses() {
  // * Serializa la información creando todo los campos string
  const expenses = useLoaderData();

  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>{" "}
          </Link>
          {/* Resource no un contenido, por eso utilizamos la etiqueta normal */}
          <a href="/expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>

        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="add">adding some today</Link>
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: expensesStyles }];
};

// * Remix automaticamente espera a que se resuelva la promise
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserSession(request);
  return getExpenses({ userId });

  // const expenses = await getExpenses();
  //?  Esto hace remix internamamente si enviamos data en raw sin ser explicitos
  // return json(expenses);
};

// ! No siempre se tiene que utilizar, podemos manejar casos en la ui principal c:
// export function ErrorBoundary() {
//   return <p>Error :c</p>;
// }
