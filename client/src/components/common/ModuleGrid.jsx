import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function ModuleGrid({ modules, readyStatus = "Ready" }) {
  return (
    <section className="module-grid">
      {modules.map((module) => (
        <Link className="module-card" key={module.title} to={module.to}>
          <div className="module-card-top">
            <span className="module-icon">
              <Icon name={module.icon} />
            </span>
            <span className={`module-status ${module.status !== readyStatus ? "planned" : ""}`}>{module.status}</span>
          </div>
          <h2>{module.title}</h2>
          <p>{module.description}</p>
        </Link>
      ))}
    </section>
  );
}
