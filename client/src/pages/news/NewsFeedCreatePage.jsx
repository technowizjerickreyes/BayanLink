import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { createNewsFeed } from "../../services/newsFeedService.js";
import NewsFeedForm from "./NewsFeedForm.jsx";

const initialForm = {
  title: "",
  content: "",
  category: "General",
  author: "",
  isPinned: false,
  imageUrl: "",
};

export default function NewsFeedCreatePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await createNewsFeed(form);
      navigate("/news-feeds");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create news post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader eyebrow="Add record" title="Add News Post" />
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <NewsFeedForm
        form={form}
        onCancel={() => navigate("/news-feeds")}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save News Post"
        submitting={submitting}
      />
    </div>
  );
}
