import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState.jsx";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";

export default function DashboardPreviewList({
  items = [],
  emptyTitle = "Nothing to show yet",
  emptyMessage = "New activity will appear here once records are available.",
  emptyIcon = "file",
}) {
  if (!items.length) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} title={emptyTitle} />;
  }

  return (
    <div className="dashboard-preview-list">
      {items.map((item) => {
        const Wrapper = item.to ? Link : "div";
        const wrapperProps = item.to ? { to: item.to } : {};

        return (
          <Wrapper
            className={`dashboard-preview-item ${item.to ? "interactive" : ""}`}
            key={item.key || item._id || item.title}
            {...wrapperProps}
          >
            <span className="dashboard-preview-icon">
              <Icon name={item.icon || "file"} />
            </span>

            <div className="dashboard-preview-copy">
              <div className="dashboard-preview-top">
                <strong>{item.title}</strong>
                {item.status && <StatusBadge tone={item.tone} value={item.status} />}
              </div>

              {item.description && <p>{item.description}</p>}

              {(item.meta || item.secondaryMeta) && (
                <div className="dashboard-preview-meta">
                  {item.meta && <small>{item.meta}</small>}
                  {item.secondaryMeta && <small>{item.secondaryMeta}</small>}
                </div>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
