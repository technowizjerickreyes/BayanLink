import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getMunicipality } from "../../services/municipalityService.js";

const formatDate = (value) => (value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-");
const formatNumber = (value) => Number(value || 0).toLocaleString();

export default function MunicipalityViewPage() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getMunicipality(id);
        setItem(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load municipality.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Read record" title={item?.name || "Municipality"} />
      {loading && <StatusMessage>Loading municipality...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && item && (
        <>
          <section className="detail-panel">
            <dl>
              <div>
                <dt>Province</dt>
                <dd>{item.province}</dd>
              </div>
              <div>
                <dt>Mayor</dt>
                <dd>{item.mayor}</dd>
              </div>
              <div>
                <dt>Population</dt>
                <dd>{formatNumber(item.population)}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
          </section>
          <div className="form-actions">
            <button className="button ghost btn btn-light" onClick={() => navigate("/municipalities")} type="button">
              Back
            </button>
            <button className="button primary btn btn-success" onClick={() => navigate(`/municipalities/${id}/edit`)} type="button">
              <Icon name="edit" />
              <span>Edit Municipality</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
