
import { Mail, LockKeyhole, UserRound } from "lucide-react";

const icons = {
  username: UserRound,
  email: Mail,
  password: LockKeyhole,
};

function InputField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  required = true,
  minLength,
  multiline = false,
  rows = 5,
}) {
  const Icon = icons[name];
  const Field = multiline ? "textarea" : "input";
  return (
    <label
      htmlFor={name}
      className="grid gap-2 text-sm font-semibold text-ink"
    >
      <span>{label}</span>

      <span
        className={`flex min-h-12 gap-3 rounded-control border border-line bg-page/50 px-3.5 text-muted transition focus-within:border-primary focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10 ${
          multiline ? "items-start" : "items-center"
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={multiline ? "mt-3.5 shrink-0" : ""}
          />
        )}

        <Field
          id={name}
          className="w-full min-w-0 resize-none bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted/60"
          type={multiline ? undefined : type}
          rows={multiline ? rows : undefined}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
        />
      </span>
    </label>
  );
}

export default InputField;
