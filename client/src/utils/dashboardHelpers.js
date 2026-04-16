export function getDashboardGreeting(name, fallback = "there") {
  const hour = new Date().getHours();
  const lead = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${lead}, ${name || fallback}.`;
}

export function truncateText(value = "", maxLength = 120) {
  const normalized = String(value || "").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(maxLength - 1, 1)).trimEnd()}...`;
}

export function getDashboardTone(index = 0) {
  return ["success", "blue", "coral", "warning"][index % 4];
}
