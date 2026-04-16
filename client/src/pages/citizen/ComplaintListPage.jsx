import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getComplaints } from "../../services/complaintReportService.js";
import { complaintCategories } from "../../utils/serviceCatalog.js";
import { formatDateTime } from "../../utils/formatters.js";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

export default function ComplaintListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", category: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getComplaints("citizen", {
          page: filters.page,
          limit: filters.limit,
          status: filters.status || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: 10 });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  return (
    <div className="page-stack">
      <PageHeader action="New Report" eyebrow="Citizen Services" onAction={() => navigate("/citizen/complaints/create")} title="Complaints and Reports" />

      <SearchFilterBar>
        <FormField label="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} placeholder="Tracking or title" value={filters.search} />
        <FormField label="Status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))} options={statusOptions} type="select" value={filters.status} />
        <FormField label="Category" onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, page: 1 }))} options={[{ value: "", label: "All categories" }, ...complaintCategories]} type="select" value={filters.category} />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading complaints..." />}
      {error && <ErrorState message={error} />}

      {!loading && (
        <DataTable
          columns={[
            { key: "trackingNumber", label: "Tracking" },
            { key: "title", label: "Issue" },
            { key: "category", label: "Category", render: (row) => <StatusBadge tone="info" value={row.category} /> },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "createdAt", label: "Submitted", render: (row) => formatDateTime(row.createdAt) },
          ]}
          emptyMessage="You have not submitted any complaints or reports yet."
          emptyTitle="No complaints"
          onView={(row) => navigate(`/citizen/complaints/${row._id}`)}
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
    </div>
  );
}
