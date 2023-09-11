import type { expenceInterface } from "~/interfaces/expenses";
import ExpenseListItem from "./ExpenseListItem";

function ExpensesList({ expenses }: { expenses: expenceInterface[] }) {
  return (
    <ol id="expenses-list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={expense.amount}
          />
        </li>
      ))}
    </ol>
  );
}

export { ExpensesList };
