import Icon from "./Icon.jsx";

export default function StatCard({ icon, label, value, tone = "blue", caption }) {
  return (
    <article className={`stat-card ${tone}`}>
      <span className="stat-icon">
        <Icon name={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {caption && <small>{caption}</small>}
      </div>
    </article>
  );
}
