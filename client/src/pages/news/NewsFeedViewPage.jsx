import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getNewsFeed } from "../../services/newsFeedService.js";
import { canManageNews, getNewsPath } from "../../utils/rolePaths.js";
import {
  formatNewsTimestamp,
  getNewsAudienceLabel,
  getNewsScopePillLabel,
  getNewsSourceLabel,
  getNewsSummary,
  getNewsTimestampLabel,
} from "./newsFeedUtils.js";

export default function NewsFeedViewPage() {
  const { user } = useAuth();
  const newsPath = getNewsPath(user?.role);
  const canManage = canManageNews(user?.role);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getNewsFeed(user.role, id);
        setItem(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load announcement.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, user.role]);

  const shouldShowStatus = canManage || item?.status !== "published";

  return (
    <div className="page-stack narrow">
      <PageHeader
        description={item ? getNewsSummary(item) : "Review the full announcement details, office source, and visibility scope."}
        eyebrow="Announcement detail"
        title={item?.title || "Announcement"}
      />

      {loading && <StatusMessage>Loading announcement...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && item && (
        <>
          <section className="news-feed-overview">
            <div className="news-feed-overview-copy">
              <div className="news-card-badges">
                <span className={`news-scope-pill ${item.audienceScope}`}>{getNewsScopePillLabel(item)}</span>
                <span className="table-badge">{item.category}</span>
                {item.isPinned && <span className="table-badge success">Pinned</span>}
                {shouldShowStatus && <StatusBadge value={item.status} />}
              </div>
              <h2 className="news-detail-heading">{item.title}</h2>
              <p>{getNewsSummary(item)}</p>
            </div>
            <div className="news-feed-overview-pills detail">
              <span>{getNewsSourceLabel(item)}</span>
              <span>
                {getNewsTimestampLabel(item)}: {formatNewsTimestamp(item)}
              </span>
              <span>{getNewsAudienceLabel(item)}</span>
            </div>
          </section>

          {item.imageUrl && <img alt={item.title} className="news-image" src={item.imageUrl} />}

          <section className="news-modal-facts">
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
          </section>

          <article className="detail-panel news-detail-article">
            <div className="detail-copy">
              <h2>Summary</h2>
              <p>{getNewsSummary(item)}</p>
            </div>
            <div className="detail-copy">
              <h2>Full announcement</h2>
              <p className="article-content">{item.content}</p>
            </div>
          </article>

          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate(newsPath)} type="button">
              <Icon name="back" />
              <span>Back to feed</span>
            </button>
            {canManage && (
              <button className="button primary btn btn-success" onClick={() => navigate(`${newsPath}/${id}/edit`)} type="button">
                <Icon name="edit" />
                <span>Edit announcement</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
