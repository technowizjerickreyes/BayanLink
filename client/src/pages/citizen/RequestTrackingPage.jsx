import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { trackDocumentRequest } from "../../services/documentRequestService.js";
import { formatDateTime } from "../../utils/formatters.js";

export default function RequestTrackingPage() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleNumbers = useMemo(() => ["DOC-20260416-ABC123", "DOC-20260418-QWE902"], []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await trackDocumentRequest(trackingNumber.trim().toUpperCase());
      setItem(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Tracking number not found.");
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        action="Open Request History"
        description="Search by tracking number to see the current request stage, next action, and release instructions without calling the office."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/document-requests")}
        title="Request Tracking"
      />

      <section className="tracking-hero">
        <div className="tracking-hero-copy">
          <p className="eyebrow">Fast lookup</p>
          <h2>Check one request at a glance</h2>
          <p>Use the tracking number from your confirmation screen or request history. The result below will show the latest workflow status and what to do next.</p>
        </div>
        <div className="tracking-sample-list">
          {exampleNumbers.map((value) => (
            <button className="tracking-sample-chip" key={value} onClick={() => setTrackingNumber(value)} type="button">
              {value}
            </button>
          ))}
        </div>
      </section>

      <form className="tracking-search-panel" onSubmit={handleSubmit}>
        <div className="form-grid tracking">
          <FormField label="Tracking number" onChange={(event) => setTrackingNumber(event.target.value)} placeholder="DOC-20260416-ABC123" required value={trackingNumber} />
          <div className="tracking-search-actions">
            <button className="button primary btn btn-success" disabled={loading} type="submit">
              {loading ? "Tracking..." : "Track Request"}
            </button>
          </div>
        </div>
        <div className="appointment-inline-note">
          <Icon name="tracking" />
          <p>If you already submitted a request while signed in, you can also open it directly from your document request history.</p>
        </div>
      </form>

      {error && <ErrorState message={error} />}

      {!item && !error && !loading && (
        <EmptyState
          actionLabel="Open request history"
          icon="tracking"
          message="Enter a tracking number above to load the latest request progress, or open your signed-in request history instead."
          onAction={() => navigate("/citizen/document-requests")}
          title="No request loaded yet"
        />
      )}

      {item && (
        <>
          <section className="document-module-hero detail">
            <div className="document-module-hero-copy">
              <p className="eyebrow">Tracking result</p>
              <h2>{item.serviceName}</h2>
              <p>{item.nextAction}</p>
            </div>
            <div className="document-module-hero-pills detail">
              <span>
                <StatusBadge value={item.status} />
              </span>
              <span>Tracking: {item.trackingNumber}</span>
              <span>{item.pickupSchedule ? `Pickup ${formatDateTime(item.pickupSchedule)}` : "Pickup not scheduled yet"}</span>
            </div>
          </section>

          <div className="document-detail-grid">
            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Request summary</h2>
                <p>The latest status and release details for this request.</p>
              </div>
              <div className="document-history-meta">
                <div>
                  <small>Service</small>
                  <strong>{item.serviceName}</strong>
                </div>
                <div>
                  <small>Status</small>
                  <strong>{item.status.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Tracking number</small>
                  <strong>{item.trackingNumber}</strong>
                </div>
                <div>
                  <small>Pickup schedule</small>
                  <strong>{item.pickupSchedule ? formatDateTime(item.pickupSchedule) : "Not scheduled yet"}</strong>
                </div>
              </div>

              <div className="detail-copy">
                <h2>Next action</h2>
                <p>{item.nextAction}</p>
              </div>
            </section>

            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Progress timeline</h2>
                <p>Use this history to understand what the office already completed and what happens next.</p>
              </div>
              <div className="timeline-list">
                {(item.timeline || []).map((entry) => (
                  <article className="timeline-item" key={`${entry._id || entry.createdAt}-${entry.toStatus}`}>
                    <strong>{entry.toStatus.replaceAll("_", " ")}</strong>
                    <p>{entry.remarks || "Status updated."}</p>
                    <small>{formatDateTime(entry.createdAt)}</small>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
