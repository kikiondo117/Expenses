import {
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
// * Custom Components
import { ExpenseForm } from "~/components/expenses/ExpenseForm";
import { Modal } from "~/components/util/Modal";
import {
  deleteExpense,
  getExpense,
  updateExpense,
} from "~/data/expenses.server";
import { createExpensePostValidator } from "~/utils/schemas/expense";

export default function ExpensesUpdatePage() {
  const navigate = useNavigate();
  const expense = useLoaderData();

  const closeHandler = () => {
    //  Remix podemos navegar programaticamente
    navigate("..");
  };

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm expense={expense} />
    </Modal>
  );
}

// ! Los loaders se ejecutan en paralelo no de forma sincrona :)
// * Siempre y cuando sean rutas nesteadas
export const loader: LoaderFunction = async ({ params }) => {
  // nuestra ruta es id por eso pongo id
  const expenseId = params.id;

  if (expenseId) {
    const expense = await getExpense({ id: expenseId });
    return expense;
  }
  return json({ message: "not found" });
};

export const action: ActionFunction = async ({ params, request }) => {
  const expenseId = params.id;
  const formData = await request.formData();
  const validation = await createExpensePostValidator.validate(formData);

  if (!expenseId) return null;

  // ANCHOR PATCH
  if (request.method === "PATCH") {
    if (validation.error) {
      return validationError(validation.error);
    }
    await updateExpense({ id: expenseId, expenseData: validation.data });
    return redirect("/expenses");
  }

  // ANCHOR DELETE
  if (request.method === "DELETE") {
    await deleteExpense({ id: expenseId });
    // * Remix asume que despues de esto va a hacer un get a la misma ruta por eso no utilizamos el Form
    return { deleteId: expenseId };
  }
};
