import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";
import {
  municipalityInitialForm,
  municipalityProtectedFieldDefinitions,
  municipalityStatusOptions,
} from "./municipalityUtils.js";

function ReadOnlyFieldCard({ label, value }) {
  return (
    <div className="municipality-readonly-card">
      <small>{label}</small>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export { municipalityInitialForm };

export default function MunicipalityForm({
  errors = {},
  form,
  mode = "create",
  onCancel,
  onChange,
  onSubmit,
  submitLabel,
  submitting,
}) {
  const editing = mode === "edit";

  return (
    <form className="form-panel municipality-form" onSubmit={onSubmit}>
      <section className="municipality-form-section">
        <div className="municipality-form-section-head">
          <div>
            <p className="eyebrow">Master record</p>
            <h2>{editing ? "Protected municipality identity" : "Create the municipality master record"}</h2>
          </div>
          <p>
            {editing
              ? "These core fields are protected after creation and remain read-only to prevent accidental structural changes."
              : "These fields establish the protected municipality identity. After creation, they become read-only."}
          </p>
        </div>

        {editing ? (
          <div className="municipality-readonly-grid">
            {municipalityProtectedFieldDefinitions.map((field) => (
              <ReadOnlyFieldCard key={field.key} label={field.label} value={form[field.key]} />
            ))}
          </div>
        ) : (
          <div className="form-grid two">
            {municipalityProtectedFieldDefinitions.map((field) => (
              <FormInput
                error={errors[field.key]}
                key={field.key}
                label={field.label}
                name={field.key}
                onChange={onChange}
                required
                value={form[field.key]}
              />
            ))}
          </div>
        )}
      </section>

      <section className="municipality-form-section">
        <div className="municipality-form-section-head">
          <div>
            <p className="eyebrow">Operational settings</p>
            <h2>Editable office information</h2>
          </div>
          <p>Use this section for official contact details, office address, status, and optional logo branding.</p>
        </div>

        <div className="form-grid two">
          <FormInput
            error={errors.officialEmail}
            label="Official Email"
            name="officialEmail"
            onChange={onChange}
            required
            type="email"
            value={form.officialEmail}
          />
          <FormInput
            error={errors.officialContactNumber}
            label="Official Contact Number"
            name="officialContactNumber"
            onChange={onChange}
            required
            value={form.officialContactNumber}
          />
          <FormInput
            error={errors.officeAddress}
            label="Office Address"
            name="officeAddress"
            onChange={onChange}
            required
            value={form.officeAddress}
          />
          <FormInput
            error={errors.logoUrl}
            hint="Optional public logo image shown in municipality context cards and detail views."
            label="Logo URL"
            name="logoUrl"
            onChange={onChange}
            placeholder="https://example.com/logo.png"
            value={form.logoUrl}
          />
          <FormInput
            error={errors.status}
            label="Status"
            name="status"
            onChange={onChange}
            options={municipalityStatusOptions}
            type="select"
            value={form.status}
          />
        </div>

        {form.logoUrl && !errors.logoUrl && (
          <div className="municipality-logo-preview">
            <img alt={`${form.name || "Municipality"} logo preview`} className="municipality-logo-image" src={form.logoUrl} />
            <div>
              <small>Logo preview</small>
              <strong>{form.name || "Municipality"}</strong>
            </div>
          </div>
        )}

        <div className="municipality-safe-note">
          <Icon name="lock" />
          <p>
            {editing
              ? "Only operational fields are editable here. Protected master fields stay unchanged even when you save."
              : "Review the protected master fields carefully. Once created, code, name, province, and region are intentionally locked."}
          </p>
        </div>
      </section>

      <div className="form-actions">
        <button className="button ghost btn btn-light" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button primary btn btn-success" disabled={submitting} type="submit">
          <Icon name="save" />
          <span>{submitting ? "Saving..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
