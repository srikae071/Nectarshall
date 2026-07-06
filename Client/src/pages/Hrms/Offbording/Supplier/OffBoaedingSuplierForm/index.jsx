import CncLeftLayout from "../../../../Cnc/CncLeftLayout";
import RegularForm from "../../../../../components/Layouts/FormLayouts/RegularForm";
import { useState } from "react";
import "./index.css";

function OffboardingSupplierForm() {
  const [activeTab, setActiveTab] = useState("Notes");

  const [notesData, setNotesData] = useState({
    watchList: "",
    workNotes: "",

    planningList: "",
    planningNotes: "",

    scheduleList: "",
    scheduleNotes: "",

    riskList: "",
    riskNotes: "",

    conflictList: "",
    conflictNotes: "",

    closureList: "",
    closureNotes: "",
  });

  const handleNotesChange = (e) => {
    setNotesData({
      ...notesData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <CncLeftLayout>
      <RegularForm
        title="Offboarding Compliance"
        onSave={() => {}}
        onCancel={() => {}}
      >
        <div className="form-row">
          <label className="form-label">Company Name</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">ABN</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">ACN</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Address</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Company Address</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Company Phone</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">SPOC Name</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">SPOC Number</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Email</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Contact Number</label>
          <input className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Onboarding Date</label>
          <input type="date" className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Offboarding Date</label>
          <input type="date" className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Type</label>
          <select className="form-select">
            <option>Adhoc</option>
            <option>Contractual</option>
          </select>
        </div>

        <div className="form-row form-full">
          <label className="form-label">Short Description</label>
          <textarea className="form-short-textarea" />
        </div>

        <div className="form-row form-full">
          <label className="form-label">Description</label>
          <textarea className="form-description-textarea" />
        </div>
        <div className="notes-container">
          <div className="notes-tabs">
            <button
              className={
                activeTab === "Notes" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Notes")}
              type="button"
            >
              Notes
            </button>

            <button
              className={
                activeTab === "Planning" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Planning")}
              type="button"
            >
              Planning
            </button>

            <button
              className={
                activeTab === "Schedule" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Schedule")}
              type="button"
            >
              Schedule
            </button>

            <button
              className={
                activeTab === "Risk" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Risk")}
              type="button"
            >
              Risk Assessment
            </button>

            <button
              className={
                activeTab === "Conflicts" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Conflicts")}
              type="button"
            >
              Conflicts
            </button>

            <button
              className={
                activeTab === "Closure" ? "notes-tab active" : "notes-tab"
              }
              onClick={() => setActiveTab("Closure")}
              type="button"
            >
              Closure Information
            </button>
          </div>

          <div className="notes-body">
            {activeTab === "Notes" && (
              <>
                <div className="notes-row">
                  <label>Watch List</label>

                  <input
                    className="notes-input"
                    name="watchList"
                    value={notesData.watchList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Work Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="workNotes"
                    value={notesData.workNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}

            {activeTab === "Planning" && (
              <>
                <div className="notes-row">
                  <label>Planning List</label>

                  <input
                    className="notes-input"
                    name="planningList"
                    value={notesData.planningList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Planning Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="planningNotes"
                    value={notesData.planningNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}

            {activeTab === "Schedule" && (
              <>
                <div className="notes-row">
                  <label>Schedule List</label>

                  <input
                    className="notes-input"
                    name="scheduleList"
                    value={notesData.scheduleList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Schedule Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="scheduleNotes"
                    value={notesData.scheduleNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}

            {activeTab === "Risk" && (
              <>
                <div className="notes-row">
                  <label>Risk List</label>

                  <input
                    className="notes-input"
                    name="riskList"
                    value={notesData.riskList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Risk Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="riskNotes"
                    value={notesData.riskNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}

            {activeTab === "Conflicts" && (
              <>
                <div className="notes-row">
                  <label>Conflict List</label>

                  <input
                    className="notes-input"
                    name="conflictList"
                    value={notesData.conflictList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Conflict Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="conflictNotes"
                    value={notesData.conflictNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}

            {activeTab === "Closure" && (
              <>
                <div className="notes-row">
                  <label>Closure List</label>

                  <input
                    className="notes-input"
                    name="closureList"
                    value={notesData.closureList}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-row">
                  <label>Closure Notes</label>

                  <textarea
                    className="notes-textarea"
                    name="closureNotes"
                    value={notesData.closureNotes}
                    onChange={handleNotesChange}
                  />
                </div>

                <div className="notes-post">
                  <button type="button">Post</button>
                </div>
              </>
            )}
          </div>
        </div>
      </RegularForm>
    </CncLeftLayout>
  );
}

export default OffboardingSupplierForm;
