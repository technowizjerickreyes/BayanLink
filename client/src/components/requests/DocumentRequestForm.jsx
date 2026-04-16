import FormField from "../common/FormField.jsx";
import Icon from "../common/Icon.jsx";
import { documentRequestTypes } from "../../utils/serviceCatalog.js";
import {
  citizenRequestSteps,
  formatAttachmentSize,
  getDocumentRequestDefinition,
  getDocumentScopeLabel,
  normalizeDocumentFieldLabel,
} from "./documentRequestUtils.js";

function StepIndicator({ activeStep }) {
  return (
    <div className="document-stepper">
      {citizenRequestSteps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;

        return (
          <div className={`document-step ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} key={step.key}>
            <span>{isComplete ? "OK" : index + 1}</span>
            <strong>{step.label}</strong>
          </div>
        );
      })}
    </div>
  );
}

function SelectedFilesList({ onRemoveFile, selectedFiles }) {
  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="document-upload-list">
      {selectedFiles.map((file) => (
        <div className="document-upload-item" key={`${file.name}-${file.size}`}>
          <div>
            <strong>{file.name}</strong>
            <small>{formatAttachmentSize(file.size)}</small>
          </div>
          <button className="button ghost btn btn-light" onClick={() => onRemoveFile(file)} type="button">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function ServiceStep({ fieldErrors, form, onSelectRequestType, selectedType }) {
  return (
    <div className="document-form-step">
      <div className="document-step-copy">
        <p className="eyebrow">Step 1</p>
        <h2>Choose the document service you need</h2>
        <p>Select one service first. The next steps will only ask for details relevant to that request.</p>
      </div>

      <div className="document-service-grid">
        {documentRequestTypes.map((service) => (
          <button
            className={`document-service-card selectable ${form.requestType === service.value ? "active" : ""}`}
            key={service.value}
            onClick={() => onSelectRequestType(service.value)}
            type="button"
          >
            <div className="document-service-top">
              <div>
                <span className={`news-scope-pill ${service.scope}`}>{getDocumentScopeLabel(service.scope)}</span>
                <h2>{service.label}</h2>
              </div>
              <span className="table-badge">{service.processingDays}</span>
            </div>
            <p>{service.description}</p>
            <div className="document-service-meta">
              <div>
                <small>Fee</small>
                <strong>{service.feeLabel || "No fee listed"}</strong>
              </div>
              <div>
                <small>Requirements</small>
                <strong>{service.requirements.length} item(s)</strong>
              </div>
            </div>
          </button>
        ))}
      </div>

      {fieldErrors.requestType && <small className="field-error">{fieldErrors.requestType}</small>}

      <div className="document-requirement-box">
        <small>Requirements for {selectedType.label}</small>
        <ul>
          {selectedType.requirements.map((requirement) => (
            <li key={`${selectedType.value}-${requirement}`}>{requirement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DetailsStep({ fieldErrors, form, onChange }) {
  return (
    <div className="document-form-step">
      <div className="document-step-copy">
        <p className="eyebrow">Step 2</p>
        <h2>Tell us who the request is for</h2>
        <p>Use the name and personal details that should match the requested document and supporting files.</p>
      </div>

      <div className="form-grid two">
        <FormField error={fieldErrors.fullName} label="Full name" name="fullName" onChange={onChange} required value={form.fullName} />
        <FormField error={fieldErrors.birthDate} label="Birth date" name="birthDate" onChange={onChange} type="date" value={form.birthDate} />
      </div>
      <div className="form-grid two">
        <FormField
          error={fieldErrors.civilStatus}
          hint="Optional. For example: Single, Married, Widowed."
          label="Civil status"
          name="civilStatus"
          onChange={onChange}
          placeholder="Single, Married, etc."
          value={form.civilStatus}
        />
        <div className="document-inline-note">
          <Icon name="people" />
          <p>Double-check the full name before continuing so the office can match your request more easily.</p>
        </div>
      </div>
    </div>
  );
}

function RequirementsStep({ fieldErrors, form, onChange, onFileChange, onRemoveFile, selectedFiles, selectedType }) {
  return (
    <div className="document-form-step">
      <div className="document-step-copy">
        <p className="eyebrow">Step 3</p>
        <h2>Explain the request and upload requirements</h2>
        <p>Use simple wording. If you are not sure, describe how you plan to use the document and upload the requirements you already have.</p>
      </div>

      <div className="document-requirement-box">
        <small>Required supporting files</small>
        <ul>
          {selectedType.requirements.map((requirement) => (
            <li key={`${selectedType.value}-${requirement}`}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="form-grid two">
        <FormField
          hint="Choose office pickup unless you already know you need an appointment."
          label="Release preference"
          name="deliveryPreference"
          onChange={onChange}
          options={[
            { value: "pickup", label: "Office pickup" },
            { value: "appointment", label: "Pickup by appointment" },
          ]}
          type="select"
          value={form.deliveryPreference}
        />
        <FormField
          error={fieldErrors.notes}
          hint="Optional. Add anything the staff should know before reviewing the request."
          label="Additional notes"
          name="notes"
          onChange={onChange}
          placeholder="Optional notes for the service desk"
          rows="4"
          type="textarea"
          value={form.notes}
        />
      </div>

      <FormField
        error={fieldErrors.purpose}
        hint="Example: Employment requirement, school scholarship, hospital assistance, business permit processing."
        label="Purpose of request"
        name="purpose"
        onChange={onChange}
        placeholder="Why do you need this document?"
        required
        rows="5"
        type="textarea"
        value={form.purpose}
      />

      <label className={`document-upload-zone ${fieldErrors.attachments ? "error" : ""}`}>
        <input accept=".pdf,.doc,.docx,image/*" multiple onChange={onFileChange} type="file" />
        <span className="document-upload-zone-icon">
          <Icon name="file" />
        </span>
        <strong>Upload supporting files</strong>
        <p>Accepted files: PDF, Word, JPG, PNG, or WEBP. You can upload up to 5 files, 5 MB each.</p>
      </label>
      {fieldErrors.attachments && <small className="field-error">{fieldErrors.attachments}</small>}
      <SelectedFilesList onRemoveFile={onRemoveFile} selectedFiles={selectedFiles} />
    </div>
  );
}

function ReviewStep({ form, selectedFiles, selectedType }) {
  return (
    <div className="document-form-step">
      <div className="document-step-copy">
        <p className="eyebrow">Step 4</p>
        <h2>Review everything before submitting</h2>
        <p>Once submitted, you will receive a tracking number. You can use it to check progress and follow the next office instructions.</p>
      </div>

      <div className="document-review-grid">
        <article className="document-review-card">
          <small>Selected service</small>
          <strong>{selectedType.label}</strong>
          <p>{selectedType.description}</p>
          <span>{selectedType.processingDays}</span>
          <span>{selectedType.feeLabel || "No fee listed"}</span>
        </article>

        <article className="document-review-card">
          <small>Request summary</small>
          <strong>{form.fullName}</strong>
          <p>{form.purpose || "No purpose provided yet."}</p>
          <span>{form.deliveryPreference === "appointment" ? "Pickup by appointment" : "Office pickup"}</span>
          <span>{selectedFiles.length} file(s) attached</span>
        </article>
      </div>

      <div className="detail-copy">
        <h2>Submitted details</h2>
        <dl className="key-value-list">
          {Object.entries({
            fullName: form.fullName,
            birthDate: form.birthDate || "-",
            civilStatus: form.civilStatus || "-",
            purpose: form.purpose,
            deliveryPreference: form.deliveryPreference === "appointment" ? "Pickup by appointment" : "Office pickup",
            notes: form.notes || "-",
          }).map(([key, value]) => (
            <div key={key}>
              <dt>{normalizeDocumentFieldLabel(key)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function DocumentRequestForm({
  activeStep,
  fieldErrors = {},
  form,
  onBack,
  onCancel,
  onChange,
  onFileChange,
  onNext,
  onPrevious,
  onRemoveFile,
  onSelectRequestType,
  onSubmit,
  selectedFiles = [],
  submitting,
}) {
  const selectedType = getDocumentRequestDefinition(form.requestType);

  return (
    <form className="form-panel document-request-form" onSubmit={onSubmit}>
      <StepIndicator activeStep={activeStep} />

      <section className="document-request-shell">
        <div className="document-request-main">
          {activeStep === 0 && (
            <ServiceStep fieldErrors={fieldErrors} form={form} onSelectRequestType={onSelectRequestType} selectedType={selectedType} />
          )}
          {activeStep === 1 && <DetailsStep fieldErrors={fieldErrors} form={form} onChange={onChange} />}
          {activeStep === 2 && (
            <RequirementsStep
              fieldErrors={fieldErrors}
              form={form}
              onChange={onChange}
              onFileChange={onFileChange}
              onRemoveFile={onRemoveFile}
              selectedFiles={selectedFiles}
              selectedType={selectedType}
            />
          )}
          {activeStep === 3 && <ReviewStep form={form} selectedFiles={selectedFiles} selectedType={selectedType} />}
        </div>

        <aside className="document-request-aside">
          <div className="document-request-side-card">
            <p className="eyebrow">Selected document</p>
            <h2>{selectedType.label}</h2>
            <p>{selectedType.description}</p>
            <div className="document-service-meta compact">
              <div>
                <small>Estimated time</small>
                <strong>{selectedType.processingDays}</strong>
              </div>
              <div>
                <small>Fee</small>
                <strong>{selectedType.feeLabel || "No fee listed"}</strong>
              </div>
            </div>
          </div>

          <div className="document-request-side-card">
            <p className="eyebrow">Helpful reminder</p>
            <p>Prepare your requirements before submitting so the office can review the request faster.</p>
          </div>
        </aside>
      </section>

      <div className="form-actions">
        <button className="button ghost btn btn-light" onClick={onCancel} type="button">
          Cancel
        </button>
        {activeStep > 0 && (
          <button className="button ghost btn btn-light" onClick={onPrevious} type="button">
            Previous
          </button>
        )}
        {activeStep < citizenRequestSteps.length - 1 ? (
          <button className="button primary btn btn-success" onClick={onNext} type="button">
            <span>Continue</span>
          </button>
        ) : (
          <button className="button primary btn btn-success" disabled={submitting} type="submit">
            <Icon name="save" />
            <span>{submitting ? "Submitting..." : "Submit Request"}</span>
          </button>
        )}
      </div>

      {activeStep > 0 && (
        <div className="document-form-footer">
          <button className="button ghost btn btn-light" onClick={onBack} type="button">
            <Icon name="file" />
            <span>Back to service catalog</span>
          </button>
        </div>
      )}
    </form>
  );
}
