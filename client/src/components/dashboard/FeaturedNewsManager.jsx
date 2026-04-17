import { useState } from "react";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

/**
 * Featured News Management Component
 * Allows admins to manage featured/pinned news articles
 */
export default function FeaturedNewsManager({
  news = [],
  onFeature = null,
  onUnfeature = null,
  loading = false,
}) {
  const featuredNews = news.filter((item) => item.isPinned);
  const unfearturedNews = news.filter((item) => !item.isPinned);

  return (
    <div className="page-stack">
      {/* Featured News Section */}
      <section className="dashboard-section-card">
        <div className="dashboard-section-header">
          <div className="dashboard-section-copy">
            <div className="dashboard-section-heading">
              <h2>Featured Articles ({featuredNews.length})</h2>
              <p>These articles are promoted on the homepage and dashboards</p>
            </div>
          </div>
        </div>

        {featuredNews.length > 0 ? (
          <div className="dashboard-preview-list mt-4">
            {featuredNews.map((item) => (
              <div key={item._id} className="dashboard-preview-item">
                <div className="dashboard-preview-icon">⭐</div>
                <div className="dashboard-preview-copy flex-1">
                  <div className="dashboard-preview-top">
                    <strong className="text-sm">{item.title}</strong>
                    <StatusBadge value={item.status} />
                  </div>
                  <p className="m-0 mt-1 text-sm text-bayan-muted line-clamp-1">
                    {item.summary || item.content?.substring(0, 60) || "No summary"}
                  </p>
                </div>
                {onUnfeature && (
                  <button
                    className="icon-button"
                    onClick={() => onUnfeature(item._id)}
                    title="Remove from featured"
                    disabled={loading}
                  >
                    <Icon name="star" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-bayan-muted">No featured articles yet.</p>
        )}
      </section>

      {/* Available to Feature Section */}
      {unfearturedNews.length > 0 && (
        <section className="dashboard-section-card">
          <div className="dashboard-section-header">
            <div className="dashboard-section-copy">
              <div className="dashboard-section-heading">
                <h2>Available to Feature ({unfearturedNews.length})</h2>
                <p>Articles that can be promoted to featured status</p>
              </div>
            </div>
          </div>

          <div className="dashboard-preview-list mt-4">
            {unfearturedNews.slice(0, 10).map((item) => (
              <div key={item._id} className="dashboard-preview-item">
                <div className="dashboard-preview-icon">📄</div>
                <div className="dashboard-preview-copy flex-1">
                  <div className="dashboard-preview-top">
                    <strong className="text-sm">{item.title}</strong>
                    <StatusBadge value={item.status} />
                  </div>
                  <p className="m-0 mt-1 text-sm text-bayan-muted line-clamp-1">
                    {item.category}
                  </p>
                </div>
                {onFeature && (
                  <button
                    className="button primary text-sm"
                    onClick={() => onFeature(item._id)}
                    disabled={loading}
                  >
                    Feature
                  </button>
                )}
              </div>
            ))}
          </div>

          {unfearturedNews.length > 10 && (
            <p className="mt-4 text-sm text-bayan-muted">
              Showing 10 of {unfearturedNews.length} articles
            </p>
          )}
        </section>
      )}
    </div>
  );
}
