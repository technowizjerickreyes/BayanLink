import AppointmentSlotSelector from "./AppointmentSlotSelector.jsx";
import FormField from "../common/FormField.jsx";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDate, formatTimeSlot } from "../../utils/formatters.js";
import {
  buildAppointmentSlotState,
  getAppointmentAvailabilitySummary,
  getAppointmentReference,
  getAppointmentScopeLabel,
  getAppointmentServiceDefinition,
} from "../../utils/appointmentUtils.js";
import { appointmentServices } from "../../utils/serviceCatalog.js";

const bookingSteps = [
  { key: "service", label: "Service" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Confirm" },
];

export default function AppointmentForm({
  form,
  fieldErrors,
  step,
  requestOptions = [],
  quickDates = [],
  availability,
  availabilityLoading,
  availabilityError,
  submitting,
  onChange,
  onCancel,
  onNext,
  onPrevious,
  onSelectDate,
  onSelectService,
  onSelectTimeSlot,
  onSubmit,
}) {
  const selectedService = getAppointmentServiceDefinition(form.serviceId);
  const selectedRequest = requestOptions.find((option) => option.value === form.linkedRequestId);
  const slotSummary = getAppointmentAvailabilitySummary(availability);
  const slotOptions = buildAppointmentSlotState({
    availability,
    selectedTimeSlot: form.timeSlot,
  });

  return (
    <form className="appointment-booking-shell" onSubmit={onSubmit}>
      <div className="appointment-stepper">
        {bookingSteps.map((bookingStep, index) => {
          const isActive = step === index;
          const isComplete = step > index;

          return (
            <div className={`appointment-step ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} key={bookingStep.key}>
              <span>{index + 1}</span>
              <strong>{bookingStep.label}</strong>
            </div>
          );
        })}
      </div>

      <div className="appointment-booking-grid">
        <div className="appointment-booking-main">
          {step === 0 && (
            <section className="appointment-panel">
              <div className="appointment-panel-head">
                <div>
                  <p className="eyebrow">Step 1</p>
                  <h2>Select a service</h2>
                  <p>Pick the office visit you need. Each card explains where the appointment will be handled and what to bring.</p>
                </div>
              </div>

              <div className="appointment-service-grid">
                {appointmentServices.map((service) => (
                  <button
                    className={`appointment-service-card ${service.value === form.serviceId ? "active" : ""}`}
                    key={service.value}
                    onClick={() => onSelectService(service.value)}
                    type="button"
                  >
                    <div className="appointment-service-top">
                      <span className="appointment-service-icon">
                        <Icon name={service.icon || "calendar"} />
                      </span>
                      <StatusBadge tone={service.scope === "barangay" ? "info" : "warning"} value={service.scope} />
                    </div>
                    <div className="appointment-service-copy">
                      <h3>{service.label}</h3>
                      <p>{service.description}</p>
                    </div>
                    <div className="appointment-service-meta">
                      <div>
                        <small>Visit type</small>
                        <strong>{service.durationLabel}</strong>
                      </div>
                      <div>
                        <small>Location</small>
                        <strong>{service.locationLabel}</strong>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {fieldErrors.serviceId && <small className="field-error">{fieldErrors.serviceId}</small>}

              <div className="appointment-linked-request">
                <FormField
                  label="Link an existing request"
                  name="linkedRequestId"
                  onChange={onChange}
                  options={[{ value: "", label: "No linked request" }, ...requestOptions]}
                  type="select"
                  value={form.linkedRequestId}
                />
                <div className="appointment-inline-note">
                  <Icon name="file" />
                  <p>Linking a document request is optional, but it helps the office prepare your records before your visit.</p>
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <>
              <section className="appointment-panel">
                <div className="appointment-panel-head">
                  <div>
                    <p className="eyebrow">Step 2</p>
                    <h2>Choose your visit schedule</h2>
                    <p>Pick a date first, then select from the slots that are still open for the office handling this service.</p>
                  </div>
                </div>

                <div className="appointment-date-shortcuts">
                  {quickDates.map((item) => (
                    <button
                      className={`appointment-date-chip ${form.date === item.value ? "active" : ""}`}
                      key={item.value}
                      onClick={() => onSelectDate(item.value)}
                      type="button"
                    >
                      <strong>{item.shortLabel}</strong>
                      <span>{item.fullLabel}</span>
                    </button>
                  ))}
                </div>

                <FormField error={fieldErrors.date} label="Date" min={quickDates[0]?.value || ""} name="date" onChange={onChange} required type="date" value={form.date} />

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
                    <small>Office scope</small>
                    <strong>{getAppointmentScopeLabel(selectedService.scope)}</strong>
                  </div>
                </div>

                {availabilityLoading && <div className="appointment-empty-inline">Loading available time slots...</div>}
                {!availabilityLoading && availabilityError && <div className="appointment-empty-inline error">{availabilityError}</div>}

                {!availabilityLoading && !availabilityError && (
                  <div className="appointment-slot-section">
                    <div className="appointment-slot-head">
                      <div>
                        <h3>Available time slots</h3>
                        <p>Booked slots are disabled automatically so you can see your real options before submitting.</p>
                      </div>
                    </div>
                    <AppointmentSlotSelector
                      emptyMessage="Choose a service date to unlock available slots."
                      onSelect={onSelectTimeSlot}
                      selectedValue={form.timeSlot}
                      slots={form.date ? slotOptions : []}
                    />
                    {fieldErrors.timeSlot && <small className="field-error">{fieldErrors.timeSlot}</small>}
                  </div>
                )}
              </section>

              <section className="appointment-panel">
                <div className="appointment-panel-head compact">
                  <div>
                    <h2>Visit details</h2>
                    <p>Keep the purpose short and clear so staff can prepare before your schedule.</p>
                  </div>
                </div>

                <div className="form-grid two">
                  <FormField
                    label="Linked request"
                    name="linkedRequestId"
                    onChange={onChange}
                    options={[{ value: "", label: "No linked request" }, ...requestOptions]}
                    type="select"
                    value={form.linkedRequestId}
                  />
                  <FormField hint={selectedService.preparationLabel} label="Office handling this visit" readOnly type="text" value={selectedService.locationLabel} />
                </div>

                <FormField error={fieldErrors.purpose} label="Purpose" name="purpose" onChange={onChange} required rows="4" type="textarea" value={form.purpose} />
                <FormField error={fieldErrors.notes} label="Notes" name="notes" onChange={onChange} rows="3" type="textarea" value={form.notes} />
              </section>
            </>
          )}

          {step === 2 && (
            <section className="appointment-panel">
              <div className="appointment-panel-head">
                <div>
                  <p className="eyebrow">Step 3</p>
                  <h2>Review before booking</h2>
                  <p>Double-check the service, schedule, and purpose below. Once submitted, the office will confirm or update your request.</p>
                </div>
              </div>

              <div className="appointment-review-grid">
                <div className="appointment-review-card">
                  <small>Service</small>
                  <strong>{selectedService.label}</strong>
                  <p>{selectedService.description}</p>
                </div>
                <div className="appointment-review-card">
                  <small>Date and time</small>
                  <strong>
                    {form.date ? formatDate(form.date) : "No date selected"}{form.timeSlot ? ` at ${formatTimeSlot(form.timeSlot)}` : ""}
                  </strong>
                  <p>{selectedService.locationLabel}</p>
                </div>
                <div className="appointment-review-card">
                  <small>Purpose</small>
                  <strong>{form.purpose || "No purpose entered yet"}</strong>
                  <p>Keep this aligned with the documents or questions you will bring.</p>
                </div>
                <div className="appointment-review-card">
                  <small>Linked request</small>
                  <strong>{selectedRequest?.label || "No linked request"}</strong>
                  <p>{selectedService.preparationLabel}</p>
                </div>
              </div>

              <div className="appointment-confirm-note">
                <Icon name="alert" />
                <p>Schedules remain pending until the office confirms them. Citizens can reschedule or cancel only while the appointment is still more than 12 hours away.</p>
              </div>
            </section>
          )}

          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={step === 0 ? onCancel : onPrevious} type="button">
              {step === 0 ? "Cancel" : "Back"}
            </button>
            {step < bookingSteps.length - 1 ? (
              <button className="button primary btn btn-success" onClick={onNext} type="button">
                Continue
              </button>
            ) : (
              <button className="button primary btn btn-success" disabled={submitting} type="submit">
                <Icon name="save" />
                <span>{submitting ? "Booking..." : "Confirm Appointment"}</span>
              </button>
            )}
          </div>
        </div>

        <aside className="appointment-summary-card">
          <div className="appointment-summary-head">
            <p className="eyebrow">Booking summary</p>
            <h2>{selectedService.label}</h2>
            <p>{selectedService.description}</p>
          </div>

          <div className="appointment-summary-stack">
            <div>
              <small>Status on submission</small>
              <strong>Pending office confirmation</strong>
            </div>
            <div>
              <small>Office scope</small>
              <strong>{getAppointmentScopeLabel(selectedService.scope)}</strong>
            </div>
            <div>
              <small>Date</small>
              <strong>{form.date ? formatDate(form.date) : "Choose a date"}</strong>
            </div>
            <div>
              <small>Time slot</small>
              <strong>{form.timeSlot ? formatTimeSlot(form.timeSlot) : "Choose a slot"}</strong>
            </div>
            <div>
              <small>Purpose</small>
              <strong>{form.purpose || "Add a short purpose"}</strong>
            </div>
            <div>
              <small>Reference preview</small>
              <strong>{getAppointmentReference({ _id: "preview" })}</strong>
            </div>
          </div>

          <div className="appointment-inline-note">
            <Icon name="check" />
            <p>{selectedService.preparationLabel}</p>
          </div>
        </aside>
      </div>
    </form>
  );
}
