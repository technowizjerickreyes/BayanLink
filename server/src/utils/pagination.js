const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function getPagination(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getPaginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    pages: Math.max(Math.ceil(total / limit), 1),
  };
}
