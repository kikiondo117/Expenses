import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "react-router";
import { Chart } from "~/components/expenses/Chart";
import { ExpenseStatistics } from "~/components/expenses/ExpenseStatistics";
import { requireUserSession } from "~/data/auth.server";
import { getExpenses } from "~/data/expenses.server";
import { type expenceInterface } from "~/interfaces/expenses";

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

/**
 * Con el pathless puedo compartir estilos entre archivos
 * sin la necesidad de crear una nueva ruta en la url
 * a pesar de que dice _app o lo que sea, solo se va a mostrar expenses
 *
 * En pocas palabras son wrappers para compartir :)
 *
 * @returns
 */

export default function ExpensesAnalisisPage() {
  const expenses = useLoaderData();
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  // Eviatmos que dispare el loader sin session
  const userId = await requireUserSession(request);

  const expenses = await getExpenses({ userId: userId });

  if (expenses.length == 0) {
    throw json(
      { message: "Could not find any expenses" },
      { status: 404, statusText: "Not found" }
    );
  }

  return expenses;
};

export const ErrorBoundary = () => {
  return (
    <div>
      <p>No expenes </p>
      <p>
        Add <Link to="/expenses/add">new expense</Link>
      </p>
    </div>
  );
};
