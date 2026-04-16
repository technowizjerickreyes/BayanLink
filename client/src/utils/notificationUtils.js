export function getNotificationTypeMeta(item) {
  const entityType = item?.entityType || item?.type || "system";

  switch (entityType) {
    case "document_request":
      return {
        icon: "file",
        label: "Document Request",
        tone: "info",
      };
    case "appointment":
      return {
        icon: "calendar",
        label: "Appointment",
        tone: "warning",
      };
    case "complaint":
      return {
        icon: "alert",
        label: "Complaint",
        tone: "danger",
      };
    default:
      return {
        icon: "notification",
        label: "Notification",
        tone: "muted",
      };
  }
}
