import { useEffect, useState } from "react";
import AppointmentSlotSelector from "./AppointmentSlotSelector.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import DataTable from "../common/DataTable.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import FormField from "../common/FormField.jsx";
import LoadingState from "../common/LoadingState.jsx";
import PageHeader from "../common/PageHeader.jsx";
import SearchFilterBar from "../common/SearchFilterBar.jsx";
import StatCard from "../common/StatCard.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { getAppointmentAvailability, getAppointments, updateAppointment } from "../../services/appointmentService.js";
import { formatDate, formatDateTime, formatTimeSlot, getFullName } from "../../utils/formatters.js";
import {
  buildAppointmentSlotState,
  formatInputDate,
  getAppointmentAvailabilitySummary,
  getAppointmentReference,
  getAppointmentServiceDefinition,
  getAppointmentStatusOptions,
  getWeekBounds,
  getWeekDates,
  groupAppointmentsByDate,
  sortAppointmentsBySchedule,
} from "../../utils/appointmentUtils.js";
import { appointmentServices } from "../../utils/serviceCatalog.js";

function buildWorkflowState(item) {
  return {
    item,
    form: {
      status: item.status,
      date: formatInputDate(item.date),
      timeSlot: item.timeSlot,
      notes: item.notes || "",
    },
  };
}

function AppointmentCalendarView({ weekDays, groupedItems, selectedId, onSelect }) {
  return (
    <div className="appointment-calendar-board">
      {weekDays.map((day) => {
        const dayItems = sortAppointmentsBySchedule(groupedItems[day.value] || [], "asc");

        return (
          <section className="appointment-calendar-column" key={day.value}>
            <div className="appointment-calendar-head">
              <strong>{day.weekday}</strong>
              <span>{day.label}</span>
            </div>

            <div className="appointment-calendar-list">
              {dayItems.length === 0 ? (
                <div className="appointment-calendar-empty">No bookings</div>
              ) : (
                dayItems.map((item) => (
                  <button
                    className={`appointment-calendar-card ${selectedId === item._id ? "selected" : ""}`}
                    key={item._id}
                    onClick={() => onSelect(item)}
                    type="button"
                  >
                    <div className="appointment-calendar-card-top">
                      <strong>{formatTimeSlot(item.timeSlot)}</strong>
                      <StatusBadge value={item.status} />
                    </div>
                    <span>{item.serviceName}</span>
                    <small>{getFullName(item.citizenId)}</small>
                  </button>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function AppointmentManagementScreen({ role, title, eyebrow, description }) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    serviceId: "",
    focusDate: formatInputDate(new Date()),
  });
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [statusAction, setStatusAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          limit: 100,
          status: filters.status || undefined,
          serviceId: filters.serviceId || undefined,
          search: filters.search || undefined,
        };

        if (viewMode === "calendar") {
          const weekBounds = getWeekBounds(filters.focusDate || formatInputDate(new Date()));
          params.dateFrom = weekBounds.start;
          params.dateTo = weekBounds.end;
        } else if (filters.focusDate) {
          params.dateFrom = filters.focusDate;
          params.dateTo = filters.focusDate;
        }

        const response = await getAppointments(role, params);
        const nextItems = Array.isArray(response.data) ? response.data : [];
        setItems(nextItems);
        setSelected((current) => nextItems.find((item) => item._id === current?._id) || nextItems[0] || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [filters, refreshKey, role, viewMode]);

  const availabilityServiceId = workflow?.item?.serviceId || selected?.serviceId || filters.serviceId;
  const availabilityService = availabilityServiceId ? getAppointmentServiceDefinition(availabilityServiceId) : null;
  const availabilityDate = workflow?.form?.date || (selected ? formatInputDate(selected.date) : filters.focusDate);
  const availabilityBarangayId = workflow?.item?.barangayId || selected?.barangayId || "";

  useEffect(() => {
    if (!availabilityServiceId || !availabilityDate) {
      setAvailability(null);
      setAvailabilityError("");
      return;
    }

    if (role === "municipal_admin" && availabilityService?.scope === "barangay" && !availabilityBarangayId) {
      setAvailability(null);
      setAvailabilityError("Select a barangay appointment first to inspect service-desk slot availability.");
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");
        const response = await getAppointmentAvailability(role, {
          serviceId: availabilityServiceId,
          date: availabilityDate,
          barangayId: availabilityService?.scope === "barangay" ? availabilityBarangayId : undefined,
          excludeId: workflow?.item?._id || undefined,
        });

        if (cancelled) {
          return;
        }

        setAvailability(response.data);

        if (workflow?.form?.timeSlot && (response.data?.bookedTimeSlots || []).includes(workflow.form.timeSlot)) {
          setWorkflow((current) => (current ? { ...current, form: { ...current.form, timeSlot: "" } } : current));
        }
      } catch (requestError) {
        if (!cancelled) {
          setAvailability(null);
          setAvailabilityError(requestError.response?.data?.message || "Failed to load appointment availability.");
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
  }, [
    availabilityBarangayId,
    availabilityDate,
    availabilityService?.scope,
    availabilityServiceId,
    role,
    workflow?.item?._id,
  ]);

  const weekDays = getWeekDates(filters.focusDate || formatInputDate(new Date()));
  const groupedItems = groupAppointmentsByDate(items);
  const slotSummary = getAppointmentAvailabilitySummary(availability);
  const slotOptions = buildAppointmentSlotState({
    availability,
    selectedTimeSlot: workflow?.form?.timeSlot || selected?.timeSlot || "",
  });
  const pendingCount = items.filter((item) => item.status === "pending").length;
  const confirmedCount = items.filter((item) => item.status === "confirmed").length;
  const completedCount = items.filter((item) => item.status === "completed").length;

  const saveWorkflow = async () => {
    if (!workflow?.form?.date || !workflow.form.timeSlot || !workflow.form.status) {
      setError("Choose a schedule and status before saving the appointment update.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await updateAppointment(role, workflow.item._id, {
        status: workflow.form.status,
        date: workflow.form.date,
        timeSlot: workflow.form.timeSlot,
        notes: workflow.form.notes.trim() || undefined,
      });
      setWorkflow(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const saveStatusAction = async () => {
    try {
      setSubmitting(true);
      setError("");
      await updateAppointment(role, statusAction.item._id, {
        status: statusAction.status,
        notes: statusAction.notes.trim() || undefined,
      });
      setStatusAction(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader description={description} eyebrow={eyebrow} title={title} />

      <div className="dashboard-mini-stat-grid appointment-stat-grid">
        <StatCard caption="Awaiting confirmation or action" icon="calendar" label="Pending" tone="coral" value={pendingCount} />
        <StatCard caption="Confirmed office schedules" icon="check" label="Confirmed" tone="blue" value={confirmedCount} />
        <StatCard caption="Appointments already closed" icon="file" label="Completed" tone="default" value={completedCount} />
      </div>

      <SearchFilterBar
        actions={
          <div className="appointment-view-toggle">
            <button className={`button ${viewMode === "table" ? "primary" : "ghost"} btn btn-light`} onClick={() => setViewMode("table")} type="button">
              Table view
            </button>
            <button className={`button ${viewMode === "calendar" ? "primary" : "ghost"} btn btn-light`} onClick={() => setViewMode("calendar")} type="button">
              Calendar view
            </button>
          </div>
        }
      >
        <FormField
          label="Search"
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Citizen, service, or purpose"
          value={filters.search}
        />
        <FormField
          label="Service"
          onChange={(event) => setFilters((current) => ({ ...current, serviceId: event.target.value }))}
          options={[{ value: "", label: "All services" }, ...appointmentServices.map((service) => ({ value: service.value, label: service.label }))]}
          type="select"
          value={filters.serviceId}
        />
        <FormField
          label={viewMode === "calendar" ? "Week of" : "Date"}
          onChange={(event) => setFilters((current) => ({ ...current, focusDate: event.target.value }))}
          type="date"
          value={filters.focusDate}
        />
        <FormField
          label="Status"
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          options={getAppointmentStatusOptions(true)}
          type="select"
          value={filters.status}
        />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading appointments..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState icon="calendar" message="No appointments match the current filters." title="No appointments found" />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="appointment-admin-layout">
          <div className="appointment-admin-main">
            {viewMode === "table" ? (
              <DataTable
                columns={[
                  { key: "timeSlot", label: "Time", render: (item) => formatTimeSlot(item.timeSlot) },
                  { key: "serviceName", label: "Service" },
                  { key: "citizenId", label: "Citizen", render: (item) => getFullName(item.citizenId) },
                  { key: "date", label: "Date", render: (item) => formatDate(item.date) },
                  { key: "scope", label: "Scope", render: (item) => <StatusBadge tone={item.scope === "barangay" ? "info" : "warning"} value={item.scope} /> },
                  { key: "status", label: "Status", render: (item) => <StatusBadge value={item.status} /> },
                ]}
                deleteLabel="Cancel"
                emptyMessage="No appointments are available in this filtered view."
                emptyTitle="No appointments"
                onDelete={(item) =>
                  setStatusAction({
                    item,
                    status: "cancelled",
                    title: "Cancel appointment",
                    message: `Cancel ${item.serviceName} for ${getFullName(item.citizenId)}?`,
                    notes: item.notes || "",
                  })
                }
                onEdit={(item) => setWorkflow(buildWorkflowState(item))}
                onView={(item) => setSelected(item)}
                rows={items}
                toolbarContent={<span>{items.length} appointments in view</span>}
              />
            ) : (
              <AppointmentCalendarView groupedItems={groupedItems} onSelect={setSelected} selectedId={selected?._id} weekDays={weekDays} />
            )}
          </div>

          <aside className="appointment-admin-aside">
            {selected ? (
              <>
                <section className="appointment-summary-card admin-detail">
                  <div className="appointment-summary-head">
                    <p className="eyebrow">Selected appointment</p>
                    <h2>{selected.serviceName}</h2>
                    <p>{getAppointmentReference(selected)}</p>
                  </div>

                  <div className="appointment-summary-stack">
                    <div>
                      <small>Citizen</small>
                      <strong>{getFullName(selected.citizenId)}</strong>
                    </div>
                    <div>
                      <small>Date and time</small>
                      <strong>{formatDate(selected.date)} at {formatTimeSlot(selected.timeSlot)}</strong>
                    </div>
                    <div>
                      <small>Status</small>
                      <strong>{selected.status}</strong>
                    </div>
                    <div>
                      <small>Scope</small>
                      <strong>{selected.scope}</strong>
                    </div>
                  </div>

                  <div className="appointment-inline-note">
                    <strong>Purpose:</strong>
                    <span>{selected.purpose}</span>
                  </div>

                  {selected.linkedRequestId?.trackingNumber && (
                    <div className="appointment-inline-note">
                      <strong>Linked request:</strong>
                      <span>{selected.linkedRequestId.trackingNumber}</span>
                    </div>
                  )}

                  <div className="appointment-admin-actions">
                    <button
                      className="button primary btn btn-success"
                      disabled={["confirmed", "completed", "cancelled"].includes(selected.status)}
                      onClick={() =>
                        setStatusAction({
                          item: selected,
                          status: "confirmed",
                          title: "Approve appointment",
                          message: `Confirm ${selected.serviceName} for ${getFullName(selected.citizenId)}?`,
                          notes: selected.notes || "",
                        })
                      }
                      type="button"
                    >
                      Approve
                    </button>
                    <button
                      className="button ghost btn btn-light"
                      disabled={["completed", "cancelled"].includes(selected.status)}
                      onClick={() => setWorkflow(buildWorkflowState(selected))}
                      type="button"
                    >
                      Reschedule
                    </button>
                    <button
                      className="button ghost btn btn-light"
                      disabled={["completed", "cancelled"].includes(selected.status)}
                      onClick={() =>
                        setStatusAction({
                          item: selected,
                          status: "cancelled",
                          title: "Cancel appointment",
                          message: `Cancel ${selected.serviceName} for ${getFullName(selected.citizenId)}?`,
                          notes: selected.notes || "",
                        })
                      }
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="button ghost btn btn-light"
                      disabled={["completed", "cancelled"].includes(selected.status)}
                      onClick={() =>
                        setStatusAction({
                          item: selected,
                          status: "completed",
                          title: "Complete appointment",
                          message: `Mark ${selected.serviceName} for ${getFullName(selected.citizenId)} as completed?`,
                          notes: selected.notes || "",
                        })
                      }
                      type="button"
                    >
                      Mark completed
                    </button>
                  </div>
                </section>

                <section className="appointment-panel">
                  <div className="appointment-section-head">
                    <div>
                      <p className="eyebrow">Slot availability</p>
                      <h2>Daily schedule view</h2>
                      <p>Use this panel to avoid overbooking and understand which slots are already occupied for the selected service scope.</p>
                    </div>
                  </div>

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
                      <small>Viewing date</small>
                      <strong>{availabilityDate ? formatDate(availabilityDate) : "Select a date"}</strong>
                    </div>
                  </div>

                  {availabilityLoading && <div className="appointment-empty-inline">Loading slot availability...</div>}
                  {!availabilityLoading && availabilityError && <div className="appointment-empty-inline error">{availabilityError}</div>}
                  {!availabilityLoading && !availabilityError && (
                    <AppointmentSlotSelector
                      compact
                      emptyMessage="Select an appointment to review occupied slots."
                      interactive={false}
                      selectedValue={workflow?.form?.timeSlot || selected.timeSlot}
                      showBookingDetails
                      slots={slotOptions}
                    />
                  )}
                </section>

                <section className="appointment-panel">
                  <div className="appointment-section-head">
                    <div>
                      <p className="eyebrow">Citizen details</p>
                      <h2>Service context</h2>
                      <p>Review the citizen and audit details before changing the appointment workflow.</p>
                    </div>
                  </div>

                  <div className="appointment-review-grid">
                    <div className="appointment-review-card">
                      <small>Email</small>
                      <strong>{selected.citizenId?.email || "-"}</strong>
                      <p>Citizen contact on file.</p>
                    </div>
                    <div className="appointment-review-card">
                      <small>Submitted</small>
                      <strong>{formatDateTime(selected.createdAt)}</strong>
                      <p>Original request timestamp.</p>
                    </div>
                    <div className="appointment-review-card">
                      <small>Latest note</small>
                      <strong>{selected.notes || "No office notes yet"}</strong>
                      <p>Current appointment notes.</p>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <EmptyState icon="calendar" message="Choose an appointment from the table or calendar to inspect its details and manage the workflow." title="No appointment selected" />
            )}
          </aside>
        </div>
      )}

      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Save workflow update"}
        confirmTone="primary"
        message="Update the schedule and status together so the citizen receives a single, clear office response."
        onCancel={() => setWorkflow(null)}
        onConfirm={saveWorkflow}
        open={Boolean(workflow)}
        title="Manage Appointment"
        wide
      >
        {workflow && (
          <div className="modal-form appointment-modal-form">
            <div className="form-grid two">
              <FormField
                label="Status"
                onChange={(event) => setWorkflow((current) => ({ ...current, form: { ...current.form, status: event.target.value } }))}
                options={getAppointmentStatusOptions(false)}
                type="select"
                value={workflow.form.status}
              />
              <FormField
                label="Date"
                min={formatInputDate(new Date())}
                onChange={(event) => setWorkflow((current) => ({ ...current, form: { ...current.form, date: event.target.value, timeSlot: "" } }))}
                type="date"
                value={workflow.form.date}
              />
            </div>

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
                <small>Service</small>
                <strong>{workflow.item.serviceName}</strong>
              </div>
            </div>

            {availabilityLoading && <div className="appointment-empty-inline">Loading slot availability...</div>}
            {!availabilityLoading && availabilityError && <div className="appointment-empty-inline error">{availabilityError}</div>}
            {!availabilityLoading && !availabilityError && (
              <AppointmentSlotSelector
                emptyMessage="Choose a date to load available slots."
                onSelect={(timeSlot) => setWorkflow((current) => ({ ...current, form: { ...current.form, timeSlot } }))}
                selectedValue={workflow.form.timeSlot}
                showBookingDetails
                slots={slotOptions}
              />
            )}

            <FormField
              label="Office notes"
              onChange={(event) => setWorkflow((current) => ({ ...current, form: { ...current.form, notes: event.target.value } }))}
              rows="4"
              type="textarea"
              value={workflow.form.notes}
            />
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Confirm update"}
        confirmTone={statusAction?.status === "cancelled" ? "danger" : "primary"}
        message={statusAction?.message || "Update this appointment?"}
        onCancel={() => setStatusAction(null)}
        onConfirm={saveStatusAction}
        open={Boolean(statusAction)}
        title={statusAction?.title || "Update appointment"}
      >
        {statusAction && (
          <div className="modal-form">
            <FormField
              label="Office notes"
              onChange={(event) => setStatusAction((current) => ({ ...current, notes: event.target.value }))}
              rows="3"
              type="textarea"
              value={statusAction.notes}
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
