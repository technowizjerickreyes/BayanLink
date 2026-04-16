import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../common/ConfirmModal.jsx";
import DataTable from "../common/DataTable.jsx";
import ErrorState from "../common/ErrorState.jsx";
import FormField from "../common/FormField.jsx";
import LoadingState from "../common/LoadingState.jsx";
import PageHeader from "../common/PageHeader.jsx";
import SearchFilterBar from "../common/SearchFilterBar.jsx";
import StatCard from "../common/StatCard.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { getComplaints, updateComplaint } from "../../services/complaintReportService.js";
import { complaintCategories } from "../../utils/serviceCatalog.js";
import { formatDateTime, getFullName } from "../../utils/formatters.js";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function ComplaintManagementScreen({ role, title, eyebrow, description }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", category: "", search: "" });
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
        const response = await getComplaints(role, {
          page: filters.page,
          limit: filters.limit,
          status: filters.status || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: 10 });
        setSelected((current) => {
          const nextSelected = (response.data || []).find((item) => item._id === current?._id);
          return nextSelected || current || (response.data || [])[0] || null;
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, refreshKey, role]);

  const summary = useMemo(
    () => ({
      incoming: items.filter((item) => ["submitted", "under_review"].includes(item.status)).length,
      fieldwork: items.filter((item) => item.status === "in_progress").length,
      resolved: items.filter((item) => ["resolved", "closed"].includes(item.status)).length,
    }),
    [items]
  );

  const handleSubmit = async () => {
    if (!editing) return;

    try {
      setSubmitting(true);
      setError("");
      await updateComplaint(role, editing.item._id, editing.form);
      setEditing(null);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader description={description} eyebrow={eyebrow} title={title} />

      <div className="dashboard-mini-stat-grid appointment-stat-grid">
        <StatCard caption="New or under-review cases" icon="alert" label="Incoming" tone="coral" value={summary.incoming} />
        <StatCard caption="Cases currently being handled" icon="tracking" label="In progress" tone="blue" value={summary.fieldwork} />
        <StatCard caption="Resolved or closed cases in view" icon="check" label="Resolved" tone="default" value={summary.resolved} />
      </div>

      <SearchFilterBar>
        <FormField label="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} placeholder="Tracking, title, office" value={filters.search} />
        <FormField label="Status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))} options={statusOptions} type="select" value={filters.status} />
        <FormField label="Category" onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, page: 1 }))} options={[{ value: "", label: "All categories" }, ...complaintCategories]} type="select" value={filters.category} />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading complaints..." />}
      {error && <ErrorState message={error} />}

      {!loading && (
        <DataTable
          columns={[
            { key: "trackingNumber", label: "Tracking" },
            { key: "citizenId", label: "Citizen", render: (row) => getFullName(row.citizenId) },
            { key: "title", label: "Issue" },
            { key: "category", label: "Category", render: (row) => <StatusBadge tone="info" value={row.category} /> },
            { key: "priority", label: "Priority", render: (row) => <StatusBadge tone={row.priority === "urgent" ? "danger" : row.priority === "high" ? "warning" : "muted"} value={row.priority} /> },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
          ]}
          emptyMessage="No matching complaints were found."
          emptyTitle="No complaints"
          onEdit={(row) => setEditing({ item: row, form: { status: row.status, priority: row.priority, assignedOffice: row.assignedOffice || "", remarks: "" } })}
          onView={(row) => setSelected(row)}
          rows={items}
        />
      )}

      {selected && (
        <section className="detail-panel complaint-admin-panel">
          <div className="appointment-section-head">
            <div>
              <p className="eyebrow">Complaint detail panel</p>
              <h2>{selected.title}</h2>
              <p>{selected.trackingNumber}</p>
            </div>
            <StatusBadge value={selected.status} />
          </div>
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
              <dt>Assigned office</dt>
              <dd>{selected.assignedOffice || "-"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{selected.location?.address || "-"}</dd>
            </div>
          </div>
          <p className="article-content">{selected.description}</p>
          <div className="timeline-list">
            {(selected.timeline || []).map((entry) => (
              <article className="timeline-item" key={`${entry.createdAt}-${entry.status}`}>
                <strong>{entry.status.replaceAll("_", " ")}</strong>
                <p>{entry.remarks || "Status updated."}</p>
                <small>{formatDateTime(entry.createdAt)}</small>
              </article>
            ))}
          </div>
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
        message={`Update ${editing?.item?.trackingNumber || "this complaint"}.`}
        onCancel={() => setEditing(null)}
        onConfirm={handleSubmit}
        open={Boolean(editing)}
        title="Update complaint"
      >
        {editing && (
          <div className="modal-form">
            <FormField label="Status" name="status" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, status: event.target.value } }))} options={statusOptions.slice(1)} type="select" value={editing.form.status} />
            <FormField label="Priority" name="priority" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, priority: event.target.value } }))} options={priorityOptions} type="select" value={editing.form.priority} />
            <FormField label="Assigned office" name="assignedOffice" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, assignedOffice: event.target.value } }))} value={editing.form.assignedOffice} />
            <FormField label="Remarks" name="remarks" onChange={(event) => setEditing((current) => ({ ...current, form: { ...current.form, remarks: event.target.value } }))} rows="4" type="textarea" value={editing.form.remarks} />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
