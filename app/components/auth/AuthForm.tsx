import { Link, useSearchParams } from "@remix-run/react";
import { FaLock, FaUserPlus } from "react-icons/fa";
import {
  useField,
  useFieldArray,
  useIsSubmitting,
  ValidatedForm,
} from "remix-validated-form";
import { createAuthPostValidator } from "~/utils/schemas/auth";
import { Input } from "../form/Input";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const isSubmitting = useIsSubmitting("auth-form");
  const authMode = searchParams.get("mode") || "login";

  const submitBtnCaption = authMode === "login" ? "Login" : "Create User";
  const toggleBtnCaption =
    authMode === "login" ? "Create new user" : "Log in with existing user";

  return (
    <ValidatedForm
      validator={createAuthPostValidator}
      method="post"
      className="form"
      id="auth-form"
    >
      <div className="icon-img">
        {authMode === "login" ? <FaLock /> : <FaUserPlus />}
      </div>
      <p>
        <Input name="email" title="Email Address" id="email" />
      </p>
      <p>
        <Input name="password" title="Password" id="password" />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>{submitBtnCaption}</button>
        {/* RELATIVE PATH usando ? */}
        <Link to={`?mode=${authMode === "login" ? "signup" : "login"}`}>
          {toggleBtnCaption}
        </Link>
      </div>
    </ValidatedForm>
  );
}

export { AuthForm };
