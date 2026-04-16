import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatCard from "../../components/common/StatCard.jsx";
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
  const [filters, setFilters] = useState({ status: "", category: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getComplaints("citizen", {
          limit: 100,
          status: filters.status || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  const summary = useMemo(
    () => ({
      active: items.filter((item) => ["submitted", "under_review", "in_progress"].includes(item.status)).length,
      resolved: items.filter((item) => item.status === "resolved").length,
      closed: items.filter((item) => ["closed", "rejected"].includes(item.status)).length,
    }),
    [items]
  );

  return (
    <div className="page-stack">
      <PageHeader
        action="New Report"
        description="Monitor community reports, check office responses, and reopen your context quickly through the complaint timeline."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/complaints/create")}
        title="Complaints and Reports"
      />

      <section className="complaint-hero">
        <div className="tracking-hero-copy">
          <p className="eyebrow">Citizen reporting</p>
          <h2>Keep every issue in one readable history</h2>
          <p>Each report card shows the current office status, tracking number, and submitted date so you can follow up without confusion.</p>
        </div>
        <div className="document-module-hero-pills">
          <span>Track office progress</span>
          <span>View report details anytime</span>
          <span>Open a new issue in minutes</span>
        </div>
      </section>

      <div className="dashboard-mini-stat-grid appointment-stat-grid">
        <StatCard caption="Reports still under review or action" icon="alert" label="Active" tone="coral" value={summary.active} />
        <StatCard caption="Reports marked resolved" icon="check" label="Resolved" tone="blue" value={summary.resolved} />
        <StatCard caption="Closed or rejected reports" icon="file" label="Closed" tone="default" value={summary.closed} />
      </div>

      <SearchFilterBar>
        <FormField label="Search" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Tracking or title" value={filters.search} />
        <FormField label="Status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} options={statusOptions} type="select" value={filters.status} />
        <FormField label="Category" onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} options={[{ value: "", label: "All categories" }, ...complaintCategories]} type="select" value={filters.category} />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading complaints..." />}
      {error && <ErrorState message={error} />}

      {!loading && items.length === 0 && (
        <EmptyState
          actionLabel="Submit Report"
          icon="alert"
          message="Once you submit a complaint or community report, it will appear here with its tracking number and progress updates."
          onAction={() => navigate("/citizen/complaints/create")}
          title="No complaints yet"
        />
      )}

      {!loading && items.length > 0 && (
        <div className="complaint-history-grid">
          {items.map((item) => (
            <article className="appointment-history-card complaint-history-card" key={item._id}>
              <div className="appointment-history-top">
                <div>
                  <p className="eyebrow">Tracking {item.trackingNumber}</p>
                  <h2>{item.title}</h2>
                  <p>{item.location?.address || "No location provided"}</p>
                </div>
                <StatusBadge value={item.status} />
              </div>

              <div className="appointment-history-meta">
                <div>
                  <small>Category</small>
                  <strong>{item.category.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Submitted</small>
                  <strong>{formatDateTime(item.createdAt)}</strong>
                </div>
              </div>

              <div className="appointment-inline-note">
                <strong>Description:</strong>
                <span>{item.description}</span>
              </div>

              <div className="appointment-history-actions">
                <button className="button primary btn btn-success" onClick={() => navigate(`/citizen/complaints/${item._id}`)} type="button">
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
