import { useField } from "remix-validated-form";
import classNames from "classnames";

interface InputProps {
  name: string;
  title?: string;
  id?: string;
}

export const Input = ({ name, title, id }: InputProps) => {
  const field = useField(name);

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name}>{title}</label>
      <input
        {...field.getInputProps()}
        className={classNames("border-2 rounded-md", {
          "border-2 !border-red-500": field.error,
        })}
        name={name}
        id={id ? id : name}
        onClick={() => {
          field.clearError();
        }}
        onChange={() => {
          if (field.error) field.clearError();
        }}
      />
      <div className="text-red-500">{field.error}</div>
    </div>
  );
};
