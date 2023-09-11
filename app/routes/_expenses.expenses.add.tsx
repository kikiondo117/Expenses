import { Modal } from "~/components/util/Modal";
// * Custom Components
import { ExpenseForm } from "~/components/expenses/ExpenseForm";
import { useNavigate } from "@remix-run/react";
import { redirect, type ActionFunction } from "@remix-run/node";
import { addExpense } from "~/data/expenses.server";
import { createExpensePostValidator } from "~/utils/schemas/expense";
import { validationError } from "remix-validated-form";
import { requireUserSession } from "~/data/auth.server";

export default function ExpensesAddPage() {
  const navigate = useNavigate();

  const closeHandler = () => {
    // ANCHOR -  Remix podemos navegar programaticamente
    navigate("..");
  };

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

// Un POST request a esta misma ruta, por lo general enviado por el form c:
export const action: ActionFunction = async ({ request }) => {
  // * request - informacion de request lanzado
  // * paramas - información del dynamic path
  // ? https://medium.com/coders-outpost/fullstack-type-safe-forms-with-react-remix-remix-validated-form-and-zod-6a0e30d2dd2f

  const userId = await requireUserSession(request);

  const formData = await request.formData(); // nos regresa un objecto del submit data
  const validation = await createExpensePostValidator.validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  await addExpense({ expenseData: validation.data, userId: userId });
  return redirect("/expenses");
};
