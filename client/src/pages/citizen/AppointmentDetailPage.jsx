import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppointmentSlotSelector from "../../components/appointments/AppointmentSlotSelector.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getAppointment, getAppointmentAvailability, updateAppointment } from "../../services/appointmentService.js";
import { formatDate, formatDateTime, formatTimeSlot } from "../../utils/formatters.js";
import {
  buildAppointmentSlotState,
  canCitizenManageAppointment,
  createQuickAppointmentDates,
  formatInputDate,
  getAppointmentAvailabilitySummary,
  getAppointmentPolicyLabel,
  getAppointmentReference,
  getAppointmentScopeLabel,
} from "../../utils/appointmentUtils.js";

const quickDates = createQuickAppointmentDates(7);

function buildRescheduleForm(item) {
  return {
    date: formatInputDate(item?.date),
    timeSlot: item?.timeSlot || "",
    purpose: item?.purpose || "",
    notes: item?.notes || "",
  };
}

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [pendingAction, setPendingAction] = useState(location.state?.action || "");

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAppointment("citizen", id);
      setItem(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load the appointment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointment();
  }, [id]);

  useEffect(() => {
    if (!item || !pendingAction) {
      return;
    }

    if (pendingAction === "reschedule" && canCitizenManageAppointment(item)) {
      setEditing({ form: buildRescheduleForm(item) });
    }

    if (pendingAction === "cancel" && canCitizenManageAppointment(item)) {
      setCancelling(true);
    }

    setPendingAction("");
  }, [item, pendingAction]);

  useEffect(() => {
    if (!item?.serviceId || !editing?.form?.date) {
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
          serviceId: item.serviceId,
          date: editing.form.date,
          excludeId: item._id,
        });

        if (cancelled) {
          return;
        }

        setAvailability(response.data);

        if ((response.data?.bookedTimeSlots || []).includes(editing.form.timeSlot)) {
          setEditing((current) => (current ? { ...current, form: { ...current.form, timeSlot: "" } } : current));
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
  }, [editing?.form?.date, item?._id, item?.serviceId]);

  const canManage = canCitizenManageAppointment(item);
  const slotSummary = getAppointmentAvailabilitySummary(availability);
  const slotOptions = buildAppointmentSlotState({
    availability,
    selectedTimeSlot: editing?.form?.timeSlot || "",
  });

  const handleReschedule = async () => {
    if (!editing?.form?.date || !editing.form.timeSlot || !editing.form.purpose.trim()) {
      setError("Choose a date, select an available time slot, and enter a clear purpose before saving changes.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await updateAppointment("citizen", item._id, {
        date: editing.form.date,
        timeSlot: editing.form.timeSlot,
        purpose: editing.form.purpose.trim(),
        notes: editing.form.notes.trim() || undefined,
      });
      setEditing(null);
      await loadAppointment();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      setSubmitting(true);
      setError("");
      await updateAppointment("citizen", item._id, { status: "cancelled" });
      setCancelling(false);
      await loadAppointment();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to cancel the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        action="Back to History"
        description="Review your appointment schedule, latest office updates, and any linked request details in one place."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/appointments")}
        title={item ? item.serviceName : "Appointment Details"}
      />

      {loading && <LoadingState message="Loading appointment details..." />}
      {error && <ErrorState message={error} />}

      {!loading && item && (
        <>
          <section className="document-module-hero detail">
            <div className="document-module-hero-copy">
              <p className="eyebrow">Reference {getAppointmentReference(item)}</p>
              <h2>{item.serviceName}</h2>
              <p>{item.purpose}</p>
            </div>
            <div className="document-module-hero-pills detail">
              <span>
                <StatusBadge value={item.status} />
              </span>
              <span>{formatDate(item.date)} at {formatTimeSlot(item.timeSlot)}</span>
              <span>{getAppointmentScopeLabel(item.scope)}</span>
            </div>
          </section>

          <div className="appointment-detail-layout">
            <div className="appointment-detail-main">
              <section className="appointment-panel">
                <div className="appointment-section-head">
                  <div>
                    <p className="eyebrow">Visit summary</p>
                    <h2>Reference details</h2>
                    <p>Use the details below when you need to confirm your visit or prepare your documents before going to the office.</p>
                  </div>
                </div>

                <div className="appointment-review-grid">
                  <div className="appointment-review-card">
                    <small>Status</small>
                    <strong>{item.status}</strong>
                    <p>{getAppointmentPolicyLabel(item)}</p>
                  </div>
                  <div className="appointment-review-card">
                    <small>Date</small>
                    <strong>{formatDate(item.date)}</strong>
                    <p>{formatTimeSlot(item.timeSlot)}</p>
                  </div>
                  <div className="appointment-review-card">
                    <small>Office</small>
                    <strong>{getAppointmentScopeLabel(item.scope)}</strong>
                    <p>{item.serviceName}</p>
                  </div>
                  <div className="appointment-review-card">
                    <small>Requested on</small>
                    <strong>{formatDateTime(item.createdAt)}</strong>
                    <p>Keep this timestamp for your records.</p>
                  </div>
                </div>

                <div className="detail-copy">
                  <h2>Purpose</h2>
                  <p>{item.purpose}</p>
                </div>

                {item.notes && (
                  <div className="detail-copy">
                    <h2>Citizen notes</h2>
                    <p>{item.notes}</p>
                  </div>
                )}
              </section>

              {item.linkedRequestId && (
                <section className="appointment-panel">
                  <div className="appointment-section-head">
                    <div>
                      <p className="eyebrow">Linked request</p>
                      <h2>{item.linkedRequestId.serviceName}</h2>
                      <p>The appointment is connected to an existing document request for faster office validation.</p>
                    </div>
                  </div>
                  <div className="appointment-inline-note">
                    <strong>Tracking number:</strong>
                    <span>{item.linkedRequestId.trackingNumber}</span>
                  </div>
                  <div className="appointment-history-actions">
                    <button className="button ghost btn btn-light" onClick={() => navigate(`/citizen/document-requests/${item.linkedRequestId._id}`)} type="button">
                      Open linked request
                    </button>
                  </div>
                </section>
              )}

              <section className="appointment-panel">
                <div className="appointment-section-head">
                  <div>
                    <p className="eyebrow">History</p>
                    <h2>Status timeline</h2>
                    <p>Every important appointment update is recorded below so you can see what changed and when.</p>
                  </div>
                </div>
                <div className="appointment-timeline">
                  {[...(item.history || [])].reverse().map((entry, index) => (
                    <article className="appointment-timeline-item" key={`${entry.changedAt}-${index}`}>
                      <div className="appointment-timeline-top">
                        <div>
                          <strong>{entry.status}</strong>
                          <p>{entry.remarks || "Status updated."}</p>
                        </div>
                        <small>{formatDateTime(entry.changedAt)}</small>
                      </div>
                      <span>{entry.changedByRole ? entry.changedByRole.replaceAll("_", " ") : "System update"}</span>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="appointment-detail-aside">
              <section className="appointment-summary-card">
                <div className="appointment-summary-head">
                  <p className="eyebrow">Next step</p>
                  <h2>{canManage ? "Manage this appointment" : "Schedule locked"}</h2>
                  <p>
                    {canManage
                      ? "You can still reschedule or cancel because the visit is more than 12 hours away and still active."
                      : "Rescheduling and cancellation are disabled once the appointment is too close or already closed."}
                  </p>
                </div>

                <div className="appointment-summary-stack">
                  <div>
                    <small>Reference</small>
                    <strong>{getAppointmentReference(item)}</strong>
                  </div>
                  <div>
                    <small>Current schedule</small>
                    <strong>{formatDate(item.date)} at {formatTimeSlot(item.timeSlot)}</strong>
                  </div>
                  <div>
                    <small>Status</small>
                    <strong>{item.status}</strong>
                  </div>
                </div>

                <div className="appointment-history-actions column">
                  <button className="button primary btn btn-success" disabled={!canManage} onClick={() => setEditing({ form: buildRescheduleForm(item) })} type="button">
                    Reschedule appointment
                  </button>
                  <button className="button ghost btn btn-light" disabled={!canManage} onClick={() => setCancelling(true)} type="button">
                    Cancel appointment
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </>
      )}

      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Save new schedule"}
        confirmTone="primary"
        message="Select a new date and a currently open time slot. The office will review your updated request."
        onCancel={() => setEditing(null)}
        onConfirm={handleReschedule}
        open={Boolean(editing)}
        title="Reschedule Appointment"
        wide
      >
        {editing && (
          <div className="modal-form appointment-modal-form">
            <div className="appointment-date-shortcuts">
              {quickDates.map((dateOption) => (
                <button
                  className={`appointment-date-chip ${editing.form.date === dateOption.value ? "active" : ""}`}
                  key={dateOption.value}
                  onClick={() => setEditing((current) => ({ ...current, form: { ...current.form, date: dateOption.value, timeSlot: "" } }))}
                  type="button"
                >
                  <strong>{dateOption.shortLabel}</strong>
                  <span>{dateOption.fullLabel}</span>
                </button>
              ))}
            </div>

            <FormField
              label="Date"
              min={quickDates[0]?.value || ""}
              name="date"
              onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, date: event.target.value, timeSlot: "" } }))}
              type="date"
              value={editing.form.date}
            />

            <div className="appointment-availability-strip">
              <div>
                <small>Open slots</small>
                <strong>{slotSummary.openCount}</strong>
              </div>
              <div>
                <small>Booked slots</small>
                <strong>{slotSummary.bookedCount}</strong>
              </div>
              <div>
                <small>Current slot</small>
                <strong>{formatTimeSlot(item?.timeSlot)}</strong>
              </div>
            </div>

            {availabilityLoading && <div className="appointment-empty-inline">Loading available time slots...</div>}
            {!availabilityLoading && availabilityError && <div className="appointment-empty-inline error">{availabilityError}</div>}
            {!availabilityLoading && !availabilityError && (
              <AppointmentSlotSelector
                emptyMessage="Choose a reschedule date to load available slots."
                onSelect={(timeSlot) => setEditing((current) => ({ ...current, form: { ...current.form, timeSlot } }))}
                selectedValue={editing.form.timeSlot}
                slots={slotOptions}
              />
            )}

            <FormField
              label="Purpose"
              name="purpose"
              onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, purpose: event.target.value } }))}
              rows="3"
              type="textarea"
              value={editing.form.purpose}
            />
            <FormField
              label="Notes"
              name="notes"
              onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, notes: event.target.value } }))}
              rows="3"
              type="textarea"
              value={editing.form.notes}
            />
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        confirmLabel={submitting ? "Cancelling..." : "Cancel appointment"}
        message="Cancel this appointment only if you no longer need the office visit. The office will be notified immediately."
        onCancel={() => setCancelling(false)}
        onConfirm={handleCancel}
        open={cancelling}
        title="Cancel Appointment"
      />
    </div>
  );
}
