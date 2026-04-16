import EmptyState from "../../components/common/EmptyState.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import NewsFeedCard from "./NewsFeedCard.jsx";

export default function NewsFeedSection({
  canManage = false,
  emptyFiltered = false,
  items = [],
  loading = false,
  meta,
  onArchive,
  onEdit,
  onPageChange,
  onReadMore,
  onView,
  section,
}) {
  const total = meta?.total || 0;
  const page = meta?.page || 1;
  const pages = meta?.pages || 1;

  return (
    <section className={`news-section ${section.key}`}>
      <div className="news-section-header">
        <div className="news-section-copy">
          <p className="eyebrow">{section.key === "barangay" ? "Barangay updates" : "Municipality updates"}</p>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <div className="news-section-summary">
          <strong>{total}</strong>
          <span>{total === 1 ? "announcement" : "announcements"}</span>
        </div>
      </div>

      {loading ? (
        <StatusMessage>Loading {section.title.toLowerCase()}...</StatusMessage>
      ) : items.length === 0 ? (
        <EmptyState
          icon="news"
          message={emptyFiltered ? "Try adjusting the search, type, date, or source filters to widen the results." : section.emptyMessage}
          title={emptyFiltered ? `No matching ${section.title.toLowerCase()}` : section.emptyTitle}
        />
      ) : (
        <div className="news-card-grid">
          {items.map((item) => (
            <NewsFeedCard
              canManage={canManage}
              item={item}
              key={item._id}
              onArchive={onArchive}
              onEdit={onEdit}
              onReadMore={onReadMore}
              onView={onView}
            />
          ))}
        </div>
      )}

      {!loading && pages > 1 && (
        <div className="pagination-bar news-section-pagination">
          <span>
            Page {page} of {pages}
          </span>
          <div>
            <button
              className="button ghost btn btn-light"
              disabled={page <= 1}
              onClick={() => onPageChange(section.key, page - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="button ghost btn btn-light"
              disabled={page >= pages}
              onClick={() => onPageChange(section.key, page + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
