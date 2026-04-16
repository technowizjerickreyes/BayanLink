import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { archiveNewsFeed, getNewsFeeds } from "../../services/newsFeedService.js";
import { canManageNews, getNewsPath } from "../../utils/rolePaths.js";
import NewsFeedDetailModal from "./NewsFeedDetailModal.jsx";
import NewsFeedSection from "./NewsFeedSection.jsx";
import {
  NEWS_CATEGORY_OPTIONS,
  getFeedHeaderCopy,
  getNewsFeedSections,
  getNewsSourceFilterOptions,
  hasActiveNewsFilters,
} from "./newsFeedUtils.js";

const SECTION_LIMIT = 6;

function buildEmptyMeta() {
  return { page: 1, pages: 1, total: 0, limit: SECTION_LIMIT };
}

function buildEmptySectionState() {
  return {
    barangay: { items: [], meta: buildEmptyMeta() },
    municipality: { items: [], meta: buildEmptyMeta() },
  };
}

function buildInitialFilters() {
  return {
    category: "",
    dateFrom: "",
    dateTo: "",
    search: "",
    source: "all",
    status: "",
  };
}

export default function NewsFeedListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = canManageNews(user?.role);
  const newsPath = getNewsPath(user?.role);
  const headerCopy = getFeedHeaderCopy(user, canManage);
  const sections = getNewsFeedSections(user);
  const sourceOptions = getNewsSourceFilterOptions(user);
  const [draftFilters, setDraftFilters] = useState(buildInitialFilters);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [sectionPages, setSectionPages] = useState({ barangay: 1, municipality: 1 });
  const [sectionState, setSectionState] = useState(buildEmptySectionState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingArchive, setPendingArchive] = useState(null);

  useEffect(() => {
    if (!user?.role) {
      return undefined;
    }

    const availableSections = getNewsFeedSections(user).filter((section) => filters.source === "all" || filters.source === section.key);
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const nextState = buildEmptySectionState();

        if (availableSections.length === 0) {
          if (!cancelled) {
            setSectionState(nextState);
          }
          return;
        }

        const responses = await Promise.all(
          availableSections.map(async (section) => {
            const response = await getNewsFeeds(user.role, {
              audienceScope: section.key,
              category: filters.category || undefined,
              dateFrom: filters.dateFrom || undefined,
              dateTo: filters.dateTo || undefined,
              limit: SECTION_LIMIT,
              page: sectionPages[section.key] || 1,
              search: filters.search || undefined,
              status: canManage ? filters.status || undefined : undefined,
            });

            return { response, sectionKey: section.key };
          })
        );

        responses.forEach(({ response, sectionKey }) => {
          nextState[sectionKey] = {
            items: Array.isArray(response.data) ? response.data : [],
            meta: response.meta || buildEmptyMeta(),
          };
        });

        if (!cancelled) {
          setSectionState(nextState);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Failed to load announcements.");
          setSectionState(buildEmptySectionState());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [canManage, filters, sectionPages, user]);

  const displayedSections = sections.filter((section) => filters.source === "all" || filters.source === section.key);
  const hasActiveFilters = hasActiveNewsFilters(filters);

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraftFilters((current) => ({ ...current, [name]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setFilters({ ...draftFilters });
    setSectionPages({ barangay: 1, municipality: 1 });
  };

  const handleClearFilters = () => {
    const resetFilters = buildInitialFilters();
    setDraftFilters(resetFilters);
    setFilters(resetFilters);
    setSectionPages({ barangay: 1, municipality: 1 });
  };

  const handleArchive = async () => {
    if (!pendingArchive) {
      return;
    }

    try {
      await archiveNewsFeed(user.role, pendingArchive._id);

      if (selectedItem?._id === pendingArchive._id) {
        setSelectedItem(null);
      }

      setPendingArchive(null);
      setSectionPages((current) => ({ ...current }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to archive announcement.");
      setPendingArchive(null);
    }
  };

  const handlePageChange = (sectionKey, nextPage) => {
    setSectionPages((current) => ({ ...current, [sectionKey]: nextPage }));
  };

  const openFullPage = (item) => {
    navigate(`${newsPath}/${item._id}`);
  };

  const openEditPage = (item) => {
    navigate(`${newsPath}/${item._id}/edit`);
  };

  return (
    <div className="page-stack">
      <PageHeader
        action={canManage ? "Create Announcement" : undefined}
        actionIcon="add"
        description={headerCopy.description}
        eyebrow="Communications"
        onAction={() => navigate(`${newsPath}/create`)}
        title={headerCopy.title}
      />

      <section className="news-feed-overview">
        <div className="news-feed-overview-copy">
          <p className="eyebrow">Trusted feed</p>
          <h2>Official updates scoped to the right area</h2>
          <p>
            Municipality-wide announcements stay inside the same municipality, while barangay-specific announcements only appear when the
            account&apos;s assigned barangay matches the post scope.
          </p>
        </div>
        <div className="news-feed-overview-pills">
          <span>Official office sources</span>
          <span>Published date and time</span>
          <span>Server-enforced visibility</span>
        </div>
      </section>

      <form className="news-filter-panel" onSubmit={handleApplyFilters}>
        <div className="news-filter-grid">
          <label className="field">
            <span className="form-label mb-0">Search</span>
            <input
              className="form-control"
              name="search"
              onChange={handleDraftChange}
              placeholder="Search by title, summary, content, or category"
              value={draftFilters.search}
            />
          </label>
          <label className="field">
            <span className="form-label mb-0">Type</span>
            <select className="form-select" name="category" onChange={handleDraftChange} value={draftFilters.category}>
              <option value="">All types</option>
              {NEWS_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="form-label mb-0">Source</span>
            <select className="form-select" name="source" onChange={handleDraftChange} value={draftFilters.source}>
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {canManage && (
            <label className="field">
              <span className="form-label mb-0">Status</span>
              <select className="form-select" name="status" onChange={handleDraftChange} value={draftFilters.status}>
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          )}
          <label className="field">
            <span className="form-label mb-0">From date</span>
            <input className="form-control" name="dateFrom" onChange={handleDraftChange} type="date" value={draftFilters.dateFrom} />
          </label>
          <label className="field">
            <span className="form-label mb-0">To date</span>
            <input className="form-control" name="dateTo" onChange={handleDraftChange} type="date" value={draftFilters.dateTo} />
          </label>
        </div>

        <div className="news-filter-actions">
          <button className="button primary btn btn-success" type="submit">
            Apply filters
          </button>
          <button className="button ghost btn btn-light" onClick={handleClearFilters} type="button">
            Clear
          </button>
        </div>
      </form>

      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {displayedSections.length === 0 && !loading ? (
        <EmptyState
          icon="news"
          message="The selected source is not available for your current role or assigned area."
          title="No visible announcement sections"
        />
      ) : (
        <div className="news-section-stack">
          {displayedSections.map((section) => (
            <NewsFeedSection
              canManage={canManage}
              emptyFiltered={hasActiveFilters}
              items={sectionState[section.key]?.items || []}
              key={section.key}
              loading={loading}
              meta={sectionState[section.key]?.meta || buildEmptyMeta()}
              onArchive={(item) => setPendingArchive(item)}
              onEdit={openEditPage}
              onPageChange={handlePageChange}
              onReadMore={(item) => setSelectedItem(item)}
              onView={openFullPage}
              section={section}
            />
          ))}
        </div>
      )}

      <NewsFeedDetailModal
        canManage={canManage}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={openEditPage}
        onOpenPage={openFullPage}
        open={Boolean(selectedItem)}
      />

      <ConfirmModal
        confirmLabel="Archive"
        message={`Archive ${pendingArchive?.title || "this announcement"}? Published residents will no longer see it in the feed.`}
        onCancel={() => setPendingArchive(null)}
        onConfirm={handleArchive}
        open={Boolean(pendingArchive)}
        title="Archive announcement"
      />
    </div>
  );
}
