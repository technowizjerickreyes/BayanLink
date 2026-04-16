import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintReportForm from "../../components/complaints/ComplaintReportForm.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { createComplaint } from "../../services/complaintReportService.js";
import { uploadAttachments } from "../../services/uploadService.js";

export default function ComplaintCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "waste",
    barangayId: user?.barangayId || "",
    title: "",
    description: "",
    address: "",
    landmark: "",
    latitude: "",
    longitude: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successItem, setSuccessItem] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const attachments = await uploadAttachments(selectedFiles);
      const response = await createComplaint({
        category: form.category,
        title: form.title,
        description: form.description,
        attachments,
        location: {
          address: form.address,
          barangayId: form.barangayId,
          landmark: form.landmark || undefined,
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
        },
      });
      setSuccessItem(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to submit the complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  if (successItem) {
    return (
      <div className="page-stack narrow">
        <PageHeader
          description="Your report is now in the system. Keep the tracking number below so you can follow updates and office actions."
          eyebrow="Citizen Services"
          title="Report Submitted"
        />
        <section className="document-success-panel appointment-success-panel">
          <span className="document-success-icon">
            <Icon name="check" />
          </span>
          <p className="eyebrow">Tracking number</p>
          <h2>{successItem.trackingNumber}</h2>
          <p>{successItem.title} was submitted successfully. The assigned office will review the report and update the complaint timeline as it moves forward.</p>
          <div className="document-success-actions">
            <button className="button primary btn btn-success" onClick={() => navigate(`/citizen/complaints/${successItem._id}`)} type="button">
              View complaint details
            </button>
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/complaints")} type="button">
              Open complaint history
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        action="Open Reports"
        description="Submit a community issue report with location details, clear notes, and supporting photos."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/complaints")}
        title="New Complaint or Report"
      />
      {error && <ErrorState message={error} />}
      <ComplaintReportForm
        form={form}
        onCancel={() => navigate("/citizen/complaints")}
        onChange={(event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))}
        onFileChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
        onSubmit={handleSubmit}
        selectedFiles={selectedFiles}
        submitting={submitting}
      />
    </div>
  );
}
