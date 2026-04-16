import Icon from "../../components/common/Icon.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  formatNewsTimestamp,
  getNewsAudienceLabel,
  getNewsScopePillLabel,
  getNewsSourceLabel,
  getNewsSummary,
  getNewsTimestampLabel,
} from "./newsFeedUtils.js";

export default function NewsFeedCard({ item, canManage = false, onArchive, onEdit, onReadMore, onView }) {
  const shouldShowStatus = canManage || item.status !== "published";

  return (
    <article className={`news-card ${item.audienceScope === "barangay" ? "barangay" : "municipality"}`}>
      {item.imageUrl && (
        <div className="news-card-media">
          <img alt={item.title} className="news-card-image" src={item.imageUrl} />
        </div>
      )}

      <div className="news-card-body">
        <div className="news-card-badges">
          <span className={`news-scope-pill ${item.audienceScope}`}>{getNewsScopePillLabel(item)}</span>
          <span className="table-badge">{item.category}</span>
          {item.isPinned && <span className="table-badge success">Pinned</span>}
          {shouldShowStatus && <StatusBadge value={item.status} />}
        </div>

        <div className="news-card-copy">
          <h2>{item.title}</h2>
          <p>{getNewsSummary(item) || "No summary available."}</p>
        </div>

        <div className="news-card-facts">
          <div className="news-card-fact">
            <small>Source</small>
            <strong>{getNewsSourceLabel(item)}</strong>
          </div>
          <div className="news-card-fact">
            <small>{getNewsTimestampLabel(item)}</small>
            <strong>{formatNewsTimestamp(item)}</strong>
          </div>
          <div className="news-card-fact">
            <small>Visibility</small>
            <strong>{getNewsAudienceLabel(item)}</strong>
          </div>
        </div>

        <div className="news-card-actions">
          <button className="button ghost btn btn-light" onClick={() => onReadMore(item)} type="button">
            <Icon name="view" />
            <span>Read more</span>
          </button>
          <button className="button ghost btn btn-light" onClick={() => onView(item)} type="button">
            <Icon name="news" />
            <span>Open page</span>
          </button>
          {canManage && (
            <>
              <button className="button ghost btn btn-light" onClick={() => onEdit(item)} type="button">
                <Icon name="edit" />
                <span>Edit</span>
              </button>
              <button className="button danger btn btn-danger" onClick={() => onArchive(item)} type="button">
                <Icon name="archive" />
                <span>Archive</span>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
