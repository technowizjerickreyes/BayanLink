export default function FormInput({ label, type = "text", options = [], error, ...props }) {
  if (type === "textarea") {
    return (
      <label className="field">
        <span className="form-label mb-0">{label}</span>
        <textarea {...props} className="form-control" />
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
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
