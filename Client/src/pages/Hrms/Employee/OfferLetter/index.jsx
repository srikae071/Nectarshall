import HrmsLeftLayout from "../../../Hrms/HrmsHome.jsx/index";
import "./index.css";

function OfferLetter() {
  return (
    <HrmsLeftLayout>
      <div className="page">
        <div className="card">
          <h2 className="title">Offer Letter</h2>

          <div className="upload-section">
            <label className="label">Upload Offer Letter</label>

            <div className="file-input">
              <button className="choose-btn">Choose file</button>
              <span className="file-text">No file chosen</span>
            </div>
          </div>

          <div className="actions">
            <button className="upload-btn">
              <span className="icon"></span> Upload
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>

        <footer className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </footer>
      </div>
    </HrmsLeftLayout>
  );
}

export default OfferLetter;
