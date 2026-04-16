export default function StatusMessage({ type = "info", children }) {
  return (
    <div aria-live={type === "error" ? "assertive" : "polite"} className={`status-message ${type}`} role={type === "error" ? "alert" : "status"}>
      {type === "info" && <span className="loading-dot" />}
      <span>{children}</span>
    </div>
  );
}
