import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getAppointments, updateAppointment } from "../../services/appointmentService.js";
import { formatDate, formatTimeSlot } from "../../utils/formatters.js";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AppointmentListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAppointments("citizen", {
          page: filters.page,
          limit: filters.limit,
          status: filters.status || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: 10 });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, refreshKey]);

  const handleReschedule = async () => {
    if (!editing) return;

    try {
      setError("");
      await updateAppointment("citizen", editing.item._id, editing.form);
      setEditing(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the appointment.");
    }
  };

  const handleCancel = async () => {
    if (!cancelling) return;

    try {
      setError("");
      await updateAppointment("citizen", cancelling._id, { status: "cancelled" });
      setCancelling(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to cancel the appointment.");
    }
  };

  return (
    <div className="page-stack">
      <PageHeader action="Book Appointment" eyebrow="Citizen Services" onAction={() => navigate("/citizen/appointments/create")} title="Appointments" />

      <SearchFilterBar>
        <FormField label="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} placeholder="Service or purpose" value={filters.search} />
        <FormField label="Status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))} options={statusOptions} type="select" value={filters.status} />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading appointments..." />}
      {error && <ErrorState message={error} />}

      {!loading && (
        <DataTable
          columns={[
            { key: "serviceName", label: "Service" },
            { key: "date", label: "Date", render: (row) => formatDate(row.date) },
            { key: "timeSlot", label: "Time", render: (row) => formatTimeSlot(row.timeSlot) },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "purpose", label: "Purpose" },
          ]}
          deleteLabel="Cancel"
          emptyMessage="You do not have any appointments yet."
          emptyTitle="No appointments"
          onDelete={(row) => setCancelling(row)}
          onEdit={(row) =>
            setEditing({
              item: row,
              form: {
                date: row.date.slice(0, 10),
                timeSlot: row.timeSlot,
                purpose: row.purpose,
                notes: row.notes || "",
              },
            })
          }
          rows={items}
        />
      )}

      {!loading && (
        <div className="pagination-bar">
          <span>
            Page {meta.page} of {meta.pages} - {meta.total} records
          </span>
          <div>
            <button className="button ghost btn btn-light" disabled={meta.page <= 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))} type="button">
              Previous
            </button>
            <button className="button ghost btn btn-light" disabled={meta.page >= meta.pages} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))} type="button">
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmModal confirmLabel="Save schedule" message="Update the requested date, time, or notes for this appointment." onCancel={() => setEditing(null)} onConfirm={handleReschedule} open={Boolean(editing)} title="Reschedule Appointment">
        {editing && (
          <div className="modal-form">
            <FormField label="Date" min={new Date().toISOString().slice(0, 10)} name="date" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, date: event.target.value } }))} type="date" value={editing.form.date} />
            <FormField label="Time" name="timeSlot" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, timeSlot: event.target.value } }))} type="time" value={editing.form.timeSlot} />
            <FormField label="Purpose" name="purpose" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, purpose: event.target.value } }))} rows="3" type="textarea" value={editing.form.purpose} />
            <FormField label="Notes" name="notes" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, notes: event.target.value } }))} rows="3" type="textarea" value={editing.form.notes} />
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal confirmLabel="Cancel appointment" message={`Cancel ${cancelling?.serviceName || "this appointment"}?`} onCancel={() => setCancelling(null)} onConfirm={handleCancel} open={Boolean(cancelling)} title="Cancel Appointment" />
    </div>
  );
}
