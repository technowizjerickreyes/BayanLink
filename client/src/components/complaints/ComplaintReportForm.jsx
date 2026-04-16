import FormField from "../common/FormField.jsx";
import Icon from "../common/Icon.jsx";
import { complaintCategories } from "../../utils/serviceCatalog.js";

export default function ComplaintReportForm({ form, onChange, onSubmit, onCancel, onFileChange, selectedFiles = [], submitting }) {
  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-grid two">
        <FormField label="Category" name="category" onChange={onChange} options={complaintCategories} type="select" value={form.category} />
        <FormField label="Barangay" name="barangayId" onChange={onChange} placeholder="Barangay name or code" value={form.barangayId} />
      </div>

      <FormField label="Title" name="title" onChange={onChange} required value={form.title} />
      <FormField label="Description" name="description" onChange={onChange} required rows="5" type="textarea" value={form.description} />

      <div className="form-grid two">
        <FormField label="Address / location" name="address" onChange={onChange} required value={form.address} />
        <FormField label="Landmark" name="landmark" onChange={onChange} value={form.landmark} />
      </div>

      <div className="form-grid two">
        <FormField label="Latitude" name="latitude" onChange={onChange} placeholder="Optional" value={form.latitude} />
        <FormField label="Longitude" name="longitude" onChange={onChange} placeholder="Optional" value={form.longitude} />
      </div>

      <FormField accept=".pdf,.doc,.docx,image/*" label="Photo or supporting files" multiple onChange={onFileChange} type="file" />

      {selectedFiles.length > 0 && (
        <ul className="file-list">
          {selectedFiles.map((file) => (
            <li key={`${file.name}-${file.size}`}>{file.name}</li>
          ))}
        </ul>
      )}

      <div className="form-actions">
        <button className="button ghost btn btn-light" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button primary btn btn-success" disabled={submitting} type="submit">
          <Icon name="save" />
          <span>{submitting ? "Submitting..." : "Submit Report"}</span>
        </button>
      </div>
    </form>
  );
}
