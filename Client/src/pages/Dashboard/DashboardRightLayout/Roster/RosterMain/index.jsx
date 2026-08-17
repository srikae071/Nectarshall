import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  fetchApiData,
  sendApiData,
  extractArrayData,
} from "../../../../../utils/apiClient";
import "./index.css";

function RosterMain() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [dbEmployees, setDbEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current calendar date anchor
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dropdown Selection States
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  // Search Toggle & Search Term States
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  const [showSiteSearch, setShowSiteSearch] = useState(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

  // Assign Employee Modal State
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    candidateId: "",
    contractId: "",
    serviceIndex: null,
    cardIndex: 1,
    slotIndex: 0,
    siteName: "",
    serviceType: "",
    position: "",
    shiftTime: "",
    currentEmployee: "",
  });
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isEditShift, setIsEditShift] = useState(false);
  const [editedSiteName, setEditedSiteName] = useState("");
  const [editedMealTime, setEditedMealTime] = useState("30 mins");

  // Assign Employee to Adhoc Modal State
  const [adhocAssignModal, setAdhocAssignModal] = useState({
    isOpen: false,
    candidateId: "",
    contractId: "",
    adhocIndex: null,
    siteName: "",
    serviceType: "",
    shiftStartTime: "08:00",
    shiftEndTime: "16:00",
    shiftTime: "",
    currentEmployee: "",
  });
  const [newAdhocEmployeeName, setNewAdhocEmployeeName] = useState("");
  const [savingAdhocAssign, setSavingAdhocAssign] = useState(false);
  const [saveAdhocSuccessMsg, setSaveAdhocSuccessMsg] = useState("");
  const [leaves, setLeaves] = useState([]);

  // 24 Hours for Employee Timeline View
  const hours = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
    }
    return arr;
  }, []);

  // Weekdays Sunday to Saturday
  const weekDays = useMemo(
    () => [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    [],
  );

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");

    try {
      const candRes = await fetchApiData("/api/BoardingCandidates");
      setCandidates(extractArrayData(candRes.data));
    } catch (e) {
      console.error("BoardingCandidates fetch error:", e);
    }

    try {
      const empRes = await fetchApiData("/api/employees");
      setDbEmployees(extractArrayData(empRes.data));
    } catch (e) {
      console.error("Employees fetch error:", e);
    }

    try {
      const leaveRes = await fetchApiData("/api/leaves");
      setLeaves(extractArrayData(leaveRes.data));
    } catch (e) {
      console.error("Leaves fetch error:", e);
    }

    setLoading(false);
  };

  const getEmployeeLeaveStatus = (empName, shiftDateObjStr) => {
    if (!empName || empName === "Click to Assign" || !shiftDateObjStr || !leaves.length) return null;
    const cleanEmp = empName.trim().toLowerCase();
    const targetDate = new Date(shiftDateObjStr);
    if (isNaN(targetDate.getTime())) return null;

    const matchedLeave = leaves.find((l) => {
      const requester = (l.requester || l.employeeName || "").trim().toLowerCase();
      if (!requester || (requester !== cleanEmp && !cleanEmp.includes(requester) && !cleanEmp.includes(requester))) {
        return false;
      }

      const sDate = new Date(l.startDate);
      const eDate = new Date(l.endDate);
      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return false;

      sDate.setHours(0, 0, 0, 0);
      eDate.setHours(23, 59, 59, 999);
      targetDate.setHours(12, 0, 0, 0);

      return targetDate >= sDate && targetDate <= eDate;
    });

    if (matchedLeave) {
      return {
        leaveType: matchedLeave.leaveType || "Leave",
        status: matchedLeave.status || "Approved",
        startDate: matchedLeave.startDate,
        endDate: matchedLeave.endDate,
      };
    }
    return null;
  };

  // Compute 7-day week starting on Sunday
  const weekDates = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const sunday = new Date(start);
    sunday.setDate(start.getDate() - day);
    sunday.setHours(0, 0, 0, 0);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  }, [currentDate]);

  // Calendar Header Text
  const calendarHeaderTitle = useMemo(() => {
    if (!weekDates.length) return "";
    const startMonth = weekDates[0].toLocaleDateString("en-US", {
      month: "long",
    });
    const endMonth = weekDates[6].toLocaleDateString("en-US", {
      month: "long",
    });
    const startYear = weekDates[0].getFullYear();
    const endYear = weekDates[6].getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startYear}`;
    } else if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear}`;
    }
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  }, [weekDates]);

  // Week navigation
  const handlePrevWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() - 7);
    setCurrentDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // All candidate records available for Roster view
  const approvedCandidates = useMemo(() => {
    return (candidates || []).filter((item) => {
      const s = String(item.status || item.approvalStatus || "").trim().toLowerCase();
      const isBoarded =
        s === "on boarded" ||
        s === "onboarded" ||
        s === "boarded" ||
        item.isBoarded === true;
      const isOpsApproved =
        item.operationsClientApproved === true ||
        item.oprationsClientApproved === true ||
        item.approved === true;
      return isBoarded && isOpsApproved;
    });
  }, [candidates]);

  // 1. Customer Options (sourced from all BoardingCandidates)
  const rawCustomerOptions = useMemo(() => {
    const names = approvedCandidates
      .map((item) => (item.companyName || item.clientId || item.clientName || item.customerName || "").trim())
      .filter((name) => name !== "");
    return [...new Set(names)].sort();
  }, [approvedCandidates]);

  const customerOptions = useMemo(() => {
    if (!customerSearchQuery.trim()) return rawCustomerOptions;
    const q = customerSearchQuery.trim().toLowerCase();
    return rawCustomerOptions.filter((item) =>
      item.toLowerCase().startsWith(q),
    );
  }, [rawCustomerOptions, customerSearchQuery]);

  // Helper to extract employee name (displayName preferred)
  const getEmpName = (emp) => {
    if (emp.displayName && emp.displayName.trim()) return emp.displayName.trim();
    if (emp.employeeName && emp.employeeName.trim()) return emp.employeeName.trim();
    const full = `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
    return full || "";
  };

  // 2. Employee Options (sourced ONLY from /api/employees table for Operations department)
  const rawEmployeeOptions = useMemo(() => {
    const employees = new Set();
    dbEmployees.forEach((emp) => {
      const dept = (emp.department || "").toLowerCase().trim();
      if (dept === "operations" || dept === "operation") {
        const name = getEmpName(emp);
        if (name) {
          employees.add(name);
        }
      }
    });
    return [...employees].sort();
  }, [dbEmployees]);

  const employeeOptions = useMemo(() => {
    if (!employeeSearchQuery.trim()) return rawEmployeeOptions;
    const q = employeeSearchQuery.trim().toLowerCase();
    return rawEmployeeOptions.filter((item) =>
      item.toLowerCase().startsWith(q),
    );
  }, [rawEmployeeOptions, employeeSearchQuery]);

  // 3. Selected Employee object (if exists in dbEmployees)
  const activeEmployeeObj = useMemo(() => {
    if (!selectedEmployee) return null;
    return (
      dbEmployees.find(
        (emp) =>
          getEmpName(emp).toLowerCase() ===
          selectedEmployee.trim().toLowerCase(),
      ) || null
    );
  }, [dbEmployees, selectedEmployee]);

  // 4. Site Options (sourced from selected employee locations OR selected customer deliverable sites)
  const rawSiteOptions = useMemo(() => {
    const sites = new Set();

    if (selectedEmployee && activeEmployeeObj) {
      // Sites come from employee's locations table
      const locs =
        activeEmployeeObj.locations && activeEmployeeObj.locations.length > 0
          ? activeEmployeeObj.locations
          : [{ place: activeEmployeeObj.place }];

      locs.forEach((loc) => {
        if (loc.place && loc.place.trim()) {
          sites.add(loc.place.trim());
        }
      });
    } else {
      // Sites come from BoardingCandidates contractDeliverables
      let filtered = approvedCandidates;
      if (selectedCustomer) {
        filtered = filtered.filter(
          (item) =>
            (item.companyName || "").trim().toLowerCase() ===
              selectedCustomer.trim().toLowerCase() ||
            (item.clientId || "").trim().toLowerCase() ===
              selectedCustomer.trim().toLowerCase() ||
            (item.clientName || "").trim().toLowerCase() ===
              selectedCustomer.trim().toLowerCase(),
        );
      }

      filtered.forEach((item) => {
        (item.contractDeliverables || []).forEach((contract) => {
          if (contract.siteName && contract.siteName.trim()) {
            sites.add(contract.siteName.trim());
          }
        });
      });
    }

    return [...sites].sort();
  }, [
    selectedEmployee,
    activeEmployeeObj,
    approvedCandidates,
    selectedCustomer,
  ]);

  const siteOptions = useMemo(() => {
    if (!siteSearchQuery.trim()) return rawSiteOptions;
    const q = siteSearchQuery.trim().toLowerCase();
    return rawSiteOptions.filter((item) => item.toLowerCase().startsWith(q));
  }, [rawSiteOptions, siteSearchQuery]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCustomer("");
    setSelectedLegalEntity("");
    setSelectedEmployee("");
    setSelectedSite("");
    setCustomerSearchQuery("");
    setEmployeeSearchQuery("");
    setSiteSearchQuery("");
    setShowCustomerSearch(false);
    setShowEmployeeSearch(false);
    setShowSiteSearch(false);
  };

  // Helper to parse "HH:MM" time strings to total minutes from midnight
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 8 * 60;
    const parts = String(timeStr).split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  };

  // Helper for timeline bar style
  const getShiftBarStyle = (startTimeStr, endTimeStr) => {
    const startMins = parseTimeToMinutes(startTimeStr || "08:00");
    const endMins = parseTimeToMinutes(endTimeStr || "20:00");

    let durationMins = endMins - startMins;
    if (durationMins <= 0) durationMins += 24 * 60;

    const leftPercent = (startMins / (24 * 60)) * 100;
    const widthPercent = (durationMins / (24 * 60)) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  // Filtered Candidate Records for Roster Calendar Display
  const displayRecords = useMemo(() => {
    return approvedCandidates.filter((item) => {
      const custName = (item.companyName || item.clientId || item.clientName || item.customerName || "").trim().toLowerCase();
      
      if (
        selectedCustomer &&
        custName !== selectedCustomer.trim().toLowerCase()
      ) {
        return false;
      }
      if (
        customerSearchQuery.trim() &&
        !custName.startsWith(customerSearchQuery.trim().toLowerCase())
      ) {
        return false;
      }

      if (selectedSite) {
        const hasSite = (item.contractDeliverables || []).some(
          (c) =>
            (c.siteName || "").trim().toLowerCase() ===
            selectedSite.trim().toLowerCase(),
        );
        if (!hasSite) return false;
      }

      return true;
    });
  }, [
    approvedCandidates,
    selectedCustomer,
    selectedEmployee,
    selectedSite,
    customerSearchQuery,
  ]);

  // Deliverable Site Rows (independent of employee filters)
  const deliverableRows = useMemo(() => {
    const rows = [];
    displayRecords.forEach((candidate) => {
      const deliverables = candidate.contractDeliverables || [];
      const companyName =
        candidate.companyName ||
        candidate.clientId ||
        candidate.clientName ||
        candidate.customerName ||
        "Client";

      if (deliverables.length === 0) {
        rows.push({
          candidateId: candidate._id,
          contractId: candidate._id,
          rowId: `${candidate._id}_default`,
          companyName,
          requester: candidate.requester || "Requester",
          siteName: candidate.siteName || candidate.siteAddress || "Default Site",
          siteAddress: candidate.siteAddress || "",
          scopeOfWork: candidate.scopeOfWork || "",
          services: candidate.services || [],
          adhocServices: candidate.adhocServices || [],
        });
      } else {
        deliverables.forEach((contract, cIdx) => {
          if (
            selectedSite &&
            (contract.siteName || "").trim().toLowerCase() !==
              selectedSite.trim().toLowerCase()
          ) {
            return;
          }

          rows.push({
            candidateId: candidate._id,
            contractId: contract._id,
            rowId: `${candidate._id}_${contract._id || cIdx}`,
            companyName,
            requester: candidate.requester || "Requester",
            siteName: contract.siteName || `Site ${cIdx + 1}`,
            siteAddress: contract.siteAddress || "",
            scopeOfWork: contract.scopeOfWork || "",
            services: contract.services || [],
            adhocServices: contract.adhocServices || [],
          });
        });
      }
    });
    return rows;
  }, [displayRecords, selectedSite]);

  const isToday = (d) => {
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const colorThemes = [
    "theme-green",
    "theme-blue",
    "theme-pink",
    "theme-orange",
    "theme-purple",
  ];

  const [scopeOfWorkText, setScopeOfWorkText] = useState("");

  const handleOpenAssignModal = (row, card, sIdx) => {
    const slotIdx = card.slotIndex ?? card.cardIndex - 1;
    const slotEmp =
      card.slotEmployee ||
      card.assignedEmployees?.[slotIdx]?.employee ||
      (slotIdx === 0 ? card.employee : "") ||
      "";

    const initialScopeOfWork =
      card.assignedEmployees?.[slotIdx]?.scopeOfWork ||
      card.scopeOfWork ||
      row.scopeOfWork ||
      "";

    setAssignModal({
      isOpen: true,
      candidateId: row.candidateId,
      contractId: row.contractId,
      serviceIndex: sIdx,
      cardIndex: card.cardIndex,
      slotIndex: slotIdx,
      siteName: row.siteName,
      serviceType: card.serviceType || card.position || "Shift",
      position: card.position || "N/A",
      shiftStartTime: card.shiftStartTime || "08:00",
      shiftEndTime: card.shiftEndTime || "16:00",
      shiftTime: `${card.shiftStartTime || "08:00"} - ${card.shiftEndTime || "16:00"}`,
      contractStartDate: card.contractStartDate
        ? String(card.contractStartDate).slice(0, 10)
        : "N/A",
      contractEndDate: card.contractEndDate
        ? String(card.contractEndDate).slice(0, 10)
        : "N/A",
      dayName: card.cellDayName || "N/A",
      dayTasksStr: card.cellDayTasksStr || "No specific tasks",
      rawWorkingDays: card.workingDays || [],
      workingDays: card.workingDays
        ? Array.isArray(card.workingDays)
          ? card.workingDays
              .map((d) =>
                typeof d === "string"
                  ? d
                  : `${d?.day || ""}${
                      d?.tasks && d.tasks.length > 0
                        ? ` (${d.tasks.join(", ")})`
                        : ""
                    }`,
              )
              .filter(Boolean)
              .join(", ")
          : String(card.workingDays)
        : "All Days",
      currentEmployee: slotEmp || row.requester || "",
    });
    const initialMealTime =
      card.assignedEmployees?.[slotIdx]?.mealTime ||
      card.mealTime ||
      "30 mins";

    setEditedSiteName(row.siteName || "");
    setEditedMealTime(initialMealTime);
    setIsEditShift(false);

    setNewEmployeeName(slotEmp || row.requester || "");
    setScopeOfWorkText(initialScopeOfWork);
    setSaveSuccessMsg("");
  };

  const handleCloseModal = () => {
    setAssignModal((prev) => ({ ...prev, isOpen: false }));
    setSaveSuccessMsg("");
  };

  const handleSaveAssignEmployee = async () => {
    if (!newEmployeeName.trim()) return;

    try {
      setSavingAssign(true);
      setSaveSuccessMsg("");

      const candidate = candidates.find(
        (c) => c._id === assignModal.candidateId,
      );
      if (!candidate) throw new Error("Boarding Candidate record not found");

      const contract = (candidate.contractDeliverables || []).find(
        (c) => c._id === assignModal.contractId,
      );
      if (!contract) throw new Error("Contract Deliverable not found");

      const updatedServices = JSON.parse(
        JSON.stringify(contract.services || []),
      );
      if (updatedServices[assignModal.serviceIndex]) {
        const targetService = updatedServices[assignModal.serviceIndex];
        const slotIdx = assignModal.slotIndex ?? assignModal.cardIndex - 1;
        const qty = Math.max(1, Number(targetService.quantity) || 1);

        let existingAssigned = targetService.assignedEmployees || [];
        while (existingAssigned.length < qty) {
          existingAssigned.push({
            employee: "",
            isYellow: false,
            isUpdated: false,
          });
        }

        existingAssigned[slotIdx] = {
          ...existingAssigned[slotIdx],
          employee: newEmployeeName.trim(),
          isYellow: true,
          isUpdated: true,
          approvalState: "Pending",
          scopeOfWork: scopeOfWorkText,
          mealTime: editedMealTime,
        };

        targetService.assignedEmployees = existingAssigned;
        targetService.mealTime = editedMealTime;

        if (slotIdx === 0) {
          targetService.employee = newEmployeeName.trim();
        }
      }

      await sendApiData(
        `/api/BoardingCandidates/${assignModal.candidateId}/contracts/${assignModal.contractId}/services`,
        {
          services: updatedServices,
          adhocServices: contract.adhocServices || [],
          scopeOfWork: scopeOfWorkText,
          siteName: editedSiteName,
        },
        "put",
      );

      setSaveSuccessMsg("Employee assigned successfully!");
      await fetchAllData();

      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err) {
      console.error("Error saving assigned employee:", err);
      alert(`Failed to save employee assignment: ${err.message}`);
    } finally {
      setSavingAssign(false);
    }
  };

  const handleOpenAdhocAssignModal = (row, adhoc, aIdx) => {
    setAdhocAssignModal({
      isOpen: true,
      candidateId: row.candidateId,
      contractId: row.contractId,
      adhocIndex: aIdx,
      siteName: row.siteName,
      serviceType: adhoc.serviceType || adhoc.adhocName || "Adhoc",
      shiftStartTime: adhoc.shiftStartTime || "08:00",
      shiftEndTime: adhoc.shiftEndTime || "16:00",
      shiftTime: `${adhoc.shiftStartTime || "08:00"} - ${adhoc.shiftEndTime || "16:00"}`,
      currentEmployee: adhoc.employee || "",
    });
    setNewAdhocEmployeeName(adhoc.employee || "");
    setSaveAdhocSuccessMsg("");
  };

  const handleCloseAdhocModal = () => {
    setAdhocAssignModal((prev) => ({ ...prev, isOpen: false }));
    setSaveAdhocSuccessMsg("");
  };

  const handleSaveAssignAdhoc = async () => {
    if (!newAdhocEmployeeName.trim()) return;

    try {
      setSavingAdhocAssign(true);
      setSaveAdhocSuccessMsg("");

      const candidate = candidates.find(
        (c) => c._id === adhocAssignModal.candidateId,
      );
      if (!candidate) throw new Error("Boarding Candidate record not found");

      const contract = (candidate.contractDeliverables || []).find(
        (c) => c._id === adhocAssignModal.contractId,
      );
      if (!contract) throw new Error("Contract Deliverable not found");

      const updatedAdhocServices = JSON.parse(
        JSON.stringify(contract.adhocServices || []),
      );

      if (updatedAdhocServices[adhocAssignModal.adhocIndex]) {
        updatedAdhocServices[adhocAssignModal.adhocIndex].employee =
          newAdhocEmployeeName.trim();
        updatedAdhocServices[adhocAssignModal.adhocIndex].approvalState =
          "Pending";
        updatedAdhocServices[adhocAssignModal.adhocIndex].isYellow = true;
      }

      await sendApiData(
        `/api/BoardingCandidates/${adhocAssignModal.candidateId}/contracts/${adhocAssignModal.contractId}/services`,
        {
          services: contract.services || [],
          adhocServices: updatedAdhocServices,
        },
        "put",
      );

      setSaveAdhocSuccessMsg("Adhoc Employee assigned successfully!");
      await fetchAllData();

      setTimeout(() => {
        handleCloseAdhocModal();
      }, 1000);
    } catch (err) {
      console.error("Error saving assigned adhoc employee:", err);
      alert(`Failed to save adhoc employee assignment: ${err.message}`);
    } finally {
      setSavingAdhocAssign(false);
    }
  };

  // Locations array for selected employee (up to 3 locations)
  const selectedEmployeeLocations = useMemo(() => {
    if (!activeEmployeeObj) return [];
    if (activeEmployeeObj.locations && activeEmployeeObj.locations.length > 0) {
      return activeEmployeeObj.locations.filter((l) => {
        if (!selectedSite) return true;
        return (
          (l.place || "").trim().toLowerCase() ===
          selectedSite.trim().toLowerCase()
        );
      });
    }
    return [
      {
        place: activeEmployeeObj.place || "Default Location",
        shiftStartTime: activeEmployeeObj.shiftStartTime || "08:00",
        shiftEndTime: activeEmployeeObj.shiftEndTime || "20:00",
      },
    ];
  }, [activeEmployeeObj, selectedSite]);

  return (
    <div className="rosterMainWrapper">
      {/* 20% HEIGHT: TOP FILTER TABS SECTION */}
      <div className="rosterTopSection">
        <div className="rosterHeaderRow">
          <div className="rosterTitleBlock">
            <h2>Roster Management</h2>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {/* <button
              type="button"
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "12.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => navigate("/roster-shifts")}
            >
              ppp ➔
            </button> */}

            {(selectedCustomer ||
              selectedLegalEntity ||
              selectedEmployee ||
              selectedSite ||
              customerSearchQuery ||
              employeeSearchQuery ||
              siteSearchQuery) && (
              <button className="resetFilterBtn" onClick={handleResetFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 4 FILTER TABS GRID */}
        <div className="rosterTabsGrid">
          {/* TAB 1: CUSTOMER NAME */}
          <div className="rosterTabCard">
            <div className="tabHeader">
              <span className="tabIcon">🏢</span>
              <label htmlFor="customerSelect">Customer Name</label>
              <button
                type="button"
                className={`searchToggleBtn ${showCustomerSearch ? "active" : ""}`}
                title="Search Customer"
                onClick={() => setShowCustomerSearch(!showCustomerSearch)}
              >
                🔍
              </button>
            </div>

            {showCustomerSearch && (
              <div className="tabSearchContainer">
                <div className="tabSearchBox">
                  <input
                    type="text"
                    placeholder="Type starting letter (e.g. N)..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="tabSearchInput"
                    autoFocus
                  />
                  {customerSearchQuery && (
                    <button
                      className="clearSearchBtn"
                      onClick={() => setCustomerSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {customerSearchQuery.trim() && (
                  <div className="searchResultsDropdown">
                    {customerOptions.length === 0 ? (
                      <div className="noResultItem">
                        No customers starting with "{customerSearchQuery}"
                      </div>
                    ) : (
                      customerOptions.map((customer, idx) => (
                        <div
                          key={idx}
                          className="searchResultItem"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setSelectedEmployee("");
                            setSelectedSite("");
                            setCustomerSearchQuery("");
                            setShowCustomerSearch(false);
                          }}
                        >
                          {customer}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <select
              id="customerSelect"
              className="rosterSelect"
              value={selectedCustomer}
              onChange={(e) => {
                setSelectedCustomer(e.target.value);
                setSelectedEmployee("");
                setSelectedSite("");
              }}
              disabled={loading}
            >
              <option value="">Select Customer</option>
              {customerOptions.map((customer, index) => (
                <option key={index} value={customer}>
                  {customer}
                </option>
              ))}
            </select>
          </div>

          {/* TAB 2: LEGAL ENTITY */}
          <div className="rosterTabCard">
            <div className="tabHeader">
              <span className="tabIcon">⚖️</span>
              <label htmlFor="legalEntitySelect">Legal Entity</label>
            </div>
            <select
              id="legalEntitySelect"
              className="rosterSelect"
              value={selectedLegalEntity}
              onChange={(e) => setSelectedLegalEntity(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Legal Entity</option>
              <option value="Entity Alpha">Legal Entity - 01</option>
              <option value="Entity Beta">Legal Entity - 02</option>
            </select>
          </div>

          {/* TAB 3: EMPLOYEE NAME */}
          <div className="rosterTabCard">
            <div className="tabHeader">
              <span className="tabIcon">👤</span>
              <label htmlFor="employeeSelect">Employee Name</label>
              <button
                type="button"
                className={`searchToggleBtn ${showEmployeeSearch ? "active" : ""}`}
                title="Search Employee"
                onClick={() => setShowEmployeeSearch(!showEmployeeSearch)}
              >
                🔍
              </button>
            </div>

            {showEmployeeSearch && (
              <div className="tabSearchContainer">
                <div className="tabSearchBox">
                  <input
                    type="text"
                    placeholder="Type starting letter..."
                    value={employeeSearchQuery}
                    onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                    className="tabSearchInput"
                    autoFocus
                  />
                  {employeeSearchQuery && (
                    <button
                      className="clearSearchBtn"
                      onClick={() => setEmployeeSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {employeeSearchQuery.trim() && (
                  <div className="searchResultsDropdown">
                    {employeeOptions.length === 0 ? (
                      <div className="noResultItem">
                        No employees starting with "{employeeSearchQuery}"
                      </div>
                    ) : (
                      employeeOptions.map((employee, idx) => (
                        <div
                          key={idx}
                          className="searchResultItem"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setSelectedSite("");
                            setEmployeeSearchQuery("");
                            setShowEmployeeSearch(false);
                          }}
                        >
                          {employee}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <select
              id="employeeSelect"
              className="rosterSelect"
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setSelectedSite("");
              }}
              disabled={loading}
            >
              <option value="">Select Employee</option>
              {employeeOptions.map((employee, index) => (
                <option key={index} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          {/* TAB 4: SITE NAME */}
          <div className="rosterTabCard">
            <div className="tabHeader">
              <span className="tabIcon">📍</span>
              <label htmlFor="siteSelect">Site Name</label>
              <button
                type="button"
                className={`searchToggleBtn ${showSiteSearch ? "active" : ""}`}
                title="Search Site"
                onClick={() => setShowSiteSearch(!showSiteSearch)}
              >
                🔍
              </button>
            </div>

            {showSiteSearch && (
              <div className="tabSearchContainer">
                <div className="tabSearchBox">
                  <input
                    type="text"
                    placeholder="Type starting letter..."
                    value={siteSearchQuery}
                    onChange={(e) => setSiteSearchQuery(e.target.value)}
                    className="tabSearchInput"
                    autoFocus
                  />
                  {siteSearchQuery && (
                    <button
                      className="clearSearchBtn"
                      onClick={() => setSiteSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {siteSearchQuery.trim() && (
                  <div className="searchResultsDropdown">
                    {siteOptions.length === 0 ? (
                      <div className="noResultItem">
                        No sites starting with "{siteSearchQuery}"
                      </div>
                    ) : (
                      siteOptions.map((site, idx) => (
                        <div
                          key={idx}
                          className="searchResultItem"
                          onClick={() => {
                            setSelectedSite(site);
                            setSiteSearchQuery("");
                            setShowSiteSearch(false);
                          }}
                        >
                          {site}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <select
              id="siteSelect"
              className="rosterSelect"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Site</option>
              {siteOptions.map((site, index) => (
                <option key={index} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 70% HEIGHT: CALENDAR VIEW / SELECTED EMPLOYEE TIMELINE VIEW */}
      <div className="rosterBottomSection">
        {loading ? (
          <div className="rosterLoadingState">
            <div className="spinner"></div>
            <span>Loading roster calendar...</span>
          </div>
        ) : error ? (
          <div className="rosterErrorState">{error}</div>
        ) : (
          <div className="calendarViewContainer">
            {/* SERVICENOW TOOLBAR */}
            <div className="calendarToolbar">
              <div className="toolbarLeft">
                <button className="todayBtn" onClick={handleToday}>
                  Today
                </button>
                <div className="navArrowGroup">
                  <button
                    className="navArrowBtn"
                    onClick={handlePrevWeek}
                    title="Previous Week"
                  >
                    ‹
                  </button>
                  <button
                    className="navArrowBtn"
                    onClick={handleNextWeek}
                    title="Next Week"
                  >
                    ›
                  </button>
                </div>
                <span className="calendarTitleText">{calendarHeaderTitle}</span>
              </div>
            </div>

            {/* CASE 1: IF AN EMPLOYEE IS SELECTED: DISPLAY ONLY EMPLOYEE SHIFT TIMELINE SCHEDULE (LOCATIONS 1, 2, 3) */}
            {selectedEmployee ? (
              <div className="selectedEmployeeTimelineBox">
                <div className="empTimelineHeader">
                  <h3>Employee Shift Timeline Schedule: {selectedEmployee}</h3>
                </div>

                {selectedEmployeeLocations.length === 0 ? (
                  <div className="emptyStateCalendar">
                    No location records for {selectedEmployee}.
                  </div>
                ) : (
                  selectedEmployeeLocations.map((loc, lIdx) => (
                    <div key={lIdx} className="employeeTimelineRow">
                      <div className="agentInfoCol">
                        <div className="agentName">{selectedEmployee}</div>
                        <div className="agentLocation">
                          📍 {loc.place || `Location ${lIdx + 1}`}
                        </div>
                      </div>

                      <div className="timelineBarCol">
                        <div className="hoursBackgroundGrid">
                          {hours.map((hStr, hIdx) => (
                            <div key={hIdx} className="gridHourCell">
                              <span className="hourLabel">{hStr}</span>
                            </div>
                          ))}
                        </div>

                        <div
                          className="shiftBlockBar"
                          style={getShiftBarStyle(
                            loc.shiftStartTime,
                            loc.shiftEndTime,
                          )}
                        >
                          <div className="shiftBlockTitle">
                            Shift: {loc.shiftStartTime || "08:00"} -{" "}
                            {loc.shiftEndTime || "20:00"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : !selectedCustomer && !selectedSite ? (
              /* CASE 2: EMPTY STATE WHEN NOTHING SELECTED */
              <div className="emptyStateCalendar">
                Please select a Customer, Employee, or Site from the filters
                above to view schedule details.
              </div>
            ) : (
              /* CASE 3: DELIVERABLE SITE ROWS WHEN CUSTOMER OR SITE SELECTED */
              <>
                <div className="calendarWeekHeader">
                  {weekDates.map((date, idx) => {
                    const dayName = weekDays[idx];
                    const dayNum = date.getDate();
                    const monthShort = date.toLocaleDateString("en-US", {
                      month: "short",
                    });

                    return (
                      <div
                        key={idx}
                        className={`weekHeaderCell ${isToday(date) ? "isToday" : ""}`}
                      >
                        <div className="dayNameTxt">{dayName}</div>
                        <div
                          className={`dayNumBadge ${isToday(date) ? "todayCircle" : ""}`}
                        >
                          {monthShort} {dayNum}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {deliverableRows.length === 0 ? (
                  <div className="emptyStateCalendar">
                    No contract deliverables or sites match the selected
                    filters.
                  </div>
                ) : (
                  deliverableRows.map((row) => (
                    <div className="siteCalendarRow" key={row.rowId}>
                      <div className="siteBannerHeader">
                        <span className="siteBannerTitle">
                          📍 {row.siteName}{" "}
                          {row.siteAddress ? `(${row.siteAddress})` : ""}
                        </span>
                        <span className="siteBannerMeta">
                          Customer: <strong>{row.companyName}</strong> |
                          Requester: <strong>{row.requester}</strong>
                        </span>
                      </div>

                      <div className="siteDaysGrid">
                        {weekDates.map((date, dayIdx) => {
                          const currentDayName = weekDays[dayIdx];

                          const matchingServices = row.services.filter(
                            (svc) => {
                              const workingDays = svc.workingDays || [];
                              if (
                                Array.isArray(workingDays) &&
                                workingDays.length > 0
                              ) {
                                const isMatch = workingDays.some((d) =>
                                  typeof d === "string"
                                    ? d === currentDayName
                                    : d?.day === currentDayName,
                                );
                                if (!isMatch) return false;
                              }
                              if (svc.contractStartDate) {
                                const start = new Date(svc.contractStartDate);
                                start.setHours(0, 0, 0, 0);
                                if (date < start) return false;
                              }
                              if (svc.contractEndDate) {
                                const end = new Date(svc.contractEndDate);
                                end.setHours(23, 59, 59, 999);
                                if (date > end) return false;
                              }
                              return true;
                            },
                          );

                          const cellDayName = date.toLocaleDateString("en-US", {
                            weekday: "long",
                          });

                          const expandedCards = [];
                          matchingServices.forEach((svc, sIdx) => {
                            const dayObj = (svc.workingDays || []).find((d) => {
                              if (typeof d === "string")
                                return d === cellDayName;
                              if (typeof d === "object" && d !== null)
                                return d.day === cellDayName;
                              return false;
                            });

                            const cellDayTasks =
                              typeof dayObj === "object" &&
                              dayObj !== null &&
                              Array.isArray(dayObj.tasks)
                                ? dayObj.tasks
                                : [];

                            const cellDayTasksStr =
                              cellDayTasks.length > 0
                                ? cellDayTasks.join(", ")
                                : "";

                            const qty = Math.max(1, Number(svc.quantity) || 1);
                            for (let q = 0; q < qty; q++) {
                              const slotEmpObj = svc.assignedEmployees?.[q];
                              const slotEmployee =
                                slotEmpObj?.employee ||
                                (q === 0 ? svc.employee || "" : "");
                              const approvalState =
                                slotEmpObj?.approvalState || "";

                              let themeClass = "theme-gray";
                              if (slotEmployee && slotEmployee.trim()) {
                                if (approvalState === "Accepted") {
                                  themeClass = "theme-green";
                                } else if (approvalState === "Rejected") {
                                  themeClass = "theme-red";
                                } else {
                                  themeClass = "theme-yellow";
                                }
                              }

                              expandedCards.push({
                                ...svc,
                                serviceIndex: sIdx,
                                cardIndex: q + 1,
                                slotIndex: q,
                                totalQty: qty,
                                slotEmployee: slotEmployee,
                                approvalState: approvalState,
                                themeClass: themeClass,
                                cellDayName: cellDayName,
                                cellDayTasks: cellDayTasks,
                                cellDayTasksStr: cellDayTasksStr,
                              });
                            }
                          });

                          const matchingAdhoc = (
                            row.adhocServices || []
                          ).filter((adhoc) => {
                            if (!adhoc.serviceDate) return true;
                            const adhocD = new Date(adhoc.serviceDate);
                            return (
                              adhocD.getDate() === date.getDate() &&
                              adhocD.getMonth() === date.getMonth() &&
                              adhocD.getFullYear() === date.getFullYear()
                            );
                          });

                          return (
                            <div
                              key={dayIdx}
                              className={`calendarDayCell ${isToday(date) ? "todayCell" : ""}`}
                            >
                              {expandedCards.length === 0 &&
                              matchingAdhoc.length === 0 ? (
                                <div className="emptyDayCell">-</div>
                              ) : (
                                <>
                                  {expandedCards.map((card, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className={`shiftCard ${card.themeClass}`}
                                      title="Click to assign employee"
                                      onClick={() =>
                                        handleOpenAssignModal(
                                          row,
                                          card,
                                          card.serviceIndex,
                                        )
                                      }
                                    >
                                      <div className="shiftHeader">
                                        <span className="shiftType">
                                          {card.serviceType ||
                                            card.position ||
                                            "Shift"}
                                        </span>
                                        {card.totalQty > 1 && (
                                          <span className="qtyBadge">
                                            #{card.cardIndex}
                                          </span>
                                        )}
                                      </div>

                                      <div className="shiftTime">
                                        🕒 {card.shiftStartTime || "08:00"} -{" "}
                                        {card.shiftEndTime || "16:00"}
                                      </div>

                                      {card.cellDayTasksStr && (
                                        <div
                                          className="shiftTasks"
                                          title={`Tasks: ${card.cellDayTasksStr}`}
                                        >
                                          📋 Tasks: {card.cellDayTasksStr}
                                        </div>
                                      )}

                                      <div className="shiftEmployee">
                                        👤{" "}
                                        {card.slotEmployee || "Click to Assign"}
                                      </div>
                                      {card.slotEmployee &&
                                        getEmployeeLeaveStatus(
                                          card.slotEmployee,
                                          date,
                                        ) && (
                                          <div
                                            style={{
                                              fontSize: "11px",
                                              fontWeight: "700",
                                              color: "#dc2626",
                                              background: "#fee2e2",
                                              padding: "2px 6px",
                                              borderRadius: "4px",
                                              marginTop: "4px",
                                              border: "1px solid #fca5a5",
                                            }}
                                          >
                                            ⚠️ On Leave (
                                            {
                                              getEmployeeLeaveStatus(
                                                card.slotEmployee,
                                                date,
                                              ).leaveType
                                            }
                                            )
                                          </div>
                                        )}
                                    </div>
                                  ))}

                                  {matchingAdhoc.map((adhoc, aIdx) => {
                                    let adhocThemeClass = "theme-adhoc-silver";
                                    const hasEmp =
                                      adhoc.employee &&
                                      adhoc.employee.trim() !== "";
                                    if (hasEmp) {
                                      if (adhoc.approvalState === "Accepted") {
                                        adhocThemeClass = "theme-adhoc-green";
                                      } else if (
                                        adhoc.approvalState === "Rejected"
                                      ) {
                                        adhocThemeClass = "theme-adhoc-red";
                                      } else {
                                        adhocThemeClass = "theme-adhoc-yellow";
                                      }
                                    }

                                    return (
                                      <div
                                        key={`adhoc_${aIdx}`}
                                        className={`shiftCard ${adhocThemeClass}`}
                                        title="Click to assign employee to adhoc"
                                        onClick={() =>
                                          handleOpenAdhocAssignModal(
                                            row,
                                            adhoc,
                                            aIdx,
                                          )
                                        }
                                      >
                                        <div className="shiftHeader">
                                          <span className="shiftType">
                                            {hasEmp
                                              ? adhoc.employee
                                              : adhoc.serviceType || "Adhoc"}
                                          </span>
                                          <span
                                            className="qtyBadge"
                                            style={{
                                              color: "inherit",
                                              opacity: 0.9,
                                            }}
                                          >
                                            ADHOC
                                          </span>
                                        </div>

                                        <div className="shiftTime">
                                          🕒 {adhoc.shiftStartTime || "08:00"} -{" "}
                                          {adhoc.shiftEndTime || "16:00"}
                                        </div>

                                        <div className="shiftEmployee">
                                          👤{" "}
                                          {hasEmp
                                            ? adhoc.employee
                                            : "Click to Assign"}
                                        </div>
                                        {hasEmp &&
                                          getEmployeeLeaveStatus(
                                            adhoc.employee,
                                            date,
                                          ) && (
                                            <div
                                              style={{
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                color: "#dc2626",
                                                background: "#fee2e2",
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                marginTop: "4px",
                                                border: "1px solid #fca5a5",
                                              }}
                                            >
                                              ⚠️ On Leave (
                                              {
                                                getEmployeeLeaveStatus(
                                                  adhoc.employee,
                                                  date,
                                                ).leaveType
                                              }
                                              )
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ASSIGN EMPLOYEE MODAL POPUP */}
      {assignModal.isOpen && (
        <div className="assignModalOverlay">
          <div className="assignModalContainer">
            <div className="assignModalHeader">
              <h3>Assign Employee to Shift</h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  className={`editShiftToggleBtn ${isEditShift ? "active" : ""}`}
                  onClick={() => setIsEditShift(!isEditShift)}
                  title="Click to edit site name & meal time"
                >
                  {isEditShift ? "✓ Editing Mode" : "✏️ Edit"}
                </button>
                <button className="closeModalBtn" onClick={handleCloseModal}>
                  ✕
                </button>
              </div>
            </div>

            <div className="assignModalBody">
              <div className="shiftInfoBox">
                {isEditShift ? (
                  <div className="editFieldRow">
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                      Site Name:
                    </label>
                    <input
                      type="text"
                      className="assignInput"
                      style={{ fontSize: "13.5px", padding: "7px 10px", width: "100%", marginBottom: "10px" }}
                      value={editedSiteName}
                      onChange={(e) => setEditedSiteName(e.target.value)}
                      placeholder="Enter Site Name"
                    />
                  </div>
                ) : (
                  <p>
                    <strong>Site Name:</strong> {editedSiteName || assignModal.siteName}
                  </p>
                )}

                <p>
                  <strong>Type of Service:</strong> {assignModal.serviceType}
                </p>
                <p>
                  <strong>Position:</strong> {assignModal.position}
                </p>
                <p>
                  <strong>Shift Start Time:</strong>{" "}
                  {assignModal.shiftStartTime}
                </p>
                <p>
                  <strong>Shift End Time:</strong> {assignModal.shiftEndTime}
                </p>

                {isEditShift ? (
                  <div className="editFieldRow">
                    <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                      Meal Time:
                    </label>
                    <input
                      type="text"
                      className="assignInput"
                      style={{ fontSize: "13.5px", padding: "7px 10px", width: "100%", marginBottom: "10px" }}
                      value={editedMealTime}
                      onChange={(e) => setEditedMealTime(e.target.value)}
                      placeholder="e.g. 30 mins, 1 hour, or 12:30"
                    />
                  </div>
                ) : (
                  <p>
                    <strong>Meal Time:</strong> {editedMealTime || "30 mins"}
                  </p>
                )}

                <p>
                  <strong>Contract Start Date:</strong>{" "}
                  {assignModal.contractStartDate}
                </p>
                <p>
                  <strong>Contract End Date:</strong>{" "}
                  {assignModal.contractEndDate}
                </p>
                <p>
                  <strong>Day:</strong> {assignModal.dayName}
                </p>
                <p>
                  <strong>Tasks for {assignModal.dayName}:</strong>{" "}
                  <span
                    style={{
                      color: "#047857",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  >
                    {assignModal.dayTasksStr}
                  </span>
                </p>
                <p>
                  <strong>All Working Days & Tasks:</strong>{" "}
                  {assignModal.workingDays || "All Days"}
                </p>
              </div>

              {/* SCOPE OF WORK FIELD BELOW ALL WORKING DAYS & TASKS */}
              <div className="formGroup" style={{ marginTop: "10px" }}>
                <label htmlFor="scopeOfWorkInput" className="bigScopeLabel">
                  Scope Of Work
                </label>
                <textarea
                  id="scopeOfWorkInput"
                  className="bigScopeTextarea"
                  value={scopeOfWorkText}
                  onChange={(e) => setScopeOfWorkText(e.target.value)}
                  placeholder="Enter scope of work details..."
                  rows={4}
                />
              </div>

              {saveSuccessMsg && (
                <div className="saveSuccessAlert">{saveSuccessMsg}</div>
              )}

              <div className="formGroup">
                <label htmlFor="assignEmployeeInput" className="bigScopeLabel">
                  Assign To
                </label>
                <select
                  id="assignEmployeeInput"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="assignInput"
                  style={{ fontSize: "14px", padding: "10px 12px", width: "100%", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  autoFocus
                >
                  <option value="">-- Select Employee (Operations Dept) --</option>
                  {rawEmployeeOptions.map((emp, i) => (
                    <option key={i} value={emp}>
                      👤 {emp}
                    </option>
                  ))}
                </select>

                {newEmployeeName.trim() &&
                  getEmployeeLeaveStatus(
                    newEmployeeName,
                    assignModal.contractStartDate,
                  ) && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "#fee2e2",
                        border: "1.5px solid #fca5a5",
                        color: "#991b1b",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      ⚠️ Notice: {newEmployeeName} has an approved leave request on
                      this date (
                      {
                        getEmployeeLeaveStatus(
                          newEmployeeName,
                          assignModal.contractStartDate,
                        ).leaveType
                      }
                      )
                    </div>
                  )}
              </div>
            </div>

            <div className="assignModalFooter">
              <button
                type="button"
                className="cancelBtn"
                onClick={handleCloseModal}
                disabled={savingAssign}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saveAssignBtn"
                onClick={handleSaveAssignEmployee}
                disabled={savingAssign || !newEmployeeName.trim()}
              >
                {savingAssign ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADHOC ASSIGN EMPLOYEE MODAL POPUP */}
      {adhocAssignModal.isOpen && (
        <div className="assignModalOverlay">
          <div className="assignModalContainer">
            <div className="assignModalHeader">
              <h3>Assign Employee to Adhoc Shift</h3>
              <button className="closeModalBtn" onClick={handleCloseAdhocModal}>
                ✕
              </button>
            </div>

            <div className="assignModalBody">
              <div className="shiftInfoBox">
                <p>
                  <strong>Site Name:</strong> {adhocAssignModal.siteName}
                </p>
                <p>
                  <strong>Type of Service:</strong>{" "}
                  {adhocAssignModal.serviceType}
                </p>
                <p>
                  <strong>Shift Start Time:</strong>{" "}
                  {adhocAssignModal.shiftStartTime}
                </p>
                <p>
                  <strong>Shift End Time:</strong>{" "}
                  {adhocAssignModal.shiftEndTime}
                </p>
              </div>

              {saveAdhocSuccessMsg && (
                <div className="saveSuccessAlert">{saveAdhocSuccessMsg}</div>
              )}

              <div className="formGroup">
                <label htmlFor="assignAdhocEmployeeInput">Assign To:</label>
                <select
                  id="assignAdhocEmployeeInput"
                  value={newAdhocEmployeeName}
                  onChange={(e) => setNewAdhocEmployeeName(e.target.value)}
                  className="assignInput"
                  style={{ fontSize: "14px", padding: "10px 12px", width: "100%", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  autoFocus
                >
                  <option value="">-- Select Employee (Operations Dept) --</option>
                  {rawEmployeeOptions.map((emp, i) => (
                    <option key={i} value={emp}>
                      👤 {emp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="assignModalFooter">
              <button
                type="button"
                className="cancelBtn"
                onClick={handleCloseAdhocModal}
                disabled={savingAdhocAssign}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saveAssignBtn"
                onClick={handleSaveAssignAdhoc}
                disabled={savingAdhocAssign || !newAdhocEmployeeName.trim()}
              >
                {savingAdhocAssign ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RosterMain;
