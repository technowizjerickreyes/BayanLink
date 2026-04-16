import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getNewsFeed } from "../../services/newsFeedService.js";

const formatDate = (value) => (value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-");

export default function NewsFeedViewPage() {
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
        const response = await getNewsFeed(id);
        setItem(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load news post.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Read record" title={item?.title || "News Post"} />
      {loading && <StatusMessage>Loading news post...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && item && (
        <>
          {item.imageUrl && <img alt="" className="news-image" src={item.imageUrl} />}
          <article className="detail-panel">
            <div className="article-meta">
              <span>{item.category}</span>
              <span>{item.isPinned ? "Pinned" : "Standard"}</span>
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <p className="article-author">By {item.author}</p>
            <p className="article-content">{item.content}</p>
          </article>
          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate("/news-feeds")} type="button">
              Back
            </button>
            <button className="button primary btn btn-success" onClick={() => navigate(`/news-feeds/${id}/edit`)} type="button">
              <Icon name="edit" />
              <span>Edit News Post</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
