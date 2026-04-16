import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { assignMunicipalAdmin, getMunicipality } from "../../services/municipalityService.js";
import { formatDateTime, formatStatusLabel } from "../../utils/formatters.js";
import {
  formatAuditActionLabel,
  formatAuditValue,
  getApiErrorMessage,
  getAuditActorLabel,
  getMunicipalityFieldLabel,
  municipalityEditableFieldDefinitions,
  municipalityProtectedFieldDefinitions,
} from "./municipalityUtils.js";

function DetailField({ label, value }) {
  return (
    <div className="municipality-readonly-card">
      <small>{label}</small>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function AuditChangeList({ log }) {
  const fields = Array.from(
    new Set([...(log.changedFields || []), ...Object.keys(log.oldValues || {}), ...Object.keys(log.newValues || {})])
  );

  if (fields.length === 0) {
    return <p className="municipality-audit-note">No field-level changes were recorded for this event.</p>;
  }

  return (
    <div className="municipality-audit-change-grid">
      {fields.map((field) => (
        <article className="municipality-audit-change" key={`${log._id}-${field}`}>
          <small>{getMunicipalityFieldLabel(field)}</small>
          <div>
            <span>Before</span>
            <strong>{formatAuditValue(log.oldValues?.[field])}</strong>
          </div>
          <div>
            <span>After</span>
            <strong>{formatAuditValue(log.newValues?.[field])}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function MunicipalityView() {
  const [item, setItem] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const loadMunicipality = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMunicipality(id);
      setItem(response.data);
      setAuditLogs(response.meta?.auditLogs || []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Failed to load municipality."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMunicipality();
  }, [id]);

  const handleAssignChange = (event) => {
    const { name, value } = event.target;
    setAssignForm((current) => ({ ...current, [name]: value }));
  };

  const handleAssignSubmit = async (event) => {
    event.preventDefault();

    try {
      setAssigning(true);
      setAssignError("");
      await assignMunicipalAdmin(id, assignForm);
      setAssignOpen(false);
      setAssignForm({ email: "", firstName: "", lastName: "", phone: "", password: "", passwordConfirm: "" });
      setSuccessMessage("Municipal admin assignment saved. The latest audit entry has been refreshed below.");
      await loadMunicipality();
    } catch (requestError) {
      setAssignError(getApiErrorMessage(requestError, "Failed to assign municipal admin."));
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        description="Review protected municipality identity fields, editable operational settings, and recent sensitive changes in one place."
        eyebrow="Super Admin"
        title={item?.name || "Municipality"}
      />
      {loading && <StatusMessage>Loading municipality...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {successMessage && <StatusMessage>{successMessage}</StatusMessage>}
      {!loading && item && (
        <>
          <section className="municipality-hero detail">
            <div className="municipality-hero-copy">
              <p className="eyebrow">Municipality record</p>
              <h2>{item.name}</h2>
              <p>
                {item.code} in {item.province}, {item.region}. Protected master fields remain locked after creation to preserve record
                integrity.
              </p>
            </div>
            <div className="municipality-hero-pills detail">
              <span>
                <StatusBadge value={item.status} />
              </span>
              <span>Created {formatDateTime(item.createdAt)}</span>
              <span>Updated {formatDateTime(item.updatedAt)}</span>
            </div>
          </section>

          <div className="municipality-detail-grid">
            <section className="detail-panel municipality-section-card">
              <div className="municipality-section-head">
                <div>
                  <p className="eyebrow">Protected fields</p>
                  <h2>Municipality identity</h2>
                </div>
                <p>These master fields are intentionally read-only after creation.</p>
              </div>
              <div className="municipality-readonly-grid">
                {municipalityProtectedFieldDefinitions.map((field) => (
                  <DetailField key={field.key} label={field.label} value={item[field.key]} />
                ))}
              </div>
            </section>

            <section className="detail-panel municipality-section-card">
              <div className="municipality-section-head">
                <div>
                  <p className="eyebrow">Editable fields</p>
                  <h2>Operational settings</h2>
                </div>
                <p>These values can be updated from the edit screen without changing the protected municipality identity.</p>
              </div>
              <div className="municipality-readonly-grid">
                {municipalityEditableFieldDefinitions.map((field) => (
                  <DetailField
                    key={field.key}
                    label={field.label}
                    value={field.key === "status" ? formatStatusLabel(item[field.key]) : item[field.key]}
                  />
                ))}
              </div>
              {item.logoUrl && (
                <div className="municipality-logo-preview">
                  <img alt={`${item.name} logo`} className="municipality-logo-image" src={item.logoUrl} />
                  <div>
                    <small>Current logo</small>
                    <strong>{item.name}</strong>
                  </div>
                </div>
              )}
            </section>
          </div>

          <section className="detail-panel municipality-section-card">
            <div className="municipality-section-head">
              <div>
                <p className="eyebrow">Audit trail</p>
                <h2>Recent sensitive actions</h2>
              </div>
              <p>Every municipality creation, update, and admin assignment is recorded here for traceability.</p>
            </div>
            {auditLogs.length === 0 ? (
              <EmptyState icon="lock" message="Sensitive municipality actions will appear here once changes are recorded." title="No audit entries yet" />
            ) : (
              <div className="municipality-audit-list">
                {auditLogs.map((log) => (
                  <article className="municipality-audit-item" key={log._id}>
                    <div className="municipality-audit-top">
                      <div>
                        <strong>{formatAuditActionLabel(log.actionType)}</strong>
                        <p>{getAuditActorLabel(log)}</p>
                      </div>
                      <small>{formatDateTime(log.createdAt)}</small>
                    </div>
                    <div className="municipality-audit-tags">
                      {(log.changedFields || []).length > 0 ? (
                        log.changedFields.map((field) => <span key={`${log._id}-${field}`}>{getMunicipalityFieldLabel(field)}</span>)
                      ) : (
                        <span>No field changes</span>
                      )}
                    </div>
                    <AuditChangeList log={log} />
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate("/super-admin/municipalities")} type="button">
              Back
            </button>
            <button className="button ghost btn btn-light" onClick={() => setAssignOpen(true)} type="button">
              <Icon name="people" />
              <span>Assign Municipal Admin</span>
            </button>
            <button className="button primary btn btn-success" onClick={() => navigate(`/super-admin/municipalities/${id}/edit`)} type="button">
              <Icon name="edit" />
              <span>Edit Municipality</span>
            </button>
          </div>

          {assignOpen && (
            <div className="modal-backdrop" role="presentation">
              <section aria-modal="true" className="modal wide municipality-assign-modal" role="dialog">
                <button aria-label="Close" className="icon-button modal-close" onClick={() => setAssignOpen(false)} title="Close" type="button">
                  <Icon name="close" />
                </button>
                <div className="municipality-section-head">
                  <div>
                    <p className="eyebrow">Administrative action</p>
                    <h2>Assign Municipal Admin</h2>
                  </div>
                  <p>Assigning an admin does not change the municipality's protected master fields.</p>
                </div>
                {assignError && <StatusMessage type="error">{assignError}</StatusMessage>}
                <form className="modal-form" onSubmit={handleAssignSubmit}>
                  <div className="form-grid two">
                    <FormInput label="First Name" name="firstName" onChange={handleAssignChange} required value={assignForm.firstName} />
                    <FormInput label="Last Name" name="lastName" onChange={handleAssignChange} required value={assignForm.lastName} />
                    <FormInput label="Email" name="email" onChange={handleAssignChange} required type="email" value={assignForm.email} />
                    <FormInput label="Phone" name="phone" onChange={handleAssignChange} value={assignForm.phone} />
                    <FormInput label="Temporary Password" name="password" onChange={handleAssignChange} required type="password" value={assignForm.password} />
                    <FormInput
                      label="Confirm Password"
                      name="passwordConfirm"
                      onChange={handleAssignChange}
                      required
                      type="password"
                      value={assignForm.passwordConfirm}
                    />
                  </div>
                  <div className="municipality-safe-note compact">
                    <Icon name="lock" />
                    <p>This action creates or reassigns a municipal admin account and records the change in the audit trail.</p>
                  </div>
                  <div className="modal-actions">
                    <button className="button ghost btn btn-light" onClick={() => setAssignOpen(false)} type="button">
                      Cancel
                    </button>
                    <button className="button primary btn btn-success" disabled={assigning} type="submit">
                      {assigning ? "Assigning..." : "Assign Admin"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
