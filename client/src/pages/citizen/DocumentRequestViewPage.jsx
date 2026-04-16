import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentRequestAttachments from "../../components/requests/DocumentRequestAttachments.jsx";
import DocumentRequestTimeline from "../../components/requests/DocumentRequestTimeline.jsx";
import { getDocumentRequestDefinition, normalizeDocumentFieldLabel } from "../../components/requests/documentRequestUtils.js";
import ErrorState from "../../components/common/ErrorState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getDocumentRequest } from "../../services/documentRequestService.js";
import { formatDateTime } from "../../utils/formatters.js";

export default function DocumentRequestViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDocumentRequest("citizen", id);
        setItem(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load the request.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const definition = getDocumentRequestDefinition(item?.requestType);

  return (
    <div className="page-stack">
      <PageHeader
        description="Review the latest status, next step, submitted information, and supporting files for this request."
        eyebrow="Document Request"
        title={item?.trackingNumber || "Request Details"}
      />
      {loading && <StatusMessage>Loading request details...</StatusMessage>}
      {error && <ErrorState message={error} />}

      {!loading && item && (
        <>
          <section className="document-module-hero detail">
            <div className="document-module-hero-copy">
              <p className="eyebrow">Current request</p>
              <h2>{definition.label}</h2>
              <p>{item.nextAction}</p>
            </div>
            <div className="document-module-hero-pills detail">
              <span>
                <StatusBadge value={item.status} />
              </span>
              <span>Submitted {formatDateTime(item.createdAt)}</span>
              <span>Tracking: {item.trackingNumber}</span>
            </div>
          </section>

          <div className="document-detail-grid">
            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Request summary</h2>
                <p>Key details about the request and release workflow.</p>
              </div>
              <div className="document-history-meta">
                <div>
                  <small>Status</small>
                  <strong>{item.status.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Payment</small>
                  <strong>{item.paymentStatus.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Estimated processing time</small>
                  <strong>{definition.processingDays}</strong>
                </div>
                <div>
                  <small>Pickup schedule</small>
                  <strong>{item.pickupSchedule ? formatDateTime(item.pickupSchedule) : "Not scheduled yet"}</strong>
                </div>
              </div>

              <div className="detail-copy">
                <h2>What to do next</h2>
                <p>{item.nextAction}</p>
              </div>
            </section>

            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Submitted information</h2>
                <p>The details below were sent together with the request.</p>
              </div>
              <dl className="key-value-list">
                {Object.entries(item.submittedData || {}).map(([key, value]) => (
                  <div key={key}>
                    <dt>{normalizeDocumentFieldLabel(key)}</dt>
                    <dd>{value || "-"}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <DocumentRequestAttachments attachments={item.attachments || []} emptyMessage="No supporting files were uploaded for this request." />
          <DocumentRequestTimeline timeline={item.timeline || []} title="Request progress history" />

          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/document-requests")} type="button">
              Back to history
            </button>
            <button className="button primary btn btn-success" onClick={() => navigate("/citizen/request-tracking")} type="button">
              Track another request
            </button>
          </div>
        </>
      )}
    </div>
  );
}
