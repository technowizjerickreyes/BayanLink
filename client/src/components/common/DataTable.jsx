import Icon from "./Icon.jsx";
import EmptyState from "./EmptyState.jsx";

function ActionButton({ label, icon, tone, onClick }) {
  const bootstrapTone = tone === "danger" ? "btn-outline-danger" : "btn-outline-secondary";

  return (
    <button
      aria-label={label}
      className={`icon-button btn btn-sm ${bootstrapTone} ${tone || ""}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon name={icon} />
    </button>
  );
}

export default function DataTable({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
  deleteLabel = "Delete",
  deleteIcon = "delete",
  emptyMessage = "No records yet.",
  emptyTitle = "No records",
  toolbarContent,
}) {
  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="table-shell">
      <div className="table-toolbar">{toolbarContent || <span>{rows.length} records</span>}</div>
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {hasActions && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="empty-cell" colSpan={columns.length + (hasActions ? 1 : 0)}>
                <EmptyState icon="file" message={emptyMessage} title={emptyTitle} />
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id}>
                {columns.map((column) => (
                  <td data-label={column.label} key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="actions" data-label="Actions">
                    {onView && <ActionButton icon="view" label="View" onClick={() => onView(row)} />}
                    {onEdit && <ActionButton icon="edit" label="Edit" onClick={() => onEdit(row)} />}
                    {onDelete && <ActionButton icon={deleteIcon} label={deleteLabel} onClick={() => onDelete(row)} tone="danger" />}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
