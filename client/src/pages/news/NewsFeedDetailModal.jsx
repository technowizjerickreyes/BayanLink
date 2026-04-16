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

export default function NewsFeedDetailModal({ canManage = false, item, onClose, onEdit, onOpenPage, open }) {
  if (!open || !item) {
    return null;
  }

  const shouldShowStatus = canManage || item.status !== "published";
  const summary = getNewsSummary(item);

  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal wide news-detail-modal" role="dialog">
        <button aria-label="Close" className="icon-button modal-close" onClick={onClose} title="Close" type="button">
          <Icon name="close" />
        </button>

        <div className="news-detail-modal-head">
          <div className="news-detail-modal-copy">
            <p className="eyebrow">Announcement details</p>
            <h2>{item.title}</h2>
            <p>{summary}</p>
          </div>
          <div className="news-card-badges">
            <span className={`news-scope-pill ${item.audienceScope}`}>{getNewsScopePillLabel(item)}</span>
            <span className="table-badge">{item.category}</span>
            {item.isPinned && <span className="table-badge success">Pinned</span>}
            {shouldShowStatus && <StatusBadge value={item.status} />}
          </div>
        </div>

        <div className="news-modal-facts">
          <div className="news-modal-fact">
            <small>Source</small>
            <strong>{getNewsSourceLabel(item)}</strong>
          </div>
          <div className="news-modal-fact">
            <small>{getNewsTimestampLabel(item)}</small>
            <strong>{formatNewsTimestamp(item)}</strong>
          </div>
          <div className="news-modal-fact">
            <small>Visibility</small>
            <strong>{getNewsAudienceLabel(item)}</strong>
          </div>
        </div>

        {item.imageUrl && <img alt={item.title} className="news-modal-image" src={item.imageUrl} />}

        <article className="news-modal-article">
          <p className="article-content">{item.content}</p>
        </article>

        <div className="modal-actions">
          <button className="button ghost btn btn-light" onClick={onClose} type="button">
            Close
          </button>
          <button className="button ghost btn btn-light" onClick={() => onOpenPage(item)} type="button">
            <Icon name="news" />
            <span>Open full page</span>
          </button>
          {canManage && (
            <button className="button primary btn btn-success" onClick={() => onEdit(item)} type="button">
              <Icon name="edit" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
