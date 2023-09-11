import { useIsSubmitting } from "remix-validated-form";

interface SubmitButtonProps {
  submitText?: string;
}

export const SubmitButton = ({ submitText = "Submit" }: SubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-black text-white p-3 rounded-md"
    >
      {isSubmitting ? "Submitting..." : submitText}
    </button>
  );
};
