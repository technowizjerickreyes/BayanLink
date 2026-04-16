import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../../components/common/ErrorState.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getComplaint } from "../../services/complaintReportService.js";
import { formatDateTime } from "../../utils/formatters.js";

export default function ComplaintViewPage() {
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
        const response = await getComplaint(id);
        setItem(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load the complaint.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <div className="page-stack">
      <PageHeader
        action="Back to Reports"
        description="Review the latest office action, location details, and report timeline for this community issue."
        eyebrow="Complaint Details"
        onAction={() => navigate("/citizen/complaints")}
        title={item?.trackingNumber || "Complaint"}
      />
      {loading && <LoadingState message="Loading complaint details..." />}
      {error && <ErrorState message={error} />}

      {!loading && item && (
        <>
          <section className="document-module-hero detail">
            <div className="document-module-hero-copy">
              <p className="eyebrow">Reported issue</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <div className="document-module-hero-pills detail">
              <span>
                <StatusBadge value={item.status} />
              </span>
              <span>{item.trackingNumber}</span>
              <span>{item.location?.address || "No location recorded"}</span>
            </div>
          </section>

          <div className="document-detail-grid">
            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Report summary</h2>
                <p>Key issue information and location details for your complaint.</p>
              </div>
              <div className="document-history-meta">
                <div>
                  <small>Status</small>
                  <strong>{item.status.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Category</small>
                  <strong>{item.category.replaceAll("_", " ")}</strong>
                </div>
                <div>
                  <small>Address</small>
                  <strong>{item.location?.address || "-"}</strong>
                </div>
                <div>
                  <small>Submitted</small>
                  <strong>{formatDateTime(item.createdAt)}</strong>
                </div>
              </div>

              {item.location?.landmark && (
                <div className="detail-copy">
                  <h2>Landmark</h2>
                  <p>{item.location.landmark}</p>
                </div>
              )}
            </section>

            <section className="detail-panel document-detail-card">
              <div className="document-section-heading">
                <h2>Timeline</h2>
                <p>Review the latest office responses and workflow progress for this issue.</p>
              </div>
              <div className="timeline-list">
                {(item.timeline || []).map((entry) => (
                  <article className="timeline-item" key={`${entry.createdAt}-${entry.status}`}>
                    <strong>{entry.status.replaceAll("_", " ")}</strong>
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
