import Icon from "../common/Icon.jsx";
import { formatDateTime, formatStatusLabel, getFullName } from "../../utils/formatters.js";

export default function DocumentRequestTimeline({
  emptyMessage = "No request updates have been recorded yet.",
  showActor = false,
  timeline = [],
  title = "Request timeline",
}) {
  return (
    <section className="document-timeline-section">
      <div className="document-section-heading">
        <h2>{title}</h2>
        <p>Each status change helps explain what already happened and what comes next.</p>
      </div>

      {timeline.length === 0 ? (
        <div className="document-empty-inline">
          <Icon name="tracking" />
          <span>{emptyMessage}</span>
        </div>
      ) : (
        <div className="timeline-list document-timeline-list">
          {timeline.map((entry) => (
            <article className="timeline-item document-timeline-item" key={`${entry._id || entry.createdAt}-${entry.toStatus}`}>
              <div className="document-timeline-top">
                <strong>{formatStatusLabel(entry.toStatus)}</strong>
                <small>{formatDateTime(entry.createdAt)}</small>
              </div>
              <p>{entry.remarks || "Status updated."}</p>
              {showActor && (
                <small>
                  Updated by {getFullName(entry.actorUserId) !== "-" ? getFullName(entry.actorUserId) : formatStatusLabel(entry.actorRole || "system")}
                </small>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
