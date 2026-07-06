import "./index.css";

function RegularForm({ title, children, onSave, onCancel }) {
  return (
    <div className="form-layout-page">
      {title && (
        <div className="form-layout-header">
          <h2>{title}</h2>

          <div className="form-layout-header-actions">
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
