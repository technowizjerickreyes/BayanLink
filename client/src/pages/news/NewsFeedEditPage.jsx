import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getNewsFeed, updateNewsFeed } from "../../services/newsFeedService.js";
import { getNewsPath } from "../../utils/rolePaths.js";
import NewsFeedForm from "./NewsFeedForm.jsx";

export default function NewsFeedEditPage() {
  const { user } = useAuth();
  const newsPath = getNewsPath(user?.role);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "General",
    status: "draft",
    audienceScope: user?.role === "barangay_admin" ? "barangay" : "municipality",
    isPinned: false,
    imageUrl: "",
  });
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
        const response = await getNewsFeed(user.role, id);
        const item = response.data;
        setForm({
          title: item.title || "",
          content: item.content || "",
          category: item.category || "General",
          status: item.status || "draft",
          audienceScope: item.audienceScope || (user?.role === "barangay_admin" ? "barangay" : "municipality"),
          isPinned: Boolean(item.isPinned),
          imageUrl: item.imageUrl || "",
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load news post.");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, user?.role]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const { audienceScope, ...payload } = form;
      await updateNewsFeed(user.role, id, payload);
      navigate(`${newsPath}/${id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update news post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader
        description="Update the announcement content, thumbnail, and publishing status while keeping the same enforced audience scope."
        eyebrow="Edit announcement"
        title={user?.role === "barangay_admin" ? "Edit Barangay Announcement" : "Edit Municipality Announcement"}
      />
      {loading && <StatusMessage>Loading news post...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && !error && (
        <NewsFeedForm
          form={form}
          onCancel={() => navigate(`${newsPath}/${id}`)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Update Announcement"
          submitting={submitting}
          user={user}
        />
      )}
    </div>
  );
}
