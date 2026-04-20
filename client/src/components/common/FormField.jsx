export default function FormField({
  label,
  type = "text",
  options = [],
  error,
  hint,
  showToggle,
  onToggleVisibility,
  ...props
}) {
  if (type === "textarea") {
    return (
      <label className="field">
        <span>{label}</span>
        <textarea {...props} />
        {hint && <small className="field-hint">{hint}</small>}
        {error && <small className="field-error">{error}</small>}
      </label>
    );
  }

  if (type === "select") {
    return (
      <label className="field">
        <span>{label}</span>
        <select {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && <small className="field-hint">{hint}</small>}
        {error && <small className="field-error">{error}</small>}
      </label>
    );
  }

  if (type === "checkbox") {
    return (
      <label className="checkbox-field">
        <input {...props} type="checkbox" />
        <span>{label}</span>
      </label>
    );
  }

  // Password / text / email etc. — support show/hide toggle
  if (showToggle) {
    return (
      <div className="field">
        <span>{label}</span>
        <div className="field-input-group">
          <input {...props} className="form-control" type={type} />
          {onToggleVisibility && (
            <button
              className="field-inline-action"
              onClick={onToggleVisibility}
              tabIndex={-1}
              type="button"
            >
              {type === "password" ? "Show" : "Hide"}
            </button>
          )}
        </div>
        {hint && <small className="field-hint">{hint}</small>}
        {error && <small className="field-error">{error}</small>}
      </div>
    );
  }

  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} type={type} />
      {hint && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
