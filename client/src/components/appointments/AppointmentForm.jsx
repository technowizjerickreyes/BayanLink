import FormField from "../common/FormField.jsx";
import Icon from "../common/Icon.jsx";
import { appointmentServices } from "../../utils/serviceCatalog.js";

export default function AppointmentForm({ form, onChange, onSubmit, onCancel, submitting, requestOptions = [] }) {
  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-grid two">
        <FormField label="Service" name="serviceId" onChange={onChange} options={appointmentServices.map((item) => ({ value: item.value, label: item.label }))} type="select" value={form.serviceId} />
        <FormField
          label="Linked request"
          name="linkedRequestId"
          onChange={onChange}
          options={[{ value: "", label: "None" }, ...requestOptions]}
          type="select"
          value={form.linkedRequestId}
        />
      </div>

      <div className="form-grid two">
        <FormField label="Date" min={new Date().toISOString().slice(0, 10)} name="date" onChange={onChange} required type="date" value={form.date} />
        <FormField label="Time slot" name="timeSlot" onChange={onChange} required type="time" value={form.timeSlot} />
      </div>

      <FormField label="Purpose" name="purpose" onChange={onChange} required rows="4" type="textarea" value={form.purpose} />
      <FormField label="Notes" name="notes" onChange={onChange} rows="3" type="textarea" value={form.notes} />

      <div className="form-actions">
        <button className="button ghost btn btn-light" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button primary btn btn-success" disabled={submitting} type="submit">
          <Icon name="save" />
          <span>{submitting ? "Saving..." : "Book Appointment"}</span>
        </button>
      </div>
    </form>
  );
}
