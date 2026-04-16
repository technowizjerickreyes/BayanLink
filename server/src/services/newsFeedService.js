import mongoose from "mongoose";
import NewsFeed from "../models/NewsFeed.js";
import ApiError from "../utils/ApiError.js";
import { assertOnlyFields, pickFields } from "../utils/fieldWhitelist.js";
import { getPaginationMeta } from "../utils/pagination.js";

const NEWS_MUTABLE_FIELDS = ["title", "content", "imageUrl", "status", "category", "isPinned"];
const SUMMARY_LENGTH = 220;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeWhitespace(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function summarizeContent(content = "") {
  const normalized = normalizeWhitespace(content);

  if (normalized.length <= SUMMARY_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, SUMMARY_LENGTH).trimEnd()}...`;
}

function parseDateBoundary(value, boundary = "start") {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return null;
  }

  const [year, month, day] = normalized.split("-").map((segment) => Number.parseInt(segment, 10));

  if (![year, month, day].every(Number.isInteger)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (boundary === "end") {
    date.setUTCHours(23, 59, 59, 999);
  } else {
    date.setUTCHours(0, 0, 0, 0);
  }

  return date;
}

function addDateFilter(filters, query, publishedOnly = false) {
  const dateFrom = parseDateBoundary(query.dateFrom, "start");
  const dateTo = parseDateBoundary(query.dateTo, "end");

  if (!dateFrom && !dateTo) {
    return;
  }

  const range = {};

  if (dateFrom) {
    range.$gte = dateFrom;
  }

  if (dateTo) {
    range.$lte = dateTo;
  }

  if (publishedOnly) {
    filters.$and = [
      ...(filters.$and || []),
      {
        $or: [
          { publishedAt: range },
          {
            publishedAt: null,
            createdAt: range,
          },
        ],
      },
    ];

    return;
  }

  filters.createdAt = range;
}

function resolvePublishedAt(item) {
  return item.publishedAt || (item.status === "published" ? item.createdAt : null);
}

function sourceLabelFor(item) {
  if (item.audienceScope === "barangay") {
    return item.barangayId ? `Barangay ${item.barangayId} Office` : "Barangay Office";
  }

  return "Municipal Office";
}

function audienceLabelFor(item) {
  if (item.audienceScope === "barangay") {
    return item.barangayId ? `Visible to ${item.barangayId} residents only` : "Visible to assigned barangay residents only";
  }

  return "Visible across the municipality";
}

function decorateNewsItem(item) {
  const publishedAt = resolvePublishedAt(item);

  return {
    ...item,
    publishedAt,
    summary: summarizeContent(item.content),
    sourceLabel: sourceLabelFor(item),
    audienceLabel: audienceLabelFor(item),
  };
}

function addNewsQueryFilters(baseFilters, query = {}, publishedOnly = false) {
  const filters = { ...baseFilters };

  if (publishedOnly) {
    filters.status = "published";
  } else if (query.status) {
    filters.status = query.status;
  }

  if (query.audienceScope) {
    filters.audienceScope = query.audienceScope;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), "i");
    filters.$and = [
      ...(filters.$and || []),
      {
        $or: [{ title: search }, { content: search }, { category: search }],
      },
    ];
  }

  addDateFilter(filters, query, publishedOnly);

  return filters;
}

function visibleScopeFilter(user) {
  if (!user.municipalityId) {
    throw new ApiError(403, "Municipality scope is required");
  }

  const visibleScopes = [{ audienceScope: "municipality" }];

  if (user.barangayId) {
    visibleScopes.push({
      audienceScope: "barangay",
      barangayId: user.barangayId,
    });
  }

  return {
    municipalityId: user.municipalityId,
    $or: visibleScopes,
  };
}

function managedScopeFilter(user) {
  if (user.role === "municipal_admin") {
    return {
      municipalityId: user.municipalityId,
      audienceScope: "municipality",
    };
  }

  if (user.role === "barangay_admin") {
    return {
      municipalityId: user.municipalityId,
      audienceScope: "barangay",
      barangayId: user.barangayId,
    };
  }

  throw new ApiError(403, "You do not have permission to manage news posts");
}

export async function listVisibleNews({ user, query, pagination }) {
  if (user.role === "super_admin") {
    throw new ApiError(403, "Super Admin does not manage citizen news feeds");
  }

  const filters = addNewsQueryFilters(visibleScopeFilter(user), query, !["municipal_admin", "barangay_admin"].includes(user.role));
  const [items, total] = await Promise.all([
    NewsFeed.find(filters).sort({ isPinned: -1, publishedAt: -1, createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    NewsFeed.countDocuments(filters),
  ]);

  return {
    items: items.map((item) => decorateNewsItem(item)),
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function listManagedNews({ user, query, pagination }) {
  const filters = addNewsQueryFilters(managedScopeFilter(user), query, false);
  const [items, total] = await Promise.all([
    NewsFeed.find(filters).sort({ isPinned: -1, createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    NewsFeed.countDocuments(filters),
  ]);

  return {
    items: items.map((item) => decorateNewsItem(item)),
    meta: getPaginationMeta({ ...pagination, total }),
  };
}

export async function getNewsForViewer({ user, id, managed = false }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid news post id");
  }

  const scopeFilter = managed ? managedScopeFilter(user) : visibleScopeFilter(user);
  const statusFilter = !managed && !["municipal_admin", "barangay_admin"].includes(user.role) ? { status: "published" } : {};
  const item = await NewsFeed.findOne({ _id: id, ...scopeFilter, ...statusFilter }).lean();

  if (!item) {
    throw new ApiError(404, "News post not found");
  }

  return decorateNewsItem(item);
}

export async function createManagedNews({ user, payload }) {
  assertOnlyFields(payload, ["title", "content", "imageUrl", "audienceScope", "status", "category", "isPinned"]);

  let scope;

  if (user.role === "municipal_admin") {
    if (payload.audienceScope && payload.audienceScope !== "municipality") {
      throw new ApiError(403, "Municipal admins can only create municipality-wide announcements");
    }

    scope = {
      municipalityId: user.municipalityId,
      barangayId: "",
      audienceScope: "municipality",
    };
  } else if (user.role === "barangay_admin") {
    if (payload.audienceScope && payload.audienceScope !== "barangay") {
      throw new ApiError(403, "Barangay admins can only create barangay-scoped posts");
    }

    scope = {
      municipalityId: user.municipalityId,
      barangayId: user.barangayId,
      audienceScope: "barangay",
    };
  } else {
    throw new ApiError(403, "You do not have permission to manage news posts");
  }

  return NewsFeed.create({
    ...pickFields(payload, NEWS_MUTABLE_FIELDS),
    ...scope,
    createdBy: user._id,
    status: payload.status || "draft",
    publishedAt: payload.status === "published" ? new Date() : null,
  });
}

export async function updateManagedNews({ user, id, payload }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid news post id");
  }

  assertOnlyFields(payload, NEWS_MUTABLE_FIELDS);
  const updatePayload = pickFields(payload, NEWS_MUTABLE_FIELDS);

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  const item = await NewsFeed.findOne({
    _id: id,
    ...managedScopeFilter(user),
  });

  if (!item) {
    throw new ApiError(404, "News post not found");
  }

  if (Object.prototype.hasOwnProperty.call(updatePayload, "status")) {
    if (updatePayload.status === "published" && item.status !== "published") {
      updatePayload.publishedAt = new Date();
    }

    if (updatePayload.status === "draft") {
      updatePayload.publishedAt = null;
    }
  }

  Object.assign(item, updatePayload);
  await item.save();

  return decorateNewsItem(item.toJSON());
}

export async function archiveManagedNews({ user, id }) {
  return updateManagedNews({
    user,
    id,
    payload: { status: "archived" },
  });
}
