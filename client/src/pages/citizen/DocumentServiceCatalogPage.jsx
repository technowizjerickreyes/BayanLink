import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { documentRequestTypes } from "../../utils/serviceCatalog.js";
import { getDocumentScopeLabel } from "../../components/requests/documentRequestUtils.js";

export default function DocumentServiceCatalogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return documentRequestTypes;
    }

    return documentRequestTypes.filter((service) =>
      [service.label, service.description, service.scope, service.requirements.join(" "), service.feeLabel]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  return (
    <div className="page-stack">
      <PageHeader
        action="Open Request History"
        description="Browse available documents first so the request form only asks for what matters to the service you choose."
        eyebrow="Citizen Services"
        onAction={() => navigate("/citizen/document-requests")}
        title="Document Services Catalog"
      />

      <section className="document-module-hero">
        <div className="document-module-hero-copy">
          <p className="eyebrow">Guided online requests</p>
          <h2>Choose the document you need before filling out the request</h2>
          <p>Each card explains the service, required files, estimated processing time, and any fee guidance in plain language.</p>
        </div>
        <div className="document-module-hero-pills">
          <span>Simple service descriptions</span>
          <span>Requirements shown upfront</span>
          <span>Tracking number after submission</span>
        </div>
      </section>

      <section className="document-filter-panel">
        <label className="field">
          <span className="form-label mb-0">Search document services</span>
          <input
            className="form-control"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by document name, requirement, or office scope"
            value={search}
          />
        </label>
      </section>

      {filteredServices.length === 0 ? (
        <EmptyState
          actionLabel="Clear search"
          icon="file"
          message="Try a simpler keyword like clearance, indigency, residency, or permit."
          onAction={() => setSearch("")}
          title="No matching document services"
        />
      ) : (
        <div className="document-service-grid">
          {filteredServices.map((service) => (
            <article className="document-service-card" key={service.value}>
              <div className="document-service-top">
                <div>
                  <span className={`news-scope-pill ${service.scope}`}>{getDocumentScopeLabel(service.scope)}</span>
                  <h2>{service.label}</h2>
                </div>
                <span className="table-badge">{service.processingDays}</span>
              </div>

              <p>{service.description}</p>

              <div className="document-service-meta">
                <div>
                  <small>Estimated processing time</small>
                  <strong>{service.processingDays}</strong>
                </div>
                <div>
                  <small>Fee</small>
                  <strong>{service.feeLabel || "No fee listed"}</strong>
                </div>
              </div>

              <div className="document-requirement-box">
                <small>Requirements</small>
                <ul>
                  {service.requirements.map((requirement) => (
                    <li key={`${service.value}-${requirement}`}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="document-service-actions">
                <button
                  className="button primary btn btn-success"
                  onClick={() => navigate("/citizen/document-requests/create", { state: { requestType: service.value } })}
                  type="button"
                >
                  <Icon name="file" />
                  <span>Start request</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
