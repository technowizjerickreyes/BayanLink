import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getMunicipality, updateMunicipality } from "../../services/municipalityService.js";
import MunicipalityForm from "./MunicipalityForm.jsx";

export default function MunicipalityEditPage() {
  const [form, setForm] = useState({ name: "", province: "", mayor: "", population: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMunicipality(id);
        const item = response.data;
        setForm({
          name: item.name || "",
          province: item.province || "",
          mayor: item.mayor || "",
          population: item.population ?? "",
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load municipality.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await updateMunicipality(id, {
        ...form,
        population: Number(form.population),
      });
      navigate(`/municipalities/${id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update municipality.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Edit record" title="Edit Municipality" />
      {loading && <StatusMessage>Loading municipality...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && !error && (
        <MunicipalityForm
          form={form}
          onCancel={() => navigate(`/municipalities/${id}`)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Update Municipality"
          submitting={submitting}
        />
      )}
    </div>
  );
}
