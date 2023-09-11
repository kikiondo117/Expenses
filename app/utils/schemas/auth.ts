import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const createAuthPostSchema = zfd.formData({
  email: zfd.text(),
  password: zfd.text(z.string().min(7)),
});

export type CreateAuthPostSchema = z.infer<typeof createAuthPostSchema>;
export const createAuthPostValidator = withZod(createAuthPostSchema);
