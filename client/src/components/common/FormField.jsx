export default function FormField({ label, type = "text", options = [], error, hint, ...props }) {
  if (type === "textarea") {
    return (
      <label className="field">
        <span className="form-label mb-0">{label}</span>
        <textarea {...props} className="form-control" />
        {hint && <small className="field-hint">{hint}</small>}
        {error && <small className="field-error">{error}</small>}
      </label>
    );
  }

  if (type === "select") {
    return (
      <label className="field">
        <span className="form-label mb-0">{label}</span>
        <select {...props} className="form-select">
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
      <label className="checkbox-field form-check">
        <input {...props} className="form-check-input" type="checkbox" />
        <span className="form-check-label">{label}</span>
      </label>
    );
  }

  return (
    <label className="field">
      <span className="form-label mb-0">{label}</span>
      <input {...props} className="form-control" type={type} />
      {hint && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
