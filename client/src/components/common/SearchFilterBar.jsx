export default function SearchFilterBar({ children, actions }) {
  return (
    <section className="filter-bar">
      <div className="search-filter-fields">{children}</div>
      {actions && <div className="search-filter-actions">{actions}</div>}
    </section>
  );
}
