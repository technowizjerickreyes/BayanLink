import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { createMunicipality } from "../../services/municipalityService.js";
import MunicipalityForm from "./MunicipalityForm.jsx";

const initialForm = {
  name: "",
  province: "",
  mayor: "",
  population: "",
};

export default function MunicipalityCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await createMunicipality({
        ...form,
        population: Number(form.population),
      });
      navigate("/municipalities");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create municipality.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Add record" title="Add Municipality" />
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <MunicipalityForm
        form={form}
        onCancel={() => navigate("/municipalities")}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save Municipality"
        submitting={submitting}
      />
    </div>
  );
}
