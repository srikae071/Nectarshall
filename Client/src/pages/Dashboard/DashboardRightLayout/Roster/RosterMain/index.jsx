import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./index.css";

function RosterMain() {
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
    try {
      setLoading(true);
      setError("");

      // Fetch Boarding Candidates
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

  // 1. Customer Options (sourced from BoardingCandidates)
  const rawCustomerOptions = useMemo(() => {
    const names = candidates
      .map((item) => (item.companyName || item.clientId || "").trim())
      .filter((name) => name !== "");
    return [...new Set(names)].sort();
  }, [candidates]);

  const customerOptions = useMemo(() => {
    if (!customerSearchQuery.trim()) return rawCustomerOptions;
    const q = customerSearchQuery.trim().toLowerCase();
    return rawCustomerOptions.filter((item) =>
      item.toLowerCase().startsWith(q),
    );
  }, [rawCustomerOptions, customerSearchQuery]);

  // 2. Employee Options (sourced ONLY from /api/employees table as requested)
  const rawEmployeeOptions = useMemo(() => {
    const employees = new Set();
    dbEmployees.forEach((emp) => {
      if (emp.employeeName && emp.employeeName.trim()) {
        employees.add(emp.employeeName.trim());
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
          (emp.employeeName || "").trim().toLowerCase() ===
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

      filtered.forEach((item) => {
        (item.contractDeliverables || []).forEach((contract) => {
          if (contract.siteName && contract.siteName.trim()) {
            sites.add(contract.siteName.trim());
          }
        });
      });
    }

    return [...sites].sort();
  }, [candidates, selectedCustomer, selectedEmployee, activeEmployeeObj]);

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
    // If no customer and no site and no employee, return empty array
    if (!selectedCustomer && !selectedSite && !selectedEmployee) {
      return [];
    }

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
          .startsWith(customerSearchQuery.trim().toLowerCase())
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
    candidates,
    selectedCustomer,
    selectedEmployee,
    selectedSite,
    customerSearchQuery,
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

  const handleOpenAssignModal = (row, card, sIdx) => {
    const slotIdx = card.slotIndex ?? (card.cardIndex - 1);
    const slotEmp = card.slotEmployee || (card.assignedEmployees?.[slotIdx]?.employee) || (slotIdx === 0 ? card.employee : "") || "";
    setAssignModal({
      isOpen: true,
      candidateId: row.candidateId,
      contractId: row.contractId,
      serviceIndex: sIdx,
      cardIndex: card.cardIndex,
      slotIndex: slotIdx,
      siteName: row.siteName,
      serviceType: card.serviceType || card.position || "Shift",
      position: card.position || "",
      shiftTime: `${card.shiftStartTime || "08:00"} - ${card.shiftEndTime || "16:00"}`,
      currentEmployee: slotEmp || row.requester || "",
    });
    setNewEmployeeName(slotEmp || row.requester || "");
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
        const slotIdx = assignModal.slotIndex ?? (assignModal.cardIndex - 1);
        const qty = Math.max(1, Number(targetService.quantity) || 1);

        let existingAssigned = targetService.assignedEmployees || [];
        while (existingAssigned.length < qty) {
          existingAssigned.push({ employee: "", isYellow: false, isUpdated: false });
        }

        existingAssigned[slotIdx] = {
          ...existingAssigned[slotIdx],
          employee: newEmployeeName.trim(),
          isYellow: true,
          isUpdated: true,
        };

        targetService.assignedEmployees = existingAssigned;

        if (slotIdx === 0) {
          targetService.employee = newEmployeeName.trim();
        }
      }

      const apiUrl = `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${assignModal.candidateId}/contracts/${assignModal.contractId}/services`;

      try {
        await axios.put(apiUrl, {
          services: updatedServices,
          adhocServices: contract.adhocServices || [],
        });
      } catch (err) {
        await axios.put(
          `/api/BoardingCandidates/${assignModal.candidateId}/contracts/${assignModal.contractId}/services`,
          {
            services: updatedServices,
            adhocServices: contract.adhocServices || [],
          },
        );
      }

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
                            },
                          );

                          const expandedCards = [];
                          matchingServices.forEach((svc, sIdx) => {
                            const qty = Math.max(1, Number(svc.quantity) || 1);
                            for (let q = 0; q < qty; q++) {
                              const slotEmpObj = svc.assignedEmployees?.[q];
                              const slotEmployee =
                                slotEmpObj?.employee ||
                                (q === 0 ? svc.employee || "" : "");
                              const isYellow = Boolean(
                                slotEmpObj?.isYellow || slotEmpObj?.isUpdated,
                              );

                              expandedCards.push({
                                ...svc,
                                serviceIndex: sIdx,
                                cardIndex: q + 1,
                                slotIndex: q,
                                totalQty: qty,
                                slotEmployee: slotEmployee,
                                isYellow: isYellow,
                                themeClass: isYellow
                                  ? "theme-yellow"
                                  : colorThemes[(sIdx + q) % colorThemes.length],
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
                                      {card.slotEmployee ||
                                        row.requester ||
                                        "Click to Assign"}
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
                  <strong>Slot:</strong> Card #{assignModal.cardIndex}
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
