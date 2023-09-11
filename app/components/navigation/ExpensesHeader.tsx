import { Form, NavLink, useLoaderData } from "@remix-run/react";

import Logo from "../util/Logo";

function ExpensesHeader() {
  const userId = useLoaderData();

  return (
    <header id="main-header">
      <Logo />
      <nav id="main-nav">
        <ul>
          <li>
            <NavLink to="/expenses" end>
              Manage Expenses
            </NavLink>
          </li>
          <li>
            <NavLink to="/expenses/analysis">Analyze Expenses</NavLink>
          </li>
        </ul>
      </nav>
      <nav id="cta-nav">
        {userId && (
          <Form method="post" action="/logout">
            <button className="cta">Logout</button>
          </Form>
        )}
      </nav>
    </header>
  );
}

export { ExpensesHeader };
