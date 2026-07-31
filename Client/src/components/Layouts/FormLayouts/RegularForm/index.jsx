import { useRef } from "react";
import "./index.css";
function RegularForm({
  title,
  children,
  onSave,
  onCancel,
  onAttachment,
  attachmentName,
  actions,
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
            {actions}
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
                {formData?.operationsClientApproved === true ? (
                  <span
                    className="approvedBadge"
                    style={{
                      backgroundColor: "#dcfce7",
                      color: "#15803d",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      border: "1px solid #bbf7d0",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    ✓ Approved
                  </span>
                ) : formData?.operationsClientApproved === false ? (
                  <span
                    className="rejectedBadge"
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      border: "1px solid #fecaca",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    ✕ Rejected
                  </span>
                ) : (
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
