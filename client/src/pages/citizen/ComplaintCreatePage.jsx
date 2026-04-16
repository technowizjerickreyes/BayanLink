import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintReportForm from "../../components/complaints/ComplaintReportForm.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
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
      navigate(`/citizen/complaints/${response.data._id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to submit the complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader description="Submit a community issue report with location details and supporting photos." eyebrow="Citizen Services" title="New Complaint or Report" />
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
