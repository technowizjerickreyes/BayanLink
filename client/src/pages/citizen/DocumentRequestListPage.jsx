import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { citizenRequestStatusOptions, getDocumentRequestDefinition } from "../../components/requests/documentRequestUtils.js";
import { getDocumentRequests } from "../../services/documentRequestService.js";
import { formatDateTime } from "../../utils/formatters.js";

export default function DocumentRequestListPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDocumentRequests("citizen", {
          page: filters.page,
          limit: filters.limit,
          status: filters.status || undefined,
          search: filters.search || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: 10 });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load your requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  const summary = useMemo(
    () => ({
      active: items.filter((item) => ["pending", "under_review", "approved", "for_pickup"].includes(item.status)).length,
      completed: items.filter((item) => item.status === "completed").length,
      attention: items.filter((item) => item.status === "rejected").length,
    }),
    [items]
  );

  return (
    <div className="page-stack">
      <PageHeader
        action="Browse Services"
        description="Review your past and active requests, check the next step, and open the guided service catalog when you need another document."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/document-requests/services")}
        title="My Document Requests"
      />

      <section className="document-module-hero">
        <div className="document-module-hero-copy">
          <p className="eyebrow">Request history</p>
          <h2>Track every request without remembering office workflow terms</h2>
          <p>Each request card explains the current status, when it was submitted, and the next action in plain language.</p>
        </div>
        <div className="document-module-hero-pills">
          <span>Tracking numbers saved here</span>
          <span>Status badges with plain next steps</span>
          <span>Quick access to service catalog</span>
        </div>
      </section>

      <section className="stat-grid municipality-stat-grid">
        <StatCard caption="Requests still moving through review or release" icon="tracking" label="Active on this page" tone="success" value={summary.active} />
        <StatCard caption="Requests already finished" icon="check" label="Completed on this page" tone="blue" value={summary.completed} />
        <StatCard caption="Requests needing your attention" icon="alert" label="Needs review" tone="coral" value={summary.attention} />
      </section>

      <SearchFilterBar
        actions={
          <>
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/request-tracking")} type="button">
              Track by number
            </button>
            <button className="button primary btn btn-success" onClick={() => navigate("/citizen/document-requests/services")} type="button">
              New request
            </button>
          </>
        }
      >
        <label className="field">
          <span className="form-label mb-0">Search requests</span>
          <input
            className="form-control"
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
            placeholder="Search by tracking number or service"
            value={filters.search}
          />
        </label>
        <label className="field">
          <span className="form-label mb-0">Status</span>
          <select
            className="form-select"
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}
            value={filters.status}
          >
            {citizenRequestStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </SearchFilterBar>

      {loading && <StatusMessage>Loading your document requests...</StatusMessage>}
      {error && <ErrorState message={error} />}

      {!loading && items.length === 0 ? (
        <EmptyState
          actionLabel="Browse document services"
          icon="file"
          message="Once you submit a request, it will appear here together with its tracking number and next step."
          onAction={() => navigate("/citizen/document-requests/services")}
          title="No document requests yet"
        />
      ) : (
        <div className="document-history-grid">
          {items.map((item) => {
            const definition = getDocumentRequestDefinition(item.requestType);

            return (
              <article className="document-history-card" key={item._id}>
                <div className="document-history-top">
                  <div>
                    <span className={`news-scope-pill ${definition.scope}`}>{definition.label}</span>
                    <h2>{item.trackingNumber}</h2>
                  </div>
                  <StatusBadge value={item.status} />
                </div>

                <p>{item.nextAction}</p>

                <div className="document-history-meta">
                  <div>
                    <small>Submitted</small>
                    <strong>{formatDateTime(item.createdAt)}</strong>
                  </div>
                  <div>
                    <small>Payment</small>
                    <strong>{item.paymentStatus.replaceAll("_", " ")}</strong>
                  </div>
                  <div>
                    <small>Estimated time</small>
                    <strong>{definition.processingDays}</strong>
                  </div>
                </div>

                <div className="document-history-actions">
                  <button className="button primary btn btn-success" onClick={() => navigate(`/citizen/document-requests/${item._id}`)} type="button">
                    View details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="pagination-bar">
          <span>
            Page {meta.page} of {meta.pages} - {meta.total} requests
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
