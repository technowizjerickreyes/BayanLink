import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentRequestForm from "../../components/requests/DocumentRequestForm.jsx";
import { buildCitizenRequestInitialForm, extractApiFieldErrors, getApiErrorMessage, validateCitizenRequestForm, validateCitizenRequestStep } from "../../components/requests/documentRequestUtils.js";
import ErrorState from "../../components/common/ErrorState.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { createDocumentRequest } from "../../services/documentRequestService.js";
import { uploadAttachments } from "../../services/uploadService.js";

export default function DocumentRequestCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedType = useMemo(() => location.state?.requestType || "", [location.state]);
  const [form, setForm] = useState(() => buildCitizenRequestInitialForm(user, requestedType));
  const [activeStep, setActiveStep] = useState(requestedType ? 1 : 0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successRequest, setSuccessRequest] = useState(null);

  const handleChange = (event) => {
    const target = event.currentTarget || event.target;
    const { name, value } = target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSelectRequestType = (requestType) => {
    setForm((current) => ({ ...current, requestType }));
    setFieldErrors((current) => ({ ...current, requestType: "" }));
  };

  const handleNext = () => {
    const stepErrors = validateCitizenRequestStep(["service", "details", "requirements", "review"][activeStep], form, selectedFiles);

    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...stepErrors }));
      setError("Please review the highlighted fields before continuing.");
      return;
    }

    setError("");
    setActiveStep((current) => Math.min(current + 1, 3));
  };

  const handlePrevious = () => {
    setError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleFileChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setSelectedFiles(nextFiles);
    setFieldErrors((current) => ({ ...current, attachments: "" }));
  };

  const handleRemoveFile = (targetFile) => {
    setSelectedFiles((current) => current.filter((file) => !(file.name === targetFile.name && file.size === targetFile.size)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateCitizenRequestForm(form, selectedFiles);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please review the highlighted fields before submitting your request.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setFieldErrors({});
      const attachments = await uploadAttachments(selectedFiles);
      const response = await createDocumentRequest({
        requestType: form.requestType,
        submittedData: {
          fullName: form.fullName,
          birthDate: form.birthDate || undefined,
          civilStatus: form.civilStatus || undefined,
          purpose: form.purpose,
          deliveryPreference: form.deliveryPreference,
          notes: form.notes || undefined,
        },
        attachments,
      });

      setSuccessRequest(response.data);
      setSelectedFiles([]);
    } catch (requestError) {
      setFieldErrors(extractApiFieldErrors(requestError, "submittedData."));
      setError(getApiErrorMessage(requestError, "Failed to submit the request."));
    } finally {
      setSubmitting(false);
    }
  };

  if (successRequest) {
    return (
      <div className="page-stack narrow">
        <PageHeader
          description="Your document request was submitted successfully. Save the tracking number below so you can check the status anytime."
          eyebrow="Citizen Services"
          title="Request Submitted"
        />
        <section className="document-success-panel">
          <span className="document-success-icon">
            <Icon name="check" />
          </span>
          <p className="eyebrow">Tracking number</p>
          <h2>{successRequest.trackingNumber}</h2>
          <p>{successRequest.serviceName} is now in the system. The office will review it and update the timeline as it moves forward.</p>
          <div className="document-success-actions">
            <button className="button primary btn btn-success" onClick={() => navigate(`/citizen/document-requests/${successRequest._id}`)} type="button">
              View request details
            </button>
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/document-requests")} type="button">
              Open request history
            </button>
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/request-tracking")} type="button">
              Track another request
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        action="Browse Services"
        description="Follow the guided steps below. The form is intentionally short and will show the requirements before you submit."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/document-requests/services")}
        title="Submit Document Request"
      />
      {error && <ErrorState message={error} />}
      <DocumentRequestForm
        activeStep={activeStep}
        fieldErrors={fieldErrors}
        form={form}
        onBack={() => navigate("/citizen/document-requests/services")}
        onCancel={() => navigate("/citizen/document-requests")}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onRemoveFile={handleRemoveFile}
        onSelectRequestType={handleSelectRequestType}
        onSubmit={handleSubmit}
        selectedFiles={selectedFiles}
        submitting={submitting}
      />
    </div>
  );
}
