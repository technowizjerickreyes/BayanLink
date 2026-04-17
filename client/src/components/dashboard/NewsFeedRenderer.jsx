import { useEffect, useState } from "react";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import LoadingState from "../common/LoadingState.jsx";
import EmptyState from "../common/EmptyState.jsx";

/**
 * Reusable News Feed Display Component
 * Consolidates news display across public, citizen, and admin sections
 */
export default function NewsFeedRenderer({
  items = [],
  loading = false,
  error = null,
  layout = "grid", // 'grid', 'list', or 'featured'
  canManage = false,
  onArchive = null,
  onEdit = null,
  onReadMore = null,
  onView = null,
  maxItems = null,
}) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  if (loading) {
    return <LoadingState message="Loading news..." />;
  }

  if (error) {
    return <EmptyState message={`Error: ${error}`} />;
  }

  if (!displayItems || displayItems.length === 0) {
    return <EmptyState message="No news articles available." />;
  }

  if (layout === "grid") {
    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <NewsCardSimple key={item._id} item={item} canManage={canManage} />
        ))}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <div className="grid gap-3">
        {displayItems.map((item) => (
          <NewsListItem key={item._id} item={item} canManage={canManage} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {displayItems.map((item) => (
        <NewsCardSimple key={item._id} item={item} canManage={canManage} />
      ))}
    </div>
  );
}

function NewsCardSimple({ item, canManage }) {
  const shouldShowStatus = canManage || item.status !== "published";

  return (
    <article className="dashboard-section-card overflow-hidden">
      {item.imageUrl && (
        <div className="mb-4 aspect-video w-full overflow-hidden rounded bg-bayan-surface">
          <img alt={item.title} className="h-full w-full object-cover" src={item.imageUrl} />
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-bayan-teal-soft px-2 py-1 text-xs font-bold text-bayan-teal">
          {item.category}
        </span>
        {item.isPinned && (
          <span className="inline-block rounded-full bg-yellow-50 px-2 py-1 text-xs font-bold text-yellow-700">
            Pinned
          </span>
        )}
        {shouldShowStatus && <StatusBadge value={item.status} />}
      </div>

      <h3 className="m-0 mb-2 text-lg font-black text-bayan-ink">{item.title}</h3>
      <p className="m-0 mb-4 text-sm text-bayan-muted line-clamp-2">
        {item.summary || item.content?.substring(0, 100) || "No summary available."}
      </p>

      <div className="text-xs text-bayan-muted-2">
        {item.publishedDate && <span>{new Date(item.publishedDate).toLocaleDateString()}</span>}
      </div>
    </article>
  );
}

function NewsListItem({ item, canManage }) {
  const shouldShowStatus = canManage || item.status !== "published";

  return (
    <div className="dashboard-preview-item interactive">
      <div className="dashboard-preview-icon">
        {item.imageUrl ? "📰" : "📄"}
      </div>
      <div className="dashboard-preview-copy flex-1">
        <div className="dashboard-preview-top">
          <strong className="text-sm">{item.title}</strong>
          {shouldShowStatus && <StatusBadge value={item.status} />}
        </div>
        <p className="m-0 mt-1 text-sm text-bayan-muted line-clamp-1">
          {item.summary || "No summary"}
        </p>
      </div>
      <span className="text-xs text-bayan-muted">
        {item.publishedDate && new Date(item.publishedDate).toLocaleDateString()}
      </span>
    </div>
  );
}
