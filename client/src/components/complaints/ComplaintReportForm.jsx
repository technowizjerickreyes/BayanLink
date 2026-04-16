import FormField from "../common/FormField.jsx";
import Icon from "../common/Icon.jsx";
import { complaintCategories } from "../../utils/serviceCatalog.js";

export default function ComplaintReportForm({ form, onChange, onSubmit, onCancel, onFileChange, selectedFiles = [], submitting }) {
  return (
    <form className="complaint-form-shell" onSubmit={onSubmit}>
      <div className="complaint-form-main">
        <section className="complaint-panel">
          <div className="complaint-panel-head">
            <div>
              <p className="eyebrow">Issue details</p>
              <h2>Describe the concern clearly</h2>
              <p>Choose the issue category first, then explain what happened in plain language so the assigned office can respond faster.</p>
            </div>
          </div>

          <div className="form-grid two">
            <FormField label="Category" name="category" onChange={onChange} options={complaintCategories} type="select" value={form.category} />
            <FormField label="Barangay" name="barangayId" onChange={onChange} placeholder="Barangay name or code" value={form.barangayId} />
          </div>

          <FormField label="Issue title" name="title" onChange={onChange} required value={form.title} />
          <FormField label="What happened?" name="description" onChange={onChange} required rows="5" type="textarea" value={form.description} />
        </section>

        <section className="complaint-panel">
          <div className="complaint-panel-head">
            <div>
              <p className="eyebrow">Location</p>
              <h2>Point the office to the right place</h2>
              <p>Add the address and a useful landmark. Coordinates are optional, but helpful when you already have them.</p>
            </div>
          </div>

          <div className="form-grid two">
            <FormField label="Address / location" name="address" onChange={onChange} required value={form.address} />
            <FormField label="Landmark" name="landmark" onChange={onChange} value={form.landmark} />
          </div>

          <div className="form-grid two">
            <FormField label="Latitude" name="latitude" onChange={onChange} placeholder="Optional" value={form.latitude} />
            <FormField label="Longitude" name="longitude" onChange={onChange} placeholder="Optional" value={form.longitude} />
          </div>
        </section>

        <section className="complaint-panel">
          <div className="complaint-panel-head">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>Add photos or supporting files</h2>
              <p>Photos make community reports easier to validate, especially for damage, safety, drainage, or waste complaints.</p>
            </div>
          </div>

          <div className="document-upload-zone">
            <span className="document-upload-zone-icon">
              <Icon name="file" />
            </span>
            <strong>Upload images or files</strong>
            <p>Accepted: images, PDF, DOC, or DOCX. You can upload multiple files in one submission.</p>
            <FormField accept=".pdf,.doc,.docx,image/*" label="Photo or supporting files" multiple onChange={onFileChange} type="file" />
          </div>

          {selectedFiles.length > 0 && (
            <div className="document-upload-list">
              {selectedFiles.map((file) => (
                <div className="document-upload-item" key={`${file.name}-${file.size}`}>
                  <div>
                    <strong>{file.name}</strong>
                    <small>{Math.max(file.size / 1024, 1).toFixed(0)} KB</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="form-actions">
          <button className="button ghost btn btn-light" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button primary btn btn-success" disabled={submitting} type="submit">
            <Icon name="save" />
            <span>{submitting ? "Submitting..." : "Submit Report"}</span>
          </button>
        </div>
      </div>

      <aside className="complaint-summary-card">
        <div className="complaint-panel-head">
          <div>
            <p className="eyebrow">Submission guide</p>
            <h2>What makes a strong report</h2>
          </div>
        </div>

        <div className="appointment-summary-stack">
          <div>
            <small>Be specific</small>
            <strong>Describe what residents or the office should notice first.</strong>
          </div>
          <div>
            <small>Use a precise location</small>
            <strong>Addresses and landmarks help the assigned team confirm the site faster.</strong>
          </div>
          <div>
            <small>Add evidence</small>
            <strong>Attach photos whenever you can, especially for damage, flooding, or waste reports.</strong>
          </div>
        </div>
      </aside>
    </form>
  );
}
