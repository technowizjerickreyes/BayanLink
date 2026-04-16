export const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-";

export const formatDateTime = (value) =>
  value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";

export const formatStatusLabel = (value = "") =>
  String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatTimeSlot = (value = "") =>
  value
    ? new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(`2000-01-01T${value}:00`))
    : "-";

export const getFullName = (user) => {
  if (!user) return "-";
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : user.email || "-";
};
