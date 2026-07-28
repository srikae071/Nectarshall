import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";

function AddAdhoc() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");
  const [shiftStartTime, setShiftStartTime] = useState("08:00");
  const [shiftEndTime, setShiftEndTime] = useState("16:00");
  const [shiftStartDate, setShiftStartDate] = useState(todayStr);
  const [shiftEndDate, setShiftEndDate] = useState(todayStr);
  const [scopeOfWork, setScopeOfWork] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates"
        );
      } catch (err) {
        res = await axios.get("/api/BoardingCandidates");
      }
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Error fetching candidates for Add Adhoc:", err);
    } finally {
      setLoading(false);
    }
  };

  // Selected candidate object
  const selectedCandidate = candidates.find(
    (c) => c._id === selectedCandidateId
  );

  // Available contract deliverable sites for the selected candidate
  const availableSites = selectedCandidate?.contractDeliverables || [];

  const handleCompanyChange = (e) => {
    const candId = e.target.value;
    setSelectedCandidateId(candId);
    setSelectedContractId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      alert("Please select a company.");
      return;
    }
    if (!selectedContractId) {
      alert("Please select a site.");
      return;
    }

    try {
      setSaving(true);
      const contract = availableSites.find(
        (item) => item._id === selectedContractId
      );

      if (!contract) {
        throw new Error("Selected contract deliverable site not found.");
      }

      const existingAdhocServices = contract.adhocServices || [];
      const newAdhoc = {
        adhocId: `AD${Date.now().toString().slice(-4)}`,
        serviceType: "Adhoc Service",
        adhocName: "Adhoc",
        position: "Adhoc",
        shiftStartTime: shiftStartTime || "08:00",
        shiftEndTime: shiftEndTime || "16:00",
        shiftStartDate: shiftStartDate || todayStr,
        shiftEndDate: shiftEndDate || todayStr,
        serviceDate: shiftStartDate || new Date().toISOString(),
        companyName: selectedCandidate.companyName,
        siteName: contract.siteName,
        siteAddress: contract.siteAddress,
        scopeOfWork: scopeOfWork.trim(),
        employee: "",
      };

      const updatedAdhocServices = [...existingAdhocServices, newAdhoc];
      const updatedServices = contract.services || [];

      const apiUrl = `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${selectedCandidateId}/contracts/${selectedContractId}/services`;

      try {
        await axios.put(apiUrl, {
          services: updatedServices,
          adhocServices: updatedAdhocServices,
        });
      } catch (err) {
        await axios.put(
          `/api/BoardingCandidates/${selectedCandidateId}/contracts/${selectedContractId}/services`,
          {
            services: updatedServices,
            adhocServices: updatedAdhocServices,
          }
        );
      }

      alert("Adhoc service added successfully!");
      navigate("/roster");
    } catch (err) {
      console.error("Error adding adhoc service:", err);
      alert(`Failed to add adhoc service: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="addAdhocPage">
      <div className="addAdhocCard">
        <div className="addAdhocHeader">
          <h2>Add Adhoc Service</h2>
          <p>Create a new Adhoc shift service for a specific company site.</p>
        </div>

        {loading ? (
          <div className="addAdhocLoading">Loading companies and sites...</div>
        ) : (
          <form className="addAdhocForm" onSubmit={handleSubmit}>
            <div className="formField">
              <label htmlFor="companySelect">Select Company</label>
              <select
                id="companySelect"
                value={selectedCandidateId}
                onChange={handleCompanyChange}
                required
              >
                <option value="">-- Select Company --</option>
                {candidates.map((cand) => (
                  <option key={cand._id} value={cand._id}>
                    {cand.companyName || cand.clientId || "Unnamed Company"}
                  </option>
                ))}
              </select>
            </div>

            <div className="formField">
              <label htmlFor="siteSelect">Select Site</label>
              <select
                id="siteSelect"
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                disabled={!selectedCandidateId || availableSites.length === 0}
                required
              >
                <option value="">
                  {!selectedCandidateId
                    ? "-- Select Company First --"
                    : availableSites.length === 0
                    ? "-- No Sites Available --"
                    : "-- Select Site --"}
                </option>
                {availableSites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.siteName || "Site"}{" "}
                    {site.siteAddress ? `(${site.siteAddress})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="shiftStartInput">Shift Start Time</label>
                <input
                  id="shiftStartInput"
                  type="time"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                />
              </div>

              <div className="formField">
                <label htmlFor="shiftEndInput">Shift End Time</label>
                <input
                  id="shiftEndInput"
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="shiftStartDateInput">Shift Start Date</label>
                <input
                  id="shiftStartDateInput"
                  type="date"
                  value={shiftStartDate}
                  onChange={(e) => setShiftStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="formField">
                <label htmlFor="shiftEndDateInput">Shift End Date</label>
                <input
                  id="shiftEndDateInput"
                  type="date"
                  value={shiftEndDate}
                  onChange={(e) => setShiftEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="formField">
              <label htmlFor="scopeOfWorkInput">Scope of Work</label>
              <textarea
                id="scopeOfWorkInput"
                rows={3}
                placeholder="Enter detailed scope of work for this adhoc request..."
                value={scopeOfWork}
                onChange={(e) => setScopeOfWork(e.target.value)}
              />
            </div>

            <div className="formActions">
              <button
                type="button"
                className="cancelAdhocBtn"
                onClick={() => navigate("/roster")}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submitAdhocBtn"
                disabled={saving || !selectedContractId}
              >
                {saving ? "Adding..." : "Add Adhoc"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddAdhoc;
