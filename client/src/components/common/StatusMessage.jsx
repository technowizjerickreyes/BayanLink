export default function StatusMessage({ type = "info", children }) {
  return (
    <div className={`status-message ${type}`}>
      {type === "info" && <span className="loading-dot" />}
      <span>{children}</span>
    </div>
  );
}
