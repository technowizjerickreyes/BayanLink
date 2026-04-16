import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointments/AppointmentForm.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { createAppointment, getAppointmentAvailability } from "../../services/appointmentService.js";
import { getDocumentRequests } from "../../services/documentRequestService.js";
import { formatDate, formatTimeSlot } from "../../utils/formatters.js";
import { createQuickAppointmentDates, formatInputDate, getAppointmentReference } from "../../utils/appointmentUtils.js";

const quickDates = createQuickAppointmentDates(7);

const initialForm = {
  serviceId: "document_release",
  linkedRequestId: "",
  date: quickDates[0]?.value || formatInputDate(new Date()),
  timeSlot: "",
  purpose: "",
  notes: "",
};

function validateAppointmentStep(step, form) {
  const errors = {};

  if (step === 0 && !form.serviceId) {
    errors.serviceId = "Please choose a service before continuing.";
  }

  if (step === 1) {
    if (!form.date) {
      errors.date = "Please choose a visit date.";
    }

    if (!form.timeSlot) {
      errors.timeSlot = "Please select an available time slot.";
    }

    if (!form.purpose.trim()) {
      errors.purpose = "Please enter the purpose of your visit.";
    }
  }

  return errors;
}

function validateAppointmentForm(form) {
  return {
    ...validateAppointmentStep(0, form),
    ...validateAppointmentStep(1, form),
  };
}

export default function AppointmentCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [requestOptions, setRequestOptions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successAppointment, setSuccessAppointment] = useState(null);

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

  useEffect(() => {
    if (!form.serviceId || !form.date) {
      setAvailability(null);
      setAvailabilityError("");
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");
        const response = await getAppointmentAvailability("citizen", {
          serviceId: form.serviceId,
          date: form.date,
        });

        if (cancelled) {
          return;
        }

        setAvailability(response.data);

        if ((response.data?.bookedTimeSlots || []).includes(form.timeSlot)) {
          setForm((current) => ({ ...current, timeSlot: "" }));
        }
      } catch (requestError) {
        if (!cancelled) {
          setAvailability(null);
          setAvailabilityError(requestError.response?.data?.message || "Failed to load slot availability.");
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [form.serviceId, form.date]);

  const handleChange = (event) => {
    const target = event.currentTarget || event.target;
    const { name, value } = target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "date" ? { timeSlot: "" } : {}),
    }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const handleSelectService = (serviceId) => {
    setForm((current) => ({
      ...current,
      serviceId,
      timeSlot: "",
    }));
    setFieldErrors((current) => ({ ...current, serviceId: "", timeSlot: "" }));
    setError("");
  };

  const handleSelectDate = (date) => {
    setForm((current) => ({
      ...current,
      date,
      timeSlot: "",
    }));
    setFieldErrors((current) => ({ ...current, date: "", timeSlot: "" }));
    setError("");
  };

  const handleNext = () => {
    const nextErrors = validateAppointmentStep(step, form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...nextErrors }));
      setError("Please review the highlighted fields before continuing.");
      return;
    }

    setError("");
    setStep((current) => Math.min(current + 1, 2));
  };

  const handlePrevious = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateAppointmentForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please complete the booking form before submitting your appointment.");
      setStep(1);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await createAppointment({
        serviceId: form.serviceId,
        linkedRequestId: form.linkedRequestId || undefined,
        date: form.date,
        timeSlot: form.timeSlot,
        purpose: form.purpose.trim(),
        notes: form.notes.trim() || undefined,
      });

      setSuccessAppointment(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setForm({
      ...initialForm,
      date: quickDates[0]?.value || formatInputDate(new Date()),
    });
    setStep(0);
    setFieldErrors({});
    setError("");
    setSuccessAppointment(null);
  };

  if (successAppointment) {
    return (
      <div className="page-stack narrow">
        <PageHeader
          description="Your appointment has been recorded. The office will confirm the schedule and any follow-up instructions inside your appointment details."
          eyebrow="Citizen Services"
          title="Appointment Requested"
        />
        <section className="document-success-panel appointment-success-panel">
          <span className="document-success-icon">
            <Icon name="check" />
          </span>
          <p className="eyebrow">Reference</p>
          <h2>{getAppointmentReference(successAppointment)}</h2>
          <p>
            {successAppointment.serviceName} is scheduled for {formatDate(successAppointment.date)} at {formatTimeSlot(successAppointment.timeSlot)}.
          </p>
          <div className="appointment-success-meta">
            <div>
              <small>Status</small>
              <strong>Pending confirmation</strong>
            </div>
            <div>
              <small>Date</small>
              <strong>{formatDate(successAppointment.date)}</strong>
            </div>
            <div>
              <small>Time</small>
              <strong>{formatTimeSlot(successAppointment.timeSlot)}</strong>
            </div>
          </div>
          <div className="document-success-actions">
            <button className="button primary btn btn-success" onClick={() => navigate(`/citizen/appointments/${successAppointment._id}`)} type="button">
              View appointment details
            </button>
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/appointments")} type="button">
              Open appointment history
            </button>
            <button className="button ghost btn btn-light" onClick={resetBooking} type="button">
              Book another appointment
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        action="View History"
        description="Choose a service, see real slot availability, and confirm your visit in a short guided flow."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/appointments")}
        title="Book Appointment"
      />
      {error && <ErrorState message={error} />}
      <AppointmentForm
        availability={availability}
        availabilityError={availabilityError}
        availabilityLoading={availabilityLoading}
        fieldErrors={fieldErrors}
        form={form}
        onCancel={() => navigate("/citizen/appointments")}
        onChange={handleChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSelectDate={handleSelectDate}
        onSelectService={handleSelectService}
        onSelectTimeSlot={(timeSlot) => {
          setForm((current) => ({ ...current, timeSlot }));
          setFieldErrors((current) => ({ ...current, timeSlot: "" }));
        }}
        onSubmit={handleSubmit}
        quickDates={quickDates}
        requestOptions={requestOptions}
        step={step}
        submitting={submitting}
      />
    </div>
  );
}
