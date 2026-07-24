import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./index.css";

function RosterMain() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbEmployees, setDbEmployees] = useState([]);
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
    siteName: "",
    serviceType: "",
    position: "",
    shiftTime: "",
    currentEmployee: "",
  });
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
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
    // line to check
    // fetchBoardingCandidates();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");
      let candRes;
      try {
        candRes = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates",
        );
      } catch (err) {
        candRes = await axios.get("/api/BoardingCandidates");
      }
      setCandidates(Array.isArray(candRes.data) ? candRes.data : []);
      // Fetch Employees from DB
      let empRes;
      try {
        empRes = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/employees",
        );
      } catch (err) {
        empRes = await axios.get("/api/employees");
      }
      setDbEmployees(Array.isArray(empRes.data) ? empRes.data : []);
    } catch (err) {
      console.error("Error loading roster data:", err);
      setError("Failed to load customer and employee data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBoardingCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      try {
        response = await axios.get(
          "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates",
        );
      } catch (err) {
        response = await axios.get("/api/BoardingCandidates");
      }

      const data = Array.isArray(response.data) ? response.data : [];
      setCandidates(data);
    } catch (err) {
      console.error("Error loading boarding candidates for roster:", err);
      setError("Failed to load customer and employee data.");
    } finally {
      setLoading(false);
    }
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

  // 1. Customer Options
  const rawCustomerOptions = useMemo(() => {
    const names = candidates
      .map((item) => (item.companyName || item.clientId || "").trim())
      .filter((name) => name !== "");
    return [...new Set(names)].sort();
  }, [candidates]);

  const customerOptions = useMemo(() => {
    if (!customerSearchQuery.trim()) return rawCustomerOptions;
    const q = customerSearchQuery.trim().toLowerCase();
    return rawCustomerOptions.filter((item) => item.toLowerCase().includes(q));
  }, [rawCustomerOptions, customerSearchQuery]);

  // 2. Employee Options
  const rawEmployeeOptions = useMemo(() => {
    // let filtered = candidates;
    const employees = new Set();
    // From /api/employees DB model
    dbEmployees.forEach((emp) => {
      if (emp.employeeName && emp.employeeName.trim()) {
        employees.add(emp.employeeName.trim());
      }
    });
    // From Boarding Candidates
    let filtered = candidates;
    if (selectedCustomer) {
      filtered = filtered.filter(
        (item) =>
          (item.companyName || "").trim().toLowerCase() ===
            selectedCustomer.trim().toLowerCase() ||
          (item.clientId || "").trim().toLowerCase() ===
            selectedCustomer.trim().toLowerCase(),
      );
    }

    // const employees = new Set();

    filtered.forEach((item) => {
      if (item.requester && item.requester.trim()) {
        employees.add(item.requester.trim());
      }
      (item.contractDeliverables || []).forEach((contract) => {
        (contract.services || []).forEach((service) => {
          if (service.employee && service.employee.trim()) {
            employees.add(service.employee.trim());
          }
          (service.assignedEmployees || []).forEach((empObj) => {
            if (empObj?.employee && empObj.employee.trim()) {
              employees.add(empObj.employee.trim());
            }
          });
        });
      });
    });

    return [...employees].sort();
    // }, [candidates, selectedCustomer]);
  }, [candidates, dbEmployees, selectedCustomer]);
  const employeeOptions = useMemo(() => {
    if (!employeeSearchQuery.trim()) return rawEmployeeOptions;
    const q = employeeSearchQuery.trim().toLowerCase();
    return rawEmployeeOptions.filter((item) => item.toLowerCase().includes(q));
  }, [rawEmployeeOptions, employeeSearchQuery]);

  // 3. Site Options
  const rawSiteOptions = useMemo(() => {
    let filtered = candidates;

    if (selectedCustomer) {
      filtered = filtered.filter(
        (item) =>
          (item.companyName || "").trim().toLowerCase() ===
            selectedCustomer.trim().toLowerCase() ||
          (item.clientId || "").trim().toLowerCase() ===
            selectedCustomer.trim().toLowerCase(),
      );
    }

    if (selectedEmployee) {
      filtered = filtered.filter((item) => {
        const matchesRequester =
          (item.requester || "").trim().toLowerCase() ===
          selectedEmployee.trim().toLowerCase();

        const matchesServiceEmp = (item.contractDeliverables || []).some(
          (contract) =>
            (contract.services || []).some(
              (service) =>
                (service.employee || "").trim().toLowerCase() ===
                  selectedEmployee.trim().toLowerCase() ||
                (service.assignedEmployees || []).some(
                  (e) =>
                    (e?.employee || "").trim().toLowerCase() ===
                    selectedEmployee.trim().toLowerCase(),
                ),
            ),
        );

        return matchesRequester || matchesServiceEmp;
      });
    }

    const sites = new Set();

    filtered.forEach((item) => {
      (item.contractDeliverables || []).forEach((contract) => {
        if (contract.siteName && contract.siteName.trim()) {
          sites.add(contract.siteName.trim());
        }
      });
    });

    return [...sites].sort();
  }, [candidates, selectedCustomer, selectedEmployee]);

  const siteOptions = useMemo(() => {
    if (!siteSearchQuery.trim()) return rawSiteOptions;
    const q = siteSearchQuery.trim().toLowerCase();
    return rawSiteOptions.filter((item) => item.toLowerCase().includes(q));
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

  const activeEmployeeObj = useMemo(() => {
    if (!selectedEmployee) return null;
    return (
      dbEmployees.find(
        (emp) =>
          (emp.employeeName || "").trim().toLowerCase() ===
          selectedEmployee.trim().toLowerCase(),
      ) || {
        employeeName: selectedEmployee,
        place: "Default Location",
        shiftStartTime: "08:00",
        shiftEndTime: "20:00",
      }
    );
  }, [dbEmployees, selectedEmployee]);
  // Helper for timeline bar style
  const getShiftBarStyle = (startTimeStr, endTimeStr) => {
    const parseHour = (str) => {
      if (!str) return 8;
      const parts = str.split(":");
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      return h + m / 60;
    };
    const startH = parseHour(startTimeStr);
    let endH = parseHour(endTimeStr);
    if (endH <= startH) endH = 24;
    const leftPercent = (startH / 24) * 100;
    const widthPercent = ((endH - startH) / 24) * 100;
    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  // Filtered Candidate Records
  const displayRecords = useMemo(() => {
    return candidates.filter((item) => {
      const custName = (item.companyName || item.clientId || "").trim();
      if (
        selectedCustomer &&
        custName.toLowerCase() !== selectedCustomer.trim().toLowerCase()
      ) {
        return false;
      }
      if (
        customerSearchQuery.trim() &&
        !custName
          .toLowerCase()
          .includes(customerSearchQuery.trim().toLowerCase())
      ) {
        return false;
      }

      const empName = (item.requester || "").trim();
      if (
        selectedEmployee &&
        empName.toLowerCase() !== selectedEmployee.trim().toLowerCase()
      ) {
        return false;
      }
      if (
        employeeSearchQuery.trim() &&
        !empName
          .toLowerCase()
          .includes(employeeSearchQuery.trim().toLowerCase())
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
      if (siteSearchQuery.trim()) {
        const hasSiteQuery = (item.contractDeliverables || []).some((c) =>
          (c.siteName || "")
            .trim()
            .toLowerCase()
            .includes(siteSearchQuery.trim().toLowerCase()),
        );
        if (!hasSiteQuery) return false;
      }

      return true;
    });
  }, [
    candidates,
    selectedCustomer,
    selectedEmployee,
    selectedSite,
    customerSearchQuery,
    employeeSearchQuery,
    siteSearchQuery,
  ]);

  // Deliverable Site Rows
  const deliverableRows = useMemo(() => {
    const rows = [];
    displayRecords.forEach((candidate) => {
      (candidate.contractDeliverables || []).forEach((contract, cIdx) => {
        if (
          selectedSite &&
          (contract.siteName || "").trim().toLowerCase() !==
            selectedSite.trim().toLowerCase()
        ) {
          return;
        }
        if (
          siteSearchQuery.trim() &&
          !(contract.siteName || "")
            .trim()
            .toLowerCase()
            .includes(siteSearchQuery.trim().toLowerCase())
        ) {
          return;
        }

        rows.push({
          candidateId: candidate._id,
          contractId: contract._id,
          rowId: `${candidate._id}_${contract._id || cIdx}`,
          companyName: candidate.companyName || candidate.clientId || "Client",
          requester: candidate.requester || "Requester",
          siteName: contract.siteName || `Site ${cIdx + 1}`,
          siteAddress: contract.siteAddress || "",
          services: contract.services || [],
        });
      });
    });
    return rows;
  }, [displayRecords, selectedSite, siteSearchQuery]);

  const isToday = (d) => {
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // Color themes for ServiceNow shift badges
  const colorThemes = [
    "theme-green",
    "theme-blue",
    "theme-pink",
    "theme-orange",
    "theme-purple",
  ];

  // Open Assign Employee Modal Popup
  const handleOpenAssignModal = (row, card, sIdx) => {
    setAssignModal({
      isOpen: true,
      candidateId: row.candidateId,
      contractId: row.contractId,
      serviceIndex: sIdx,
      cardIndex: card.cardIndex,
      quantity: card.totalQty,
      siteName: row.siteName,
      serviceType: card.serviceType || card.position || "Shift",
      position: card.position || "",
      shiftTime: `${card.shiftStartTime || "08:00"} - ${card.shiftEndTime || "16:00"}`,
      currentEmployee:
        card.assignedEmployees?.[card.cardIndex - 1]?.employee || "",
    });
    setNewEmployeeName(card.employee || row.requester || "");
    setSaveSuccessMsg("");
  };

  // Close Assign Modal
  const handleCloseModal = () => {
    setAssignModal((prev) => ({ ...prev, isOpen: false }));
    setSaveSuccessMsg("");
  };

  // Save Assigned Employee to Backend API
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

      // Clone existing services array
      const updatedServices = JSON.parse(
        JSON.stringify(contract.services || []),
      );
      if (updatedServices[assignModal.serviceIndex]) {
        updatedServices[assignModal.serviceIndex].employee =
          newEmployeeName.trim();

        // Also update assignedEmployees array for consistency
        const qty = updatedServices[assignModal.serviceIndex].quantity || 1;

        let assigned =
          updatedServices[assignModal.serviceIndex].assignedEmployees || [];

        // Create empty rows until quantity
        while (assigned.length < qty) {
          assigned.push({
            employee: "",
          });
        }

        // Update only the clicked card
        assigned[assignModal.cardIndex - 1].employee = newEmployeeName.trim();

        updatedServices[assignModal.serviceIndex].assignedEmployees = assigned;
      }

      // API Endpoint URL
      const apiUrl = `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${assignModal.candidateId}/contracts/${assignModal.contractId}/services`;
      console.log(
        "Saving assignedEmployees:",
        updatedServices[assignModal.serviceIndex].assignedEmployees,
      );
      try {
        await axios.put(apiUrl, {
          services: updatedServices,
          adhocServices: contract.adhocServices || [],
        });
      } catch (err) {
        // Fallback to relative local API endpoint
        await axios.put(
          `/api/BoardingCandidates/${assignModal.candidateId}/contracts/${assignModal.contractId}/services`,
          {
            services: updatedServices,
            adhocServices: contract.adhocServices || [],
          },
        );
      }

      setSaveSuccessMsg("Employee assigned and saved successfully!");

      // Refresh backend candidates data
      // await fetchBoardingCandidates();
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

  return (
    <div className="rosterMainWrapper">
      {/* 20% HEIGHT: TOP FILTER TABS SECTION */}
      <div className="rosterTopSection">
        <div className="rosterHeaderRow">
          <div className="rosterTitleBlock">
            <h2>Roster Management</h2>
          </div>

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
              <div className="tabSearchBox">
                <input
                  type="text"
                  placeholder="Search customer (e.g. NO)..."
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
              <option value="">
                {customerSearchQuery
                  ? `-- Matching "${customerSearchQuery}" (${customerOptions.length}) --`
                  : "All Customers"}
              </option>
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
              <div className="tabSearchBox">
                <input
                  type="text"
                  placeholder="Search employee..."
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
              <option value="">
                {employeeSearchQuery
                  ? `-- Matching "${employeeSearchQuery}" (${employeeOptions.length}) --`
                  : "All Employees"}
              </option>
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
              <div className="tabSearchBox">
                <input
                  type="text"
                  placeholder="Search site..."
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
            )}

            <select
              id="siteSelect"
              className="rosterSelect"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              disabled={loading}
            >
              <option value="">
                {siteSearchQuery
                  ? `-- Matching "${siteSearchQuery}" (${siteOptions.length}) --`
                  : "All Sites"}
              </option>
              {siteOptions.map((site, index) => (
                <option key={index} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 70% HEIGHT: SERVICENOW STYLE LIGHT THEME CALENDAR VIEW */}
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
            {/* IF AN EMPLOYEE IS SELECTED: DISPLAY EMPLOYEE SHIFT TIMELINE MATCHING IMAGE */}
            {selectedEmployee && activeEmployeeObj ? (
              <div className="selectedEmployeeTimelineBox">
                <div className="empTimelineHeader">
                  <h3>
                    Employee Shift Timeline Schedule:{" "}
                    {activeEmployeeObj.employeeName}
                  </h3>
                </div>
                <div className="employeeTimelineRow">
                  <div className="agentInfoCol">
                    <div className="agentName">
                      {activeEmployeeObj.employeeName}
                    </div>
                    <div className="agentLocation">
                      📍 {activeEmployeeObj.place || "Default Location"}
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
                        activeEmployeeObj.shiftStartTime,
                        activeEmployeeObj.shiftEndTime,
                      )}
                    >
                      <div className="shiftBlockTitle">
                        Shift: {activeEmployeeObj.shiftStartTime || "08:00"} -{" "}
                        {activeEmployeeObj.shiftEndTime || "20:00"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* CALENDAR WEEK HEADER */}
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

            {/* DELIVERABLE SITE ROWS */}
            {deliverableRows.length === 0 ? (
              <div className="emptyStateCalendar">
                No contract deliverables or sites match the selected filters.
              </div>
            ) : (
              deliverableRows.map((row) => (
                <div className="siteCalendarRow" key={row.rowId}>
                  {/* SITE BANNER */}
                  <div className="siteBannerHeader">
                    <span className="siteBannerTitle">
                      📍 {row.siteName}{" "}
                      {row.siteAddress ? `(${row.siteAddress})` : ""}
                    </span>
                    <span className="siteBannerMeta">
                      Customer: <strong>{row.companyName}</strong> | Requester:{" "}
                      <strong>{row.requester}</strong>
                    </span>
                  </div>

                  {/* 7 DAYS CALENDAR GRID FOR THIS SITE */}
                  <div className="siteDaysGrid">
                    {weekDates.map((date, dayIdx) => {
                      const currentDayName = weekDays[dayIdx];

                      const matchingServices = row.services.filter((svc) => {
                        const workingDays = svc.workingDays || [];
                        if (workingDays.length > 0) {
                          if (!workingDays.includes(currentDayName))
                            return false;
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
                      });

                      // Expand services by quantity
                      const expandedCards = [];
                      matchingServices.forEach((svc, sIdx) => {
                        const qty = Math.max(1, Number(svc.quantity) || 1);
                        for (let q = 0; q < qty; q++) {
                          expandedCards.push({
                            ...svc,
                            serviceIndex: sIdx,
                            cardIndex: q + 1,
                            totalQty: qty,
                            themeClass:
                              colorThemes[(sIdx + q) % colorThemes.length],
                          });
                        }
                      });

                      return (
                        <div
                          key={dayIdx}
                          className={`calendarDayCell ${isToday(date) ? "todayCell" : ""}`}
                        >
                          {expandedCards.length === 0 ? (
                            <div className="emptyDayCell">-</div>
                          ) : (
                            expandedCards.map((card, cIdx) => (
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

                                <div className="shiftEmployee">
                                  👤{" "}
                                  {card.assignedEmployees?.[card.cardIndex - 1]
                                    ?.employee || "Click to Assign"}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
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
              <button className="closeModalBtn" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="assignModalBody">
              <div className="shiftInfoBox">
                <p>
                  <strong>Site:</strong> {assignModal.siteName}
                </p>
                <p>
                  <strong>Service / Shift:</strong> {assignModal.serviceType} (
                  {assignModal.shiftTime})
                </p>
                <p>
                  <p>
                    <strong>Slot:</strong> {assignModal.cardIndex} /{" "}
                    {assignModal.quantity}
                  </p>
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="saveSuccessAlert">{saveSuccessMsg}</div>
              )}

              <div className="formGroup">
                <label htmlFor="assignEmployeeInput">
                  Select or Enter Employee Name:
                </label>
                <input
                  id="assignEmployeeInput"
                  type="text"
                  list="employeeSuggestions"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="Type or select employee..."
                  className="assignInput"
                  autoFocus
                />
                <datalist id="employeeSuggestions">
                  {rawEmployeeOptions.map((emp, i) => (
                    <option key={i} value={emp} />
                  ))}
                </datalist>
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
                {savingAssign ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RosterMain;
