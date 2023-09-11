import { type ActionFunction, json } from "react-router";
import { destroyUserSession } from "~/data/auth.server";

export const action: ActionFunction = ({ request }) => {
  if (request.method !== "POST") {
    throw json({ message: "Invalid request method" }, { status: 400 });
  }

  return destroyUserSession(request);
};
