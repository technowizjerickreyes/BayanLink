import { useState } from "react";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { trackDocumentRequest } from "../../services/documentRequestService.js";
import { formatDateTime } from "../../utils/formatters.js";

export default function RequestTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <PageHeader description="Enter your document request tracking number to view the current workflow and next action." eyebrow="Citizen Services" title="Request Tracking" />

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-grid two">
          <FormField label="Tracking number" onChange={(event) => setTrackingNumber(event.target.value)} placeholder="DOC-20260416-ABC123" required value={trackingNumber} />
          <div className="form-actions compact">
            <button className="button primary btn btn-success" disabled={loading} type="submit">
              {loading ? "Tracking..." : "Track Request"}
            </button>
          </div>
        </div>
      </form>

      {error && <ErrorState message={error} />}

      {item && (
        <section className="detail-panel">
          <div className="detail-grid">
            <div>
              <dt>Service</dt>
              <dd>{item.serviceName}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><StatusBadge value={item.status} /></dd>
            </div>
            <div>
              <dt>Tracking</dt>
              <dd>{item.trackingNumber}</dd>
            </div>
            <div>
              <dt>Pickup schedule</dt>
              <dd>{formatDateTime(item.pickupSchedule)}</dd>
            </div>
          </div>

          <div className="detail-copy">
            <h2>Next action</h2>
            <p>{item.nextAction}</p>
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
      )}
    </div>
  );
}
