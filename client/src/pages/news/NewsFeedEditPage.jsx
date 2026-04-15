import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { getNewsFeed, updateNewsFeed } from "../../services/newsFeedService.js";
import NewsFeedForm from "./NewsFeedForm.jsx";

export default function NewsFeedEditPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "General",
    author: "",
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
        const response = await getNewsFeed(id);
        const item = response.data;
        setForm({
          title: item.title || "",
          content: item.content || "",
          category: item.category || "General",
          author: item.author || "",
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
  }, [id]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await updateNewsFeed(id, form);
      navigate(`/news-feeds/${id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to update news post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Edit record" title="Edit News Post" />
      {loading && <StatusMessage>Loading news post...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && !error && (
        <NewsFeedForm
          form={form}
          onCancel={() => navigate(`/news-feeds/${id}`)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel="Update News Post"
          submitting={submitting}
        />
      )}
    </div>
  );
}
