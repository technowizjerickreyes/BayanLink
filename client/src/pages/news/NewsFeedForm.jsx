import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";

const categoryOptions = ["Ayuda", "Emergency", "Projects", "Events", "Health", "General"].map((category) => ({
  label: category,
  value: category,
}));

export default function NewsFeedForm({ form, onChange, onSubmit, submitting, submitLabel, onCancel }) {
  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <FormInput label="Title" name="title" onChange={onChange} required value={form.title} />
      <FormInput label="Author" name="author" onChange={onChange} required value={form.author} />
      <FormInput label="Category" name="category" onChange={onChange} options={categoryOptions} type="select" value={form.category} />
      <FormInput label="Image URL" name="imageUrl" onChange={onChange} placeholder="https://example.com/image.jpg" value={form.imageUrl} />
      <FormInput label="Content" name="content" onChange={onChange} required rows="7" type="textarea" value={form.content} />
      <FormInput checked={form.isPinned} label="Pinned announcement" name="isPinned" onChange={onChange} type="checkbox" />

      <div className="form-actions">
        <button className="button ghost btn btn-light" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button primary btn btn-success" disabled={submitting} type="submit">
          <Icon name="save" />
          <span>{submitting ? "Saving..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
