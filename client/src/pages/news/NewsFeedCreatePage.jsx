import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusMessage from "../../components/common/StatusMessage.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { createNewsFeed } from "../../services/newsFeedService.js";
import { getNewsPath } from "../../utils/rolePaths.js";
import NewsFeedForm from "./NewsFeedForm.jsx";

const getInitialForm = (role) => ({
  title: "",
  content: "",
  category: "General",
  status: "draft",
  audienceScope: role === "barangay_admin" ? "barangay" : "municipality",
  isPinned: false,
  imageUrl: "",
});

export default function NewsFeedCreatePage() {
  const { user } = useAuth();
  const newsPath = getNewsPath(user?.role);
  const [form, setForm] = useState(() => getInitialForm(user?.role));
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
      await createNewsFeed(user.role, form);
      navigate(newsPath);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create news post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack narrow">
      <PageHeader
        description="Write a clear official update with the right scope, source context, and publishing status before it appears in the feed."
        eyebrow="Create announcement"
        title={user?.role === "barangay_admin" ? "Create Barangay Announcement" : "Create Municipality Announcement"}
      />
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <NewsFeedForm
        form={form}
        onCancel={() => navigate(newsPath)}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save Announcement"
        submitting={submitting}
        user={user}
      />
    </div>
  );
}
