import type { LoaderFunction } from "@remix-run/node";
import { requireUserSession } from "~/data/auth.server";
import { getExpenses } from "~/data/expenses.server";

// ! Resource Route
// Estos se lanzan cuando hay un get request en esa ruta recordemos que un get es
// algo un comportamiento normal en las paginas web por defecto
// Los podemos usar stanalone para mandar información como una API
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserSession(request);
  // Eviatmos que dispare el loader sin session
  await requireUserSession(request);
  return getExpenses({ userId: userId });
};
