import crypto from "crypto";

function dateSegment() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  })
    .format(new Date())
    .replaceAll("-", "");
}

export function buildTrackingCandidate(prefix) {
  return `${prefix}-${dateSegment()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
