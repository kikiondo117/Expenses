import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

const createExpensePostSchema = zfd.formData({
  title: zfd.text(z.string().min(1).max(100)),
  amount: zfd.numeric(z.number().min(0)),
  date: zfd.text(),
});

export type CreateExpensePostType = z.infer<typeof createExpensePostSchema>;
export const createExpensePostValidator = withZod(createExpensePostSchema);
