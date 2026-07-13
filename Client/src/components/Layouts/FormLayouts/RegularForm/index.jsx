import "./index.css";
function RegularForm({
  title,
  children,
  onSave,
  onCancel,
  attachmentName,
  attachmentPath,
  formData,
  onApprove,
  onReject,
}) {
  return (
    <div className="form-layout-page">
      {title && (
        <div className="form-layout-header">
          <h2>{title}</h2>
          <div className="form-layout-header-actions">
            {attachmentName && (
              <a
                href={attachmentPath}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-link"
              >
                📎 {attachmentName}
              </a>
            )}{" "}
            {onApprove && (
              <>
                {formData?.operationsClientApproved === null ||
                formData?.operationsClientApproved === undefined ? (
                  <>
                    <button
                      type="button"
                      className="approve-button"
                      onClick={onApprove}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="reject-button"
                      onClick={onReject}
                    >
                      Reject
                    </button>
                  </>
                ) : formData.operationsClientApproved ? (
                  <span className="approvedText">Approved</span>
                ) : (
                  <span className="rejectedText">Rejected</span>
                )}
              </>
            )}
            <button type="button" className="primary-button" onClick={onSave}>
              Save
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="form-layout-card">
        <div className="form-layout-grid">{children}</div>
      </div>
    </div>
  );
}

export default RegularForm;
