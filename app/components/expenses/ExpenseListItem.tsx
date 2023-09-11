import { Link } from "react-router-dom";
import { useFetcher, useSubmit } from "@remix-run/react";
// import { Form } from "@remix-run/react";

interface Props {
  id: string;
  title: string;
  amount: number;
}

function ExpenseListItem({ id, title, amount }: Props) {
  // const submit = useSubmit();
  /**
   *  * Nos ayuda ha hacer un comportamiento similar al submit pero sin disparar navigation actions
   *  * Un ejemplo es evitar la nevagación a esa ruta, asi podemos evitar el redirect en el action
   *  * En resumen es cuando queremos lanzar un request behind scenes sin necesidad de un redirect al final c:
   */
  const fetcher = useFetcher();

  function deleteExpenseItemHandler() {
    // Es submit es la forma declarativa del Form (programatica) lo cual no necesitamos en esta ocación
    // submit(null, {
    //   method: "delete",
    //   action: `/expenses/${id}`,
    // });

    const proceed = confirm("Are you sure? Do you want to delete this item?");

    if (!proceed) {
      return;
    }

    fetcher.submit(null, {
      method: "delete",
      action: `/expenses/${id}`,
    });
  }

  if (fetcher.state !== "idle") {
    return (
      <article className="expense-item locked">
        <p>Deleting...</p>
      </article>
    );
  }

  return (
    <article className="expense-item">
      <div>
        <h2 className="expense-title">{title}</h2>
        <p className="expense-amount">${amount.toFixed(2)}</p>
      </div>
      <menu className="expense-actions">
        <button onClick={deleteExpenseItemHandler}>Delete</button>

        {/* Con el Form de remix podemos utilizar el metodo delete en lugar de solo post and get 
          Remix asume que despues de esto va a hacer un get a la misma ruta por eso no utilizamos el Form
        */}
        {/* <Form method="delete" action={`/expenses/${id}`}>
          <button formMethod="delete">Delete</button>
        </Form> */}

        {/* Relative path */}
        <Link to={id}>Edit</Link>
      </menu>
    </article>
  );
}

export default ExpenseListItem;
