import React, { useState, useEffect, useMemo } from "react";
import { fetchApiData, extractArrayData } from "../../../utils/apiClient";
import "./index.css";

function AccountsCustomerBilling() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("roster"); // "roster" | "adhoc"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchApiData("/api/BoardingCandidates");
      const allCandidates = extractArrayData(response.data);
      setCandidates(allCandidates);
    } catch (err) {
      console.error("Error loading candidates in Accounts Parent:", err);
    } finally {
      setLoading(false);
    }
  };

  // EXTRACT ALL ACCEPTED ROSTER SHIFT ASSIGNMENTS
  const acceptedRosterList = useMemo(() => {
    const list = [];
    candidates.forEach((candidate) => {
      const companyName = candidate.companyName || candidate.clientId || "N/A";

      (candidate.contractDeliverables || []).forEach((contract) => {
        const siteAddress = contract.siteAddress || contract.siteName || "N/A";
        const scopeOfWork = contract.scopeOfWork || "";

        (contract.services || []).forEach((service) => {
          (service.assignedEmployees || []).forEach((slot, slotIdx) => {
            const empName =
              slot.employee || (slotIdx === 0 ? service.employee : "");

            if (
              empName &&
              empName.trim() !== "" &&
              slot.approvalState === "Accepted"
            ) {
              list.push({
                id: `${candidate._id}_${contract._id}_${slotIdx}`,
                companyName,
                employeeName: empName.trim(),
                siteAddress,
                serviceType: service.serviceType || service.position || "Shift",
                position: service.position || "Staff",
                shiftStartTime: service.shiftStartTime || "08:00",
                shiftEndTime: service.shiftEndTime || "16:00",
                scopeOfWork,
                approvalState: slot.approvalState,
              });
            }
          });
        });
      });
    });
    return list;
  }, [candidates]);

  // EXTRACT ALL ACCEPTED ADHOC SERVICES
  const acceptedAdhocList = useMemo(() => {
    const list = [];
    candidates.forEach((candidate) => {
      const companyName = candidate.companyName || candidate.clientId || "N/A";

      (candidate.contractDeliverables || []).forEach((contract) => {
        const siteAddress = contract.siteAddress || contract.siteName || "N/A";

        (contract.adhocServices || []).forEach((adhoc, aIdx) => {
          const empName = adhoc.employee || "";

          if (
            empName &&
            empName.trim() !== "" &&
            adhoc.approvalState === "Accepted"
          ) {
            list.push({
              id: `adhoc_${candidate._id}_${contract._id}_${aIdx}`,
              companyName,
              employeeName: empName.trim(),
              siteAddress,
              serviceType: adhoc.serviceType || adhoc.adhocName || "Adhoc",
              position: adhoc.position || "Adhoc Staff",
              shiftStartTime: adhoc.shiftStartTime || "08:00",
              shiftEndTime: adhoc.shiftEndTime || "16:00",
              serviceDate: adhoc.serviceDate
                ? String(adhoc.serviceDate).slice(0, 10)
                : "N/A",
              approvalState: adhoc.approvalState,
            });
          }
        });
      });
    });
    return list;
  }, [candidates]);

  const filteredRoster = useMemo(() => {
    if (!searchQuery.trim()) return acceptedRosterList;
    const q = searchQuery.toLowerCase();
    return acceptedRosterList.filter(
      (item) =>
        item.companyName.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.siteAddress.toLowerCase().includes(q) ||
        item.serviceType.toLowerCase().includes(q),
    );
  }, [acceptedRosterList, searchQuery]);

  const filteredAdhoc = useMemo(() => {
    if (!searchQuery.trim()) return acceptedAdhocList;
    const q = searchQuery.toLowerCase();
    return acceptedAdhocList.filter(
      (item) =>
        item.companyName.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.siteAddress.toLowerCase().includes(q) ||
        item.serviceType.toLowerCase().includes(q),
    );
  }, [acceptedAdhocList, searchQuery]);

  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>💳 Customer Billing</h2>
          <p className="accountsSubtext">
            View accepted roster employee shifts and accepted adhoc services for customer billing.
          </p>
        </div>

        <div className="accountsSearchBox">
          <input
            type="text"
            placeholder="Search by Company, Employee, Site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="accountsSearchInput"
          />
        </div>
      </div>

      <div className="accountsTabButtons">
        <button
          className={`accountsTabBtn ${activeSubTab === "roster" ? "active" : ""}`}
          onClick={() => setActiveSubTab("roster")}
        >
          📋 Accepted Roster Shifts ({acceptedRosterList.length})
        </button>
        <button
          className={`accountsTabBtn ${activeSubTab === "adhoc" ? "active" : ""}`}
          onClick={() => setActiveSubTab("adhoc")}
        >
          ⚡ Accepted Adhoc Services ({acceptedAdhocList.length})
        </button>
      </div>

      {loading ? (
        <div className="accountsLoading">Loading Accepted Records...</div>
      ) : activeSubTab === "roster" ? (
        <div className="accountsTableWrapper">
          {filteredRoster.length === 0 ? (
            <div className="accountsEmpty">No Accepted Roster Shifts Found</div>
          ) : (
            <table className="accountsTable">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Employee Name</th>
                  <th>Site Address</th>
                  <th>Type of Service</th>
                  <th>Position</th>
                  <th>Shift Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((item) => (
                  <tr key={item.id}>
                    <td className="boldText">{item.companyName}</td>
                    <td className="empNameText">👤 {item.employeeName}</td>
                    <td>{item.siteAddress}</td>
                    <td>{item.serviceType}</td>
                    <td>{item.position}</td>
                    <td>
                      🕒 {item.shiftStartTime} - {item.shiftEndTime}
                    </td>
                    <td>
                      <span className="statusBadgeAccepted">✓ Accepted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="accountsTableWrapper">
          {filteredAdhoc.length === 0 ? (
            <div className="accountsEmpty">
              No Accepted Adhoc Services Found
            </div>
          ) : (
            <table className="accountsTable">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Employee Name</th>
                  <th>Site Address</th>
                  <th>Adhoc Service</th>
                  <th>Service Date</th>
                  <th>Shift Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdhoc.map((item) => (
                  <tr key={item.id}>
                    <td className="boldText">{item.companyName}</td>
                    <td className="empNameText">👤 {item.employeeName}</td>
                    <td>{item.siteAddress}</td>
                    <td>{item.serviceType}</td>
                    <td>📅 {item.serviceDate}</td>
                    <td>
                      🕒 {item.shiftStartTime} - {item.shiftEndTime}
                    </td>
                    <td>
                      <span className="statusBadgeAccepted">✓ Accepted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountsCustomerBilling;
