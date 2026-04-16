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
      <PageHeader eyebrow="Complaint Details" title={item?.trackingNumber || "Complaint"} />
      {loading && <LoadingState message="Loading complaint details..." />}
      {error && <ErrorState message={error} />}

      {!loading && item && (
        <>
          <section className="detail-panel">
            <div className="detail-grid">
              <div>
                <dt>Issue</dt>
                <dd>{item.title}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd><StatusBadge value={item.status} /></dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd><StatusBadge tone="info" value={item.category} /></dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{item.location?.address || "-"}</dd>
              </div>
            </div>
            <p className="article-content">{item.description}</p>
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

          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate("/citizen/complaints")} type="button">
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
