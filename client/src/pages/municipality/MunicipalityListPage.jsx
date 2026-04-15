import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { deleteMunicipality, getMunicipalities } from "../../services/municipalityService.js";

const formatNumber = (value) => Number(value || 0).toLocaleString();

export default function MunicipalityListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMunicipalities();
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load municipalities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteMunicipality(pendingDelete._id);
      setPendingDelete(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete municipality.");
      setPendingDelete(null);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        action="Add Municipality"
        description="LGU records for provinces, mayors, and population data."
        eyebrow="Records"
        onAction={() => navigate("/municipalities/create")}
        title="Municipalities"
      />

      {loading && <StatusMessage>Loading municipalities...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "province", label: "Province" },
            { key: "mayor", label: "Mayor" },
            { key: "population", label: "Population", render: (row) => formatNumber(row.population) },
          ]}
          emptyMessage="No municipalities have been added."
          onDelete={(row) => setPendingDelete(row)}
          onEdit={(row) => navigate(`/municipalities/${row._id}/edit`)}
          onView={(row) => navigate(`/municipalities/${row._id}`)}
          rows={items}
        />
      )}

      <ConfirmModal
        message={`Delete ${pendingDelete?.name || "this municipality"}? This action cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        open={Boolean(pendingDelete)}
        title="Delete Municipality"
      />
    </div>
  );
}
