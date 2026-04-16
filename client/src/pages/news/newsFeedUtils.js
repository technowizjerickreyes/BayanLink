import { formatDateTime } from "../../utils/formatters.js";

const SUMMARY_LENGTH = 220;

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

export const NEWS_CATEGORY_OPTIONS = ["Ayuda", "Emergency", "Projects", "Events", "Health", "General"].map((category) => ({
  label: category,
  value: category,
}));

export const NEWS_STATUS_OPTIONS = ["draft", "published", "archived"].map((status) => ({
  label: status.replace(/\b\w/g, (character) => character.toUpperCase()),
  value: status,
}));

export function getNewsSummary(item) {
  const explicitSummary = normalizeText(item?.summary || "");

  if (explicitSummary) {
    return explicitSummary;
  }

  const content = normalizeText(item?.content || "");

  if (content.length <= SUMMARY_LENGTH) {
    return content;
  }

  return `${content.slice(0, SUMMARY_LENGTH).trimEnd()}...`;
}

export function getNewsSourceLabel(item) {
  if (item?.sourceLabel) {
    return item.sourceLabel;
  }

  if (item?.audienceScope === "barangay") {
    return item?.barangayId ? `Barangay ${item.barangayId} Office` : "Barangay Office";
  }

  return "Municipal Office";
}

export function getNewsAudienceLabel(item) {
  if (item?.audienceLabel) {
    return item.audienceLabel;
  }

  if (item?.audienceScope === "barangay") {
    return item?.barangayId ? `Visible to ${item.barangayId} residents only` : "Visible to assigned barangay residents only";
  }

  return "Visible across the municipality";
}

export function getNewsScopeLabel(scope) {
  return scope === "barangay" ? "Barangay Announcements" : "Municipality Announcements";
}

export function getNewsScopePillLabel(item) {
  return item?.audienceScope === "barangay" ? "Barangay-only" : "Municipality-wide";
}

export function getNewsTimestampValue(item) {
  if (!item) {
    return null;
  }

  if (item.publishedAt) {
    return item.publishedAt;
  }

  if (item.status === "published") {
    return item.createdAt;
  }

  return item.updatedAt || item.createdAt || null;
}

export function getNewsTimestampLabel(item) {
  if (item?.status === "published") {
    return "Published";
  }

  if (item?.status === "archived") {
    return "Archived";
  }

  return "Saved";
}

export function formatNewsTimestamp(item) {
  const value = getNewsTimestampValue(item);
  return value ? formatDateTime(value) : "Not published yet";
}

export function getNewsFeedSections(user) {
  if (!user) {
    return [];
  }

  const sections = [];

  if (user.role !== "barangay_admin") {
    sections.push({
      key: "municipality",
      title: "Municipality Announcements",
      description: "Official municipality-wide advisories, events, and public service updates from your local government office.",
      emptyMessage: "Published municipality-wide announcements will appear here once they are available.",
      emptyTitle: "No municipality announcements yet",
    });
  }

  if (user.role !== "municipal_admin" && user.barangayId) {
    sections.push({
      key: "barangay",
      title: "Barangay Announcements",
      description: `Updates published specifically for ${user.barangayId} residents inside your assigned municipality.`,
      emptyMessage: "Barangay-targeted announcements will appear here when your assigned office publishes them.",
      emptyTitle: "No barangay announcements yet",
    });
  }

  return sections;
}

export function getNewsSourceFilterOptions(user) {
  const options = [{ label: "All sources", value: "all" }];

  if (user?.role !== "barangay_admin") {
    options.push({ label: "Municipal Office", value: "municipality" });
  }

  if (user?.role !== "municipal_admin" && user?.barangayId) {
    options.push({
      label: user.barangayId ? `Barangay ${user.barangayId}` : "Barangay Office",
      value: "barangay",
    });
  }

  return options;
}

export function getFeedHeaderCopy(user, canManage) {
  if (canManage && user?.role === "barangay_admin") {
    return {
      description: "Publish and manage barangay announcements that remain visible only to residents assigned to your barangay.",
      title: "Barangay Announcement Management",
    };
  }

  if (canManage) {
    return {
      description: "Publish and manage municipality-wide announcements that stay inside your assigned municipality only.",
      title: "Municipality Announcement Management",
    };
  }

  return {
    description: "Read official municipality-wide and barangay-specific announcements already scoped to your assigned area.",
    title: "Community Announcements",
  };
}

export function getAuthoringScopeDetails(user) {
  if (user?.role === "barangay_admin") {
    return {
      description: "Published announcements remain limited to residents whose accounts are assigned to this barangay.",
      sourceLabel: user?.barangayId ? `Barangay ${user.barangayId} Office` : "Barangay Office",
      title: "Barangay-targeted publishing",
      visibilityLabel: user?.barangayId ? `${user.barangayId} residents only` : "Assigned barangay residents only",
    };
  }

  return {
    description: "Published announcements remain visible only inside your municipality and never cross into other LGUs.",
    sourceLabel: "Municipal Office",
    title: "Municipality-wide publishing",
    visibilityLabel: "All users in this municipality",
  };
}

export function hasActiveNewsFilters(filters) {
  return Boolean(
    filters?.search ||
      filters?.category ||
      filters?.dateFrom ||
      filters?.dateTo ||
      filters?.status ||
      (filters?.source && filters.source !== "all")
  );
}
