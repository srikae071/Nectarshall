import "./index.css";

function TableLayout2({
  title,
  children,
  onSave,
  onCancel,
  onAttachment,
  attachmentName,
}) {
  return (
    <div className="table2-page">
      <div className="table2-header">
        <h2>{title}</h2>

        <div className="table2-actions">
          <label className="table2-attachment-btn">
            Choose Attachment
            <input type="file" hidden onChange={onAttachment} />
          </label>

          {attachmentName && (
            <span className="table2-attachment-name">{attachmentName}</span>
          )}

          <button type="button" className="table2-save-btn" onClick={onSave}>
            Save
          </button>

          <button
            type="button"
            className="table2-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="table2-card">
        <div className="table2-grid">{children}</div>
      </div>
    </div>
  );
}

export default TableLayout2;
