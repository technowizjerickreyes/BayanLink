import FormInput from "../../components/common/FormInput.jsx";
import Icon from "../../components/common/Icon.jsx";
import { NEWS_CATEGORY_OPTIONS, NEWS_STATUS_OPTIONS, getAuthoringScopeDetails } from "./newsFeedUtils.js";

const audienceOptions = [
  { label: "Municipality-wide", value: "municipality" },
  { label: "Barangay only", value: "barangay" },
];

export default function NewsFeedForm({ audienceLocked = true, form, onCancel, onChange, onSubmit, submitLabel, submitting, user }) {
  const scopeDetails = getAuthoringScopeDetails(user);

  return (
    <form className="form-panel news-compose-form" onSubmit={onSubmit}>
      <section className="news-compose-hero">
        <div className="news-compose-copy">
          <p className="eyebrow">Publishing scope</p>
          <h2>{scopeDetails.title}</h2>
          <p>{scopeDetails.description}</p>
        </div>
        <div className="news-compose-fact-grid">
          <div className="news-compose-fact">
            <small>Posting office</small>
            <strong>{scopeDetails.sourceLabel}</strong>
          </div>
          <div className="news-compose-fact">
            <small>Visible to</small>
            <strong>{scopeDetails.visibilityLabel}</strong>
          </div>
        </div>
      </section>

      <div className="form-grid two">
        <FormInput
          hint="Use a short, specific headline so residents can scan the feed quickly."
          label="Title"
          name="title"
          onChange={onChange}
          required
          value={form.title}
        />
        <FormInput
          label="Type"
          name="category"
          onChange={onChange}
          options={NEWS_CATEGORY_OPTIONS}
          type="select"
          value={form.category}
        />
      </div>

      <div className="form-grid two">
        <FormInput
          hint="Draft stays hidden. Publish records the current publish date and time. Archive removes it from active feeds."
          label="Status"
          name="status"
          onChange={onChange}
          options={NEWS_STATUS_OPTIONS}
          type="select"
          value={form.status}
        />
        {audienceLocked ? (
          <div className="news-readonly-card">
            <small>Audience</small>
            <strong>{form.audienceScope === "barangay" ? "Barangay residents only" : "Entire municipality"}</strong>
            <p>Audience scope is locked to your role assignment so visibility is enforced consistently.</p>
          </div>
        ) : (
          <FormInput label="Audience" name="audienceScope" onChange={onChange} options={audienceOptions} type="select" value={form.audienceScope} />
        )}
      </div>

      <FormInput
        hint="Optional thumbnail displayed on the feed card and the announcement detail view."
        label="Thumbnail image URL"
        name="imageUrl"
        onChange={onChange}
        placeholder="https://example.com/announcement-thumbnail.jpg"
        value={form.imageUrl}
      />

      {form.imageUrl && (
        <div className="news-image-preview">
          <img alt="Announcement thumbnail preview" className="news-image" src={form.imageUrl} />
        </div>
      )}

      <FormInput
        hint="Lead with the most important update. The opening lines become the summary residents see in the feed."
        label="Announcement details"
        name="content"
        onChange={onChange}
        required
        rows="9"
        type="textarea"
        value={form.content}
      />

      <div className="news-compose-footer">
        <FormInput checked={form.isPinned} label="Pin this announcement near the top of the feed" name="isPinned" onChange={onChange} type="checkbox" />
        <div className="news-compose-note">
          <Icon name="calendar" />
          <p>
            {form.status === "published"
              ? "Publishing now will stamp the live publish date and time shown to residents."
              : form.status === "archived"
                ? "Archived announcements stay out of active feeds but remain available for record keeping."
                : "Draft announcements stay hidden until you publish them."}
          </p>
        </div>
      </div>

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
