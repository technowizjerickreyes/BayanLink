import { formatStatusLabel } from "../../utils/formatters.js";

const toneMap = {
  active: "success",
  inactive: "muted",
  approved: "success",
  completed: "success",
  confirmed: "success",
  resolved: "success",
  paid: "success",
  pending: "warning",
  under_review: "warning",
  for_pickup: "warning",
  in_progress: "info",
  draft: "muted",
  submitted: "info",
  rejected: "danger",
  archived: "danger",
  failed: "danger",
  cancelled: "danger",
  refunded: "danger",
};

export default function StatusBadge({ value, tone }) {
  const resolvedTone = tone || toneMap[value] || "muted";
  return <span className={`status-badge ${resolvedTone}`}>{formatStatusLabel(value)}</span>;
}
