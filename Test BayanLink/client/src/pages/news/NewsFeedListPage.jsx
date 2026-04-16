import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { deleteNewsFeed, getNewsFeeds } from "../../services/newsFeedService.js";

const formatDate = (value) => (value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-");

export default function NewsFeedListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getNewsFeeds();
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load news feed.");
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
      await deleteNewsFeed(pendingDelete._id);
      setPendingDelete(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to delete news post.");
      setPendingDelete(null);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        action="Add News Post"
        actionIcon="add"
        description="Announcements, public advisories, and mayor's office updates."
        eyebrow="Communications"
        onAction={() => navigate("/news-feeds/create")}
        title="News Feed"
      />

      {loading && <StatusMessage>Loading news feed...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && (
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "category", label: "Category", render: (row) => <span className="table-badge">{row.category}</span> },
            { key: "author", label: "Author" },
            { key: "isPinned", label: "Pinned", render: (row) => (row.isPinned ? <span className="table-badge success">Yes</span> : "No") },
            { key: "createdAt", label: "Published", render: (row) => formatDate(row.createdAt) },
          ]}
          emptyMessage="No news posts have been added."
          onDelete={(row) => setPendingDelete(row)}
          onEdit={(row) => navigate(`/news-feeds/${row._id}/edit`)}
          onView={(row) => navigate(`/news-feeds/${row._id}`)}
          rows={items}
        />
      )}

      <ConfirmModal
        message={`Delete ${pendingDelete?.title || "this news post"}? This action cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        open={Boolean(pendingDelete)}
        title="Delete News Post"
      />
    </div>
  );
}
