import { useEffect, useState } from "react";
import ConfirmModal from "../common/ConfirmModal.jsx";
import DataTable from "../common/DataTable.jsx";
import ErrorState from "../common/ErrorState.jsx";
import FormField from "../common/FormField.jsx";
import LoadingState from "../common/LoadingState.jsx";
import PageHeader from "../common/PageHeader.jsx";
import SearchFilterBar from "../common/SearchFilterBar.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { getAppointments, updateAppointment } from "../../services/appointmentService.js";
import { formatDate, formatTimeSlot, getFullName } from "../../utils/formatters.js";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AppointmentManagementScreen({ role, title, eyebrow, description }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", search: "" });
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAppointments(role, {
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
  }, [filters, refreshKey, role]);

  const handleEdit = (row) => {
    setEditing({
      item: row,
      form: {
        status: row.status,
        notes: row.notes || "",
      },
    });
  };

  const handleSubmit = async () => {
    if (!editing) return;

    try {
      setSubmitting(true);
      setError("");
      await updateAppointment(role, editing.item._id, editing.form);
      setEditing(null);
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

      <SearchFilterBar>
        <FormField label="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} placeholder="Service or purpose" value={filters.search} />
        <FormField label="Status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))} options={statusOptions} type="select" value={filters.status} />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading appointments..." />}
      {error && <ErrorState message={error} />}

      {!loading && (
        <DataTable
          columns={[
            { key: "citizenId", label: "Citizen", render: (row) => getFullName(row.citizenId) },
            { key: "serviceName", label: "Service" },
            { key: "date", label: "Date", render: (row) => formatDate(row.date) },
            { key: "timeSlot", label: "Time", render: (row) => formatTimeSlot(row.timeSlot) },
            { key: "scope", label: "Scope", render: (row) => <StatusBadge tone={row.scope === "barangay" ? "info" : "warning"} value={row.scope} /> },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
          ]}
          emptyMessage="No matching appointments were found."
          emptyTitle="No appointments"
          onEdit={handleEdit}
          onView={(row) => setSelected(row)}
          rows={items}
        />
      )}

      {selected && (
        <section className="detail-panel">
          <h2>{selected.serviceName}</h2>
          <div className="detail-grid">
            <div>
              <dt>Citizen</dt>
              <dd>{getFullName(selected.citizenId)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><StatusBadge value={selected.status} /></dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatDate(selected.date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{formatTimeSlot(selected.timeSlot)}</dd>
            </div>
          </div>
          <p className="article-content">{selected.purpose}</p>
        </section>
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

      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Save update"}
        message={`Update ${editing?.item?.serviceName || "this appointment"}.`}
        onCancel={() => setEditing(null)}
        onConfirm={handleSubmit}
        open={Boolean(editing)}
        title="Update appointment"
      >
        {editing && (
          <div className="modal-form">
            <FormField label="Status" name="status" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, status: event.target.value } }))} options={statusOptions.slice(1)} type="select" value={editing.form.status} />
            <FormField label="Notes" name="notes" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, notes: event.target.value } }))} rows="4" type="textarea" value={editing.form.notes} />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
