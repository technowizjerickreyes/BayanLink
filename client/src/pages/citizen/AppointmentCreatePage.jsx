import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointments/AppointmentForm.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { createAppointment } from "../../services/appointmentService.js";
import { getDocumentRequests } from "../../services/documentRequestService.js";

export default function AppointmentCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serviceId: "document_release",
    linkedRequestId: "",
    date: "",
    timeSlot: "",
    purpose: "",
    notes: "",
  });
  const [requestOptions, setRequestOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await getDocumentRequests("citizen", { limit: 100 });
        const options = (response.data || []).map((item) => ({
          value: item._id,
          label: `${item.trackingNumber} - ${item.serviceName}`,
        }));
        setRequestOptions(options);
      } catch {
        setRequestOptions([]);
      }
    };

    loadRequests();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await createAppointment({
        serviceId: form.serviceId,
        linkedRequestId: form.linkedRequestId || undefined,
        date: form.date,
        timeSlot: form.timeSlot,
        purpose: form.purpose,
        notes: form.notes || undefined,
      });
      navigate("/citizen/appointments");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader description="Book a service appointment for release, consultations, or office visits." eyebrow="Citizen Services" title="New Appointment" />
      {error && <ErrorState message={error} />}
      <AppointmentForm
        form={form}
        onCancel={() => navigate("/citizen/appointments")}
        onChange={(event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))}
        onSubmit={handleSubmit}
        requestOptions={requestOptions}
        submitting={submitting}
      />
    </div>
  );
}
