import Icon from "../common/Icon.jsx";
import { formatAttachmentSize, isImageAttachment } from "./documentRequestUtils.js";

export default function DocumentRequestAttachments({ attachments = [], emptyMessage = "No attachments were submitted yet.", title = "Attachments" }) {
  return (
    <section className="document-attachment-section">
      <div className="document-section-heading">
        <h2>{title}</h2>
        <p>Supporting files submitted for this request.</p>
      </div>

      {attachments.length === 0 ? (
        <div className="document-empty-inline">
          <Icon name="file" />
          <span>{emptyMessage}</span>
        </div>
      ) : (
        <div className="document-attachment-grid">
          {attachments.map((attachment) => (
            <a className="document-attachment-card" href={attachment.url} key={`${attachment.fileName}-${attachment.url}`} rel="noreferrer" target="_blank">
              {isImageAttachment(attachment) ? (
                <img alt={attachment.originalName} className="document-attachment-image" src={attachment.url} />
              ) : (
                <span className="document-attachment-icon">
                  <Icon name="file" />
                </span>
              )}
              <div className="document-attachment-copy">
                <strong>{attachment.originalName}</strong>
                <small>{attachment.mimeType}</small>
                <small>{formatAttachmentSize(attachment.size)}</small>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
