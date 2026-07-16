import { useRef } from "react";
import "./index.css";
function RegularForm({
  title,
  children,
  onSave,
  onCancel,
  onAttachment,
  attachmentName,

  formData,
  onApprove,
  onReject,
}) {
  const fileInputRef = useRef(null);
  return (
    <div className="form-layout-page">
      {title && (
        <div className="form-layout-header">
          <h2>{title}</h2>
          <div className="form-layout-header-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: "none" }}
              onChange={onAttachment}
            />

            <button
              type="button"
              className="attachment-btn"
              onClick={() => fileInputRef.current.click()}
            >
              📎 Attachment
            </button>

            {attachmentName && <span>{attachmentName}</span>}
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
