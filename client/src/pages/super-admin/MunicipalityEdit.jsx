import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getMunicipality, updateMunicipality } from "../../services/municipalityService.js";
import MunicipalityForm, { municipalityInitialForm } from "./MunicipalityForm.jsx";
import {
  buildMunicipalityUpdatePayload,
  extractApiFieldErrors,
  getApiErrorMessage,
  getMunicipalityFormValues,
  validateMunicipalityForm,
} from "./municipalityUtils.js";

export default function MunicipalityEdit() {
  const [form, setForm] = useState(municipalityInitialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMunicipality(id);
        setForm(getMunicipalityFormValues(response.data));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Failed to load municipality."));
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateMunicipalityForm(form, "edit");

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please review the highlighted editable fields before saving.");
      return;
    }

    setFieldErrors({});
    setError("");
    setConfirming(true);
  };

  const confirmSave = async () => {
    try {
      setSubmitting(true);
      setError("");
      setFieldErrors({});
      await updateMunicipality(id, buildMunicipalityUpdatePayload(form));
      navigate(`/super-admin/municipalities/${id}`);
    } catch (requestError) {
      setFieldErrors(extractApiFieldErrors(requestError));
      setError(getApiErrorMessage(requestError, "Failed to update municipality."));
      setConfirming(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader
        description="Update only the municipality's operational fields. Protected master fields stay read-only to preserve record integrity."
        eyebrow="Super Admin"
        title="Edit Municipality"
      />
      {loading && <StatusMessage>Loading municipality...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && !error && (
        <MunicipalityForm
          errors={fieldErrors}
          form={form}
          mode="edit"
          onCancel={() => navigate(`/super-admin/municipalities/${id}`)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Review and Save"
          submitting={submitting}
        />
      )}
      <ConfirmModal
        confirmLabel={submitting ? "Saving..." : "Save Changes"}
        confirmTone="primary"
        message="Save the updated operational municipality details? Protected master fields will remain unchanged."
        onCancel={() => setConfirming(false)}
        onConfirm={confirmSave}
        open={confirming}
        title="Confirm Municipality Update"
      />
    </div>
  );
}
