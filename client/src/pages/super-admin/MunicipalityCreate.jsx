import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { createMunicipality } from "../../services/municipalityService.js";
import MunicipalityForm, { municipalityInitialForm } from "./MunicipalityForm.jsx";
import {
  buildMunicipalityCreatePayload,
  extractApiFieldErrors,
  getApiErrorMessage,
  validateMunicipalityForm,
} from "./municipalityUtils.js";

export default function MunicipalityCreate() {
  const [form, setForm] = useState(municipalityInitialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateMunicipalityForm(form, "create");

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please review the highlighted municipality fields before continuing.");
      return;
    }

    setFieldErrors({});
    setError("");
    setConfirming(true);
  };

  const confirmCreate = async () => {
    try {
      setSubmitting(true);
      setError("");
      setFieldErrors({});
      await createMunicipality(buildMunicipalityCreatePayload(form));
      navigate("/super-admin/municipalities");
    } catch (requestError) {
      setFieldErrors(extractApiFieldErrors(requestError));
      setError(getApiErrorMessage(requestError, "Failed to create municipality."));
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader
        description="Register a municipality master record with protected identity fields and clear operational contact details."
        eyebrow="Super Admin"
        title="Create Municipality"
      />
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <MunicipalityForm
        errors={fieldErrors}
        form={form}
        onCancel={() => navigate("/super-admin/municipalities")}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Review and Save"
        submitting={submitting}
      />
      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Create Municipality"}
        confirmTone="primary"
        message={`Create ${form.name || "this municipality"} with protected master fields? Code, name, province, and region will become read-only after creation.`}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmCreate}
        open={confirming}
        title="Confirm Municipality Creation"
      />
    </div>
  );
}
