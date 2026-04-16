export function getAuditContext(req) {
  return {
    actorUserId: req.user?._id || req.user?.id || null,
    actorRole: req.user?.role || null,
    ipAddress: req.ip || req.socket?.remoteAddress || "",
    userAgent: req.get("user-agent") || "",
  };
}
