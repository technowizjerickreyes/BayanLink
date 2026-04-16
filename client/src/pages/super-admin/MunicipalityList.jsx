import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getMunicipalities } from "../../services/municipalityService.js";
import { formatDateTime } from "../../utils/formatters.js";
import { municipalitySortOptions, municipalityStatusOptions } from "./municipalityUtils.js";

const limitOptions = [10, 20, 50];

function buildInitialFilters() {
  return {
    limit: 10,
    page: 1,
    search: "",
    sort: "-createdAt",
    status: "",
  };
}

export default function MunicipalityList() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [draftFilters, setDraftFilters] = useState(buildInitialFilters);
  const [filters, setFilters] = useState(buildInitialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMunicipalities({
          limit: filters.limit,
          page: filters.page,
          search: filters.search || undefined,
          sort: filters.sort || undefined,
          status: filters.status || undefined,
        });
        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { page: 1, pages: 1, total: 0, limit: filters.limit });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load municipalities.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraftFilters((current) => ({
      ...current,
      [name]: name === "limit" ? Number(value) : value,
    }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setFilters({
      ...draftFilters,
      page: 1,
    });
  };

  const clearFilters = () => {
    const reset = buildInitialFilters();
    setDraftFilters(reset);
    setFilters(reset);
  };

  const activeCount = items.filter((item) => item.status === "active").length;
  const inactiveCount = items.filter((item) => item.status === "inactive").length;

  return (
    <div className="page-stack">
      <PageHeader
        action="Create Municipality"
        description="Manage municipality master records with protected identity fields, operational contacts, and audit-aware controls."
        eyebrow="Super Admin"
        onAction={() => navigate("/super-admin/municipalities/create")}
        title="Municipality Management"
      />

      <section className="municipality-hero">
        <div className="municipality-hero-copy">
          <p className="eyebrow">Secure administration</p>
          <h2>Protected master records with simpler day-to-day management</h2>
          <p>Municipality identity fields stay protected, while operational contact details remain easy to review and update.</p>
        </div>
        <div className="municipality-hero-pills">
          <span>No hard delete in default UI</span>
          <span>Immutable master fields</span>
          <span>Audit-aware updates</span>
        </div>
      </section>

      <section className="stat-grid municipality-stat-grid">
        <StatCard caption="All records matching the current scope" icon="building" label="Total records" tone="success" value={meta.total || 0} />
        <StatCard caption="Active municipalities on this page" icon="check" label="Active visible" tone="blue" value={activeCount} />
        <StatCard caption="Inactive municipalities on this page" icon="lock" label="Inactive visible" tone="coral" value={inactiveCount} />
      </section>

      <form className="municipality-filter-bar" onSubmit={applyFilters}>
        <div className="municipality-filter-grid">
          <label className="field municipality-search-field">
            <span className="form-label mb-0">Search</span>
            <input
              className="form-control"
              name="search"
              onChange={handleDraftChange}
              placeholder="Code, municipality name, province, or region"
              value={draftFilters.search}
            />
          </label>
          <label className="field">
            <span className="form-label mb-0">Status</span>
            <select className="form-select" name="status" onChange={handleDraftChange} value={draftFilters.status}>
              <option value="">All statuses</option>
              {municipalityStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="form-label mb-0">Sort</span>
            <select className="form-select" name="sort" onChange={handleDraftChange} value={draftFilters.sort}>
              {municipalitySortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="form-label mb-0">Rows per page</span>
            <select className="form-select" name="limit" onChange={handleDraftChange} value={draftFilters.limit}>
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="municipality-filter-actions">
          <button className="button primary btn btn-success" type="submit">
            Apply Filters
          </button>
          <button className="button ghost btn btn-light" onClick={clearFilters} type="button">
            Reset
          </button>
        </div>
      </form>

      {loading && <StatusMessage>Loading municipalities...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && (
        <>
          <DataTable
            columns={[
              {
                key: "name",
                label: "Municipality",
                render: (row) => (
                  <div className="municipality-table-cell">
                    <strong>{row.name}</strong>
                    <small>{row.code}</small>
                  </div>
                ),
              },
              {
                key: "province",
                label: "Location",
                render: (row) => (
                  <div className="municipality-table-cell">
                    <strong>{row.province}</strong>
                    <small>{row.region}</small>
                  </div>
                ),
              },
              {
                key: "officialEmail",
                label: "Office Contact",
                render: (row) => (
                  <div className="municipality-table-cell">
                    <strong>{row.officialEmail}</strong>
                    <small>{row.officialContactNumber || "No contact number"}</small>
                  </div>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (row) => (
                  <div className="municipality-table-cell">
                    <StatusBadge value={row.status} />
                    <small>Updated {formatDateTime(row.updatedAt || row.createdAt)}</small>
                  </div>
                ),
              },
            ]}
            emptyMessage="Create a municipality to begin protected master record management."
            emptyTitle="No municipalities found"
            onEdit={(row) => navigate(`/super-admin/municipalities/${row._id}/edit`)}
            onView={(row) => navigate(`/super-admin/municipalities/${row._id}`)}
            rows={items}
            toolbarContent={(
              <div className="municipality-table-toolbar">
                <span>
                  Showing {(meta.total || 0) === 0 ? 0 : (meta.page - 1) * meta.limit + 1}-
                  {Math.min(meta.page * meta.limit, meta.total || 0)} of {meta.total || 0}
                </span>
                <small>Protected municipality records only. No destructive action is shown here.</small>
              </div>
            )}
          />
          <div className="pagination-bar">
            <span>
              Page {meta.page} of {meta.pages}
            </span>
            <div>
              <button
                className="button ghost btn btn-light"
                disabled={meta.page <= 1}
                onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                type="button"
              >
                Previous
              </button>
              <button
                className="button ghost btn btn-light"
                disabled={meta.page >= meta.pages}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
