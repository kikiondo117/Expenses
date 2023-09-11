import {
  type ActionFunction,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { AuthForm } from "~/components/auth/AuthForm";
import { login, signup } from "~/data/auth.server";
// * Styles
import authStyles from "~/styles/auth.css";
import { createAuthPostValidator } from "~/utils/schemas/auth";

export default function Auth() {
  return <AuthForm />;
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: authStyles }];
};

export const action: ActionFunction = async ({ request }) => {
  // * ANCHOR  Accedemos a información del URL
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";

  const formData = await request.formData();

  const validation = await createAuthPostValidator.validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }
  try {
    if (authMode === "login") {
      console.log("entrando a login");
      return await login({
        email: validation.data.email,
        password: validation.data.password,
      });
    } else {
      return await signup({
        email: validation.data.email,
        password: validation.data.password,
      });
    }
  } catch (error: any) {
    if (error.status === 422) {
      return validationError(
        {
          fieldErrors: {
            email: error.message,
          },
          formId: validation.formId,
        },
        validation.data
      );
    }

    if (error.status === 401) {
      return validationError(
        {
          fieldErrors: {
            email: error.message,
          },
          formId: validation.formId,
        },
        validation.data
      );
    }
  }
};
