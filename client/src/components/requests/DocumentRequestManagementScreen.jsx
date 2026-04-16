import { useEffect, useMemo, useState } from "react";
import DataTable from "../common/DataTable.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import PageHeader from "../common/PageHeader.jsx";
import SearchFilterBar from "../common/SearchFilterBar.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import StatusMessage from "../common/StatusMessage.jsx";
import DocumentRequestAttachments from "./DocumentRequestAttachments.jsx";
import DocumentRequestTimeline from "./DocumentRequestTimeline.jsx";
import {
  adminRequestStatusOptions,
  getDocumentRequestDefinition,
  getDocumentRequestServiceOptions,
  getQuickStatusActions,
  normalizeDocumentFieldLabel,
  paymentStatusOptions,
} from "./documentRequestUtils.js";
import { getDocumentRequest, getDocumentRequests, updateDocumentRequest } from "../../services/documentRequestService.js";
import { formatDate, formatDateTime, getFullName } from "../../utils/formatters.js";

function buildEditorState(item) {
  return {
    paymentStatus: item.paymentStatus || "not_applicable",
    pickupSchedule: item.pickupSchedule ? item.pickupSchedule.slice(0, 16) : "",
    remarks: item.remarks || "",
    status: item.status,
  };
}

export default function DocumentRequestManagementScreen({ role, title, eyebrow, description }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", paymentStatus: "", requestType: "", search: "" });
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDocumentRequests(role, {
          page: filters.page,
          limit: filters.limit,
          paymentStatus: filters.paymentStatus || undefined,
          requestType: filters.requestType || undefined,
          search: filters.search || undefined,
          status: filters.status || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: 10 });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load document requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, refreshKey, role]);

  const handleView = async (row) => {
    try {
      setDetailLoading(true);
      setError("");
      const response = await getDocumentRequest(role, row._id);
      setSelected(response.data);
      setEditor(buildEditorState(response.data));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load the request details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEditorChange = (event) => {
    const { name, value } = event.target;
    setEditor((current) => ({ ...current, [name]: value }));
  };

  const submitUpdate = async (overrideStatus = "") => {
    if (!selected || !editor) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const payload = {
        paymentStatus: editor.paymentStatus || undefined,
        pickupSchedule: editor.pickupSchedule ? new Date(editor.pickupSchedule).toISOString() : undefined,
        remarks: editor.remarks || undefined,
        status: overrideStatus || editor.status,
      };
      const response = await updateDocumentRequest(role, selected._id, payload);
      setSelected(response.data);
      setEditor(buildEditorState(response.data));
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update the request.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDefinition = getDocumentRequestDefinition(selected?.requestType);
  const quickActions = useMemo(() => getQuickStatusActions(selected), [selected]);

  return (
    <div className="page-stack">
      <PageHeader description={description} eyebrow={eyebrow} title={title} />

      <section className="document-module-hero">
        <div className="document-module-hero-copy">
          <p className="eyebrow">Request operations</p>
          <h2>Search, review, and move requests forward from one workspace</h2>
          <p>Use the table to find a request, then complete the real review work in the detail panel below.</p>
        </div>
        <div className="document-module-hero-pills">
          <span>Scoped request visibility</span>
          <span>Quick status actions</span>
          <span>Timeline and attachment review</span>
        </div>
      </section>

      <SearchFilterBar>
        <label className="field">
          <span className="form-label mb-0">Search</span>
          <input
            className="form-control"
            name="search"
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))}
            placeholder="Tracking number, purpose, or service"
            value={filters.search}
          />
        </label>
        <label className="field">
          <span className="form-label mb-0">Status</span>
          <select className="form-select" name="status" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))} value={filters.status}>
            <option value="">All statuses</option>
            {adminRequestStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="form-label mb-0">Payment</span>
          <select
            className="form-select"
            name="paymentStatus"
            onChange={(event) => setFilters((current) => ({ ...current, paymentStatus: event.target.value, page: 1 }))}
            value={filters.paymentStatus}
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="form-label mb-0">Service</span>
          <select className="form-select" name="requestType" onChange={(event) => setFilters((current) => ({ ...current, requestType: event.target.value, page: 1 }))} value={filters.requestType}>
            <option value="">All services</option>
            {getDocumentRequestServiceOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </SearchFilterBar>

      {loading && <StatusMessage>Loading document requests...</StatusMessage>}
      {error && <ErrorState message={error} />}

      {!loading && (
        <DataTable
          columns={[
            { key: "trackingNumber", label: "Tracking" },
            { key: "citizenId", label: "Citizen", render: (row) => getFullName(row.citizenId) },
            { key: "serviceName", label: "Service" },
            { key: "scope", label: "Scope", render: (row) => <StatusBadge tone={row.scope === "barangay" ? "info" : "warning"} value={row.scope} /> },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "paymentStatus", label: "Payment", render: (row) => <StatusBadge value={row.paymentStatus} /> },
            { key: "createdAt", label: "Submitted", render: (row) => formatDate(row.createdAt) },
          ]}
          emptyMessage="No matching document requests were found."
          emptyTitle="No document requests"
          onView={handleView}
          rows={items}
          toolbarContent={<span>{meta.total || 0} scoped requests</span>}
        />
      )}

      {detailLoading && <StatusMessage>Loading request detail panel...</StatusMessage>}

      {!detailLoading && selected && editor && (
        <section className="detail-panel document-admin-panel">
          <div className="document-admin-header">
            <div>
              <p className="eyebrow">Request detail panel</p>
              <h2>{selected.trackingNumber}</h2>
              <p>
                {selected.serviceName} for {getFullName(selected.citizenId)}
              </p>
            </div>
            <div className="document-module-hero-pills detail">
              <span>
                <StatusBadge value={selected.status} />
              </span>
              <span>Submitted {formatDateTime(selected.createdAt)}</span>
              <span>{selectedDefinition.processingDays}</span>
            </div>
          </div>

          <div className="document-detail-grid">
            <section className="document-detail-card">
              <div className="document-section-heading">
                <h2>Request summary</h2>
                <p>Citizen information, service scope, and release details.</p>
              </div>
              <div className="document-history-meta">
                <div>
                  <small>Citizen</small>
                  <strong>{getFullName(selected.citizenId)}</strong>
                </div>
                <div>
                  <small>Email</small>
                  <strong>{selected.citizenId?.email || "-"}</strong>
                </div>
                <div>
                  <small>Phone</small>
                  <strong>{selected.citizenId?.phone || "-"}</strong>
                </div>
                <div>
                  <small>Scope</small>
                  <strong>{selected.scope}</strong>
                </div>
                <div>
                  <small>Payment</small>
                  <strong>{selected.paymentStatus.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Pickup schedule</small>
                  <strong>{selected.pickupSchedule ? formatDateTime(selected.pickupSchedule) : "Not scheduled"}</strong>
                </div>
              </div>

              <div className="detail-copy">
                <h2>Submitted details</h2>
                <dl className="key-value-list">
                  {Object.entries(selected.submittedData || {}).map(([key, value]) => (
                    <div key={key}>
                      <dt>{normalizeDocumentFieldLabel(key)}</dt>
                      <dd>{value || "-"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="document-detail-card">
              <div className="document-section-heading">
                <h2>Workflow actions</h2>
                <p>Use quick actions for common updates, then add remarks or release details when needed.</p>
              </div>

              <div className="document-quick-action-row">
                {quickActions.map((action) => (
                  <button
                    className="button ghost btn btn-light"
                    disabled={action.disabled || submitting}
                    key={action.value}
                    onClick={() => submitUpdate(action.value)}
                    type="button"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="form-grid two">
                <label className="field">
                  <span className="form-label mb-0">Status</span>
                  <select className="form-select" name="status" onChange={handleEditorChange} value={editor.status}>
                    {adminRequestStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span className="form-label mb-0">Payment status</span>
                  <select className="form-select" name="paymentStatus" onChange={handleEditorChange} value={editor.paymentStatus}>
                    {paymentStatusOptions.filter((option) => option.value).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span className="form-label mb-0">Pickup schedule</span>
                  <input className="form-control" name="pickupSchedule" onChange={handleEditorChange} type="datetime-local" value={editor.pickupSchedule} />
                </label>
              </div>

              <label className="field">
                <span className="form-label mb-0">Remarks</span>
                <textarea
                  className="form-control"
                  name="remarks"
                  onChange={handleEditorChange}
                  placeholder="Explain what changed or what the citizen should do next."
                  rows="5"
                  value={editor.remarks}
                />
              </label>

              <div className="document-service-actions">
                <button className="button primary btn btn-success" disabled={submitting} onClick={() => submitUpdate()} type="button">
                  {submitting ? "Saving..." : "Save update"}
                </button>
              </div>
            </section>
          </div>

          <DocumentRequestAttachments attachments={selected.attachments || []} emptyMessage="No attachments were included with this request." title="Supporting attachments" />
          <DocumentRequestTimeline showActor timeline={selected.timeline || []} title="Workflow timeline" />
        </section>
      )}

      {!loading && !selected && (
        <EmptyState icon="tracking" message="Choose a request from the table above to open its detail panel, timeline, and workflow actions." title="No request selected yet" />
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
