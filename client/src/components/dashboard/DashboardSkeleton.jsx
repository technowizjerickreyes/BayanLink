export default function DashboardSkeleton() {
  return (
    <div className="page-stack dashboard-skeleton-page" aria-hidden="true">
      <section className="dashboard-hero dashboard-hero-shell dashboard-skeleton-card">
        <div className="dashboard-skeleton-block">
          <span className="skeleton-line short" />
          <span className="skeleton-line title" />
          <span className="skeleton-line medium" />
          <span className="skeleton-line medium" />
          <div className="dashboard-skeleton-actions">
            <span className="skeleton-pill" />
            <span className="skeleton-pill" />
          </div>
        </div>
        <div className="dashboard-skeleton-side">
          <span className="skeleton-line medium" />
          <span className="skeleton-line short" />
          <span className="skeleton-line short" />
        </div>
      </section>

      <section className="stat-grid dashboard-stat-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="stat-card dashboard-skeleton-card" key={index}>
            <span className="skeleton-circle" />
            <div className="dashboard-skeleton-block">
              <span className="skeleton-line short" />
              <span className="skeleton-line value" />
              <span className="skeleton-line medium" />
            </div>
          </article>
        ))}
      </section>

      <section className="quick-action-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="quick-action-card dashboard-skeleton-card" key={index}>
            <span className="skeleton-circle" />
            <div className="dashboard-skeleton-block">
              <span className="skeleton-line medium" />
              <span className="skeleton-line medium" />
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          {Array.from({ length: 3 }).map((_, index) => (
            <article className="dashboard-section-card dashboard-skeleton-card" key={index}>
              <div className="dashboard-skeleton-block">
                <span className="skeleton-line short" />
                <span className="skeleton-line medium" />
                <span className="skeleton-line medium" />
                <span className="skeleton-line medium" />
              </div>
            </article>
          ))}
        </div>
        <div className="dashboard-side-column">
          {Array.from({ length: 3 }).map((_, index) => (
            <article className="dashboard-section-card dashboard-skeleton-card" key={index}>
              <div className="dashboard-skeleton-block">
                <span className="skeleton-line short" />
                <span className="skeleton-line medium" />
                <span className="skeleton-line medium" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
