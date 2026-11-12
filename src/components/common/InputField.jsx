
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
  onBlur,
  error,
  inputMode, maxLength,
  required = true,
  minLength,
  multiline = false,
  rows = 5,
  icon,
}) {
  const Icon = icon || icons[name];
  const Field = multiline ? "textarea" : "input";

  return (
    <label
      htmlFor={name}
      className="grid gap-2 text-sm font-semibold text-ink"
    >
      <span>{label}</span>

      <span
        className={`flex min-h-12 gap-3 rounded-control border bg-page/50 px-3.5 text-muted transition focus-within:bg-surface focus-within:ring-4 ${
          error
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10"
            : "border-line focus-within:border-primary focus-within:ring-primary/10"
        } ${multiline ? "items-start" : "items-center"}`}
      >
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={multiline ? "mt-3.5 shrink-0" : "shrink-0"}
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
          inputMode={inputMode}
          maxLength={maxLength}
          required={required}
          minLength={minLength}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </span>
      {error && (
        <span id={`${name}-error`} role="alert" className="text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}

export default InputField;
