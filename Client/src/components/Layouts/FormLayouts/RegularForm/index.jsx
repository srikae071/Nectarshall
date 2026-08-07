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
  approvalStatus,
  onApprove,
  onReject,
}) {
  const fileInputRef = useRef(null);

  // If approvalStatus is not explicitly passed, determine from formData based on current context
  const currentApprovalState =
    approvalStatus !== undefined
      ? approvalStatus
      : formData?.accountsApproved !== undefined && formData?.accountsApproved !== null
      ? formData?.accountsApproved
      : formData?.operationsClientApproved;

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
                {currentApprovalState === true ? (
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
                ) : currentApprovalState === false ? (
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
                      style={{
                        backgroundColor: "#16a34a",
                        color: "white",
                        fontWeight: "700",
                        padding: "8px 18px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="reject-button"
                      onClick={onReject}
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        fontWeight: "700",
                        padding: "8px 18px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
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

      <div className="form-layout-grid">{children}</div>
    </div>
  );
}

export default RegularForm;
