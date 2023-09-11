import type { ExpenseData } from "~/interfaces/expenses";

import { Link } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { createExpensePostValidator } from "~/utils/schemas/expense";
import { Input } from "../form/Input";
import { SubmitButton } from "../form/SubmitButton";

function ExpenseForm({ expense }: { expense?: ExpenseData }) {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  // * Este navigation state solo funciona cuando utilizamos el Form de remix osea una SPA en lugar del form normal
  // const navigation= useNavigation();
  // const isSubmitting = navigation.state !== 'idle'

  /**
   * * Podemos obtener la información directamente del padre ya que este tiene un loader con todos los expenses
   * * para poder hacerlo tenemos que utilizar el hooks useMatches y ahi es donde estan estos datos.
   *
   * * De esta manera evitamos hacer un nuevo request a nuestra base de datos, el use matches nos puede ayudar en situaciones
   * * donde si tenga una query pesada a la base de datos
   */
  // const params = useParams();
  // const matches = useMatches();

  // const expenses = matches.find(
  //   (match) => match.id === "routes/_expenses.expenses"
  // )?.data;
  // const expenseData = expenses.find((expense: any) => expense.id === params.id);
  // * Error
  //if(params.id && !expenseData)
  //{return <div> Invalid expense id</div>} || {throw  new Response()} // El Response viene del Browser :)

  return (
    <ValidatedForm
      validator={createExpensePostValidator}
      method={expense ? "patch" : "post"}
      className="flex flex-col space-y-4 w-10/12 lg:w-1/2"
      defaultValues={{
        title: expense?.title || "",
        amount: expense?.amount || 0,
      }}
    >
      <p>
        <Input title="Expense Title" name="title" id="title"></Input>
      </p>

      <div className="form-row">
        <p>
          <Input name="amount" id="amount" title="Amount"></Input>
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            defaultValue={expense?.date ? expense.date.slice(0, 10) : ""}
          />
        </p>
      </div>
      <div className="form-actions">
        <SubmitButton submitText="Save Expense" />
        {/* <Link to="/expenses">Cancel</Link> */}
        {/* ANCHOR - Relative links */}
        <Link to="..">Cancel</Link>
      </div>
    </ValidatedForm>
  );
}

export { ExpenseForm };
