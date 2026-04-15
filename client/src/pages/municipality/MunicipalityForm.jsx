import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";

export default function MunicipalityForm({ form, onChange, onSubmit, submitting, submitLabel, onCancel }) {
  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <FormInput label="Name" name="name" onChange={onChange} required value={form.name} />
      <FormInput label="Province" name="province" onChange={onChange} required value={form.province} />
      <FormInput label="Mayor" name="mayor" onChange={onChange} required value={form.mayor} />
      <FormInput
        label="Population"
        min="0"
        name="population"
        onChange={onChange}
        required
        type="number"
        value={form.population}
      />

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
