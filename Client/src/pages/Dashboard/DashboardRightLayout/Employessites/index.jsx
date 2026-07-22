import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { EmployeeContext } from "../EmployeeContext";
import { useLocation } from "react-router-dom";
import "./index.css";
import DashboardLayout from "../../DashboardLayout";

function Employeesites() {
  const { selectedCustomer } = useContext(EmployeeContext);
  const location = useLocation();

  const activeRequester = location.state?.requester || selectedCustomer;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [adhocPopup, setAdhocPopup] = useState(null);

  const [sitePopup, setSitePopup] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [serviceRows, setServiceRows] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  const [savedData, setSavedData] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    start: "",
    end: "",
    break: "",
    position: "",
    role: "",
  });

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getWeekDates = (date) => {
    const start = new Date(date);

    const day = start.getDay();

    const diff = start.getDate() - day + (day === 0 ? -6 : 1);

    start.setDate(diff);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);

      d.setDate(start.getDate() + i);

      week.push({
        label: d.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        }),
        full: new Date(d),
      });
    }

    return week;
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const isDateBetween = (date, start, end) => {
    if (!start || !end) return false;

    const current = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);

    current.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return current >= startDate && current <= endDate;
  };

  const isWorkingDay = (date, workingDays = []) => {
    const dayName = weekDays[new Date(date).getDay()];

    return workingDays.includes(dayName);
  };

  const fetchApprovedSites = async () => {
    try {
      const response = await axios.get(
        "https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates",
      );

      const approvedSites = [];

      response.data
        .filter(
          (item) =>
            // item.operationsClientApproved === true &&
            // item.status === "On Boarded" &&
            // (!selectedCustomer || item.requester === selectedCustomer),
            item.operationsClientApproved === true &&
            item.status === "On Boarded" &&
            item.requester === activeRequester,
        )
        .forEach((boarding) => {
          (boarding.contractDeliverables || []).forEach((contract) => {
            (contract.services || []).forEach((service, serviceIndex) => {
              approvedSites.push({
                boardingId: boarding._id,
                contractId: contract._id,

                requester: boarding.requester,
                clientId: contract.clientId,

                siteName: contract.siteName,
                siteAddress: contract.siteAddress,

                serviceIndex,

                services: JSON.parse(JSON.stringify(contract.services || [])),

                serviceType: service.serviceType || "",
                employee: service.employee || "",
                assignedEmployees: service.assignedEmployees || [],
                adhocServices: contract.adhocServices || [],
                position: service.position || "",
                quantity: service.quantity || 0,
                shiftStartTime: service.shiftStartTime || "",

                shiftEndTime: service.shiftEndTime || "",

                workingDays: service.workingDays || [],

                contractStartDate: service.contractStartDate,

                contractEndDate: service.contractEndDate,
              });
            });
          });
        });

      const rows = approvedSites;

      setEmployees(rows);

      if (rows.length > 0 && rows[0].boardingId) {
        setSelectedSite(rows[0]);
        setServiceRows(rows);
      } else {
        setSelectedSite(null);
        setServiceRows([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApprovedSites();
  }, [activeRequester]);
  const openServicePopup = (row, date) => {
    if (!row) return;

    // const selectedService = row.services?.[row.serviceIndex] || {
    //   serviceType: row.serviceType,
    //   position: row.position,
    //   quantity: row.quantity,
    //   shiftStartTime: row.shiftStartTime,
    //   shiftEndTime: row.shiftEndTime,
    //   employee: row.employee,
    //   workingDays: row.workingDays,
    //   contractStartDate: row.contractStartDate,
    //   contractEndDate: row.contractEndDate,
    // };
    const selectedService = JSON.parse(
      JSON.stringify(
        row.services?.[row.serviceIndex] || {
          serviceType: row.serviceType,
          position: row.position,
          quantity: row.quantity,
          shiftStartTime: row.shiftStartTime,
          shiftEndTime: row.shiftEndTime,
          employee: row.employee,
          assignedEmployees: [],
          workingDays: row.workingDays,
          contractStartDate: row.contractStartDate,
          contractEndDate: row.contractEndDate,
        },
      ),
    );

    if (!selectedService.assignedEmployees) {
      selectedService.assignedEmployees = [];
    }

    while (
      selectedService.assignedEmployees.length < selectedService.quantity
    ) {
      selectedService.assignedEmployees.push({
        employee: "",
      });
    }

    setSitePopup({
      boardingId: row.boardingId,
      contractId: row.contractId,
      serviceIndex: row.serviceIndex,
      selectedDate: date,
      services: [JSON.parse(JSON.stringify(selectedService))],
    });
  };
  const openAdhocPopup = (service, date) => {
    setAdhocPopup({
      boardingId: service.boardingId,
      contractId: service.contractId,
      serviceDate: date,

      adhocId: "",

      serviceType: "",
      position: "",
      shiftStartTime: "",
      shiftEndTime: "",
    });
  };

  const shouldRenderService = (service, date) => {
    if (!service) return false;

    if (
      !isDateBetween(date, service.contractStartDate, service.contractEndDate)
    ) {
      return false;
    }

    return isWorkingDay(date, service.workingDays || []);
  };

  const getServiceCard = (service, date) => {
    if (!shouldRenderService(service, date)) {
      return null;
    }

    return {
      serviceType: service.serviceType,
      position: service.position,
      quantity: service.quantity,
      shiftStartTime: service.shiftStartTime,
      shiftEndTime: service.shiftEndTime,
      employee: service.employee,
    };
  };

  const handleServicePopupChange = (index, field, value) => {
    setSitePopup((prev) => {
      const updated = { ...prev };

      updated.services = [...updated.services];

      updated.services[index] = {
        ...updated.services[index],
        [field]: value,
      };

      return updated;
    });
  };

  const handleSitePopupSave = async () => {
    try {
      const updatedServices = [...(selectedSite.services || [])];

      updatedServices[sitePopup.serviceIndex] = sitePopup.services[0];

      updatedServices[sitePopup.serviceIndex].assignedEmployees =
        sitePopup.services[0].assignedEmployees;

      await axios.put(
        `https://nectarshall-api-fhcpggc7gxcnbbhq.southindia-01.azurewebsites.net/api/BoardingCandidates/${sitePopup.boardingId}/contracts/${sitePopup.contractId}/services`,
        {
          services: updatedServices,
        },
      );

      alert("Updated Successfully");

      setSitePopup(null);

      fetchApprovedSites();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdhocSave = async () => {
    try {
      const selectedSite = serviceRows.find(
        (item) =>
          item.boardingId === adhocPopup.boardingId &&
          item.contractId === adhocPopup.contractId,
      );

      if (!selectedSite) return;

      const updatedAdhocServices = [
        ...(selectedSite.adhocServices || []),
        {
          adhocId: "",
          serviceType: adhocPopup.serviceType,
          position: adhocPopup.position,
          shiftStartTime: adhocPopup.shiftStartTime,
          shiftEndTime: adhocPopup.shiftEndTime,
          serviceDate: adhocPopup.serviceDate,
        },
      ];

      console.log(updatedAdhocServices);

      setAdhocPopup(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="schedulePage">
        <div className="scheduleContainer">
          {/* ================= TOP BAR ================= */}

          <div className="scheduleTopBar">
            <div className="weekNavigation">
              <button
                className="weekButton"
                onClick={() =>
                  setCurrentDate((prev) => {
                    const d = new Date(prev);

                    d.setDate(prev.getDate() - 7);

                    return d;
                  })
                }
              >
                &#10094;
              </button>

              <div className="weekTitle">
                {weekDates[0].label} - {weekDates[6].label}
              </div>

              <button
                className="weekButton"
                onClick={() =>
                  setCurrentDate((prev) => {
                    const d = new Date(prev);

                    d.setDate(prev.getDate() + 7);

                    return d;
                  })
                }
              >
                &#10095;
              </button>
            </div>

            <div className="topRightButtons">
              <select className="actionSelect">
                <option>Actions</option>
              </select>

              <button className="collapseButton">Collapse</button>

              <button className="saveChangesButton">Save Changes</button>

              <button className="cancelButton">Cancel</button>
            </div>
          </div>

          {/* ================= CALENDAR ================= */}

          <div className="calendarWrapper">
            <div className="calendarHeader">
              {weekDates.map((day, index) => (
                <div key={index} className="calendarHeaderCell">
                  <div className="dayName">
                    {day.full.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>

                  <div className="dayDate">
                    {day.full.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="calendarBody">
              {serviceRows.map((service, rowIndex) => {
                // const showSiteName =
                //   rowIndex === 0 &&
                //   selectedSite &&
                //   selectedSite.siteName === service.siteName;
                const previousRow = serviceRows[rowIndex - 1];

                const showSiteName =
                  rowIndex === 0 ||
                  !previousRow ||
                  previousRow.contractId !== service.contractId;
                return (
                  <div
                    key={`${service.boardingId}-${service.contractId}-${service.serviceIndex}-${rowIndex}`}
                    className="serviceRowWrapper"
                  >
                    {showSiteName && (
                      <div className="siteNameRow">
                        <div className="siteAddress">{service.siteAddress}</div>
                      </div>
                    )}

                    <div className="calendarRow">
                      {weekDates.map((day, colIndex) => {
                        const card = getServiceCard(service, day.full);

                        return (
                          <div key={colIndex} className="calendarCell">
                            {card && (
                              <div className="adhocButtonContainer">
                                <button
                                  className="adhocButton"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openAdhocPopup(service, day.full);
                                  }}
                                >
                                  ➕
                                </button>
                              </div>
                            )}
                            {!card ? (
                              <div
                                className="emptyCell"
                                onClick={() =>
                                  openServicePopup(service, day.full)
                                }
                              >
                                +
                              </div>
                            ) : (
                              <>
                                {Array.from({
                                  length: card.quantity || 1,
                                }).map((_, qtyIndex) => (
                                  <div
                                    key={qtyIndex}
                                    className="serviceCard"
                                    onClick={() =>
                                      openServicePopup(service, day.full)
                                    }
                                  >
                                    <div className="serviceType">
                                      {card.serviceType}
                                    </div>

                                    <div className="servicePosition">
                                      {card.position}
                                    </div>

                                    <div className="serviceQty">
                                      Qty : {qtyIndex + 1} / {card.quantity}
                                    </div>

                                    <div className="serviceShift">
                                      {card.shiftStartTime}
                                      {" - "}
                                      {card.shiftEndTime}
                                    </div>

                                    <div className="serviceEmployee">
                                      {service.assignedEmployees?.[qtyIndex]
                                        ?.employee || "Assign Employee"}
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {sitePopup && (
            <div className="sitePopupOverlay">
              <div className="sitePopup">
                <div className="popupHeader">
                  <span>Edit Service</span>

                  <button
                    className="closeBtn"
                    onClick={() => setSitePopup(null)}
                  >
                    ×
                  </button>
                </div>

                {sitePopup.services.map((service, index) => (
                  <div key={index} className="serviceDetails">
                    <div className="form-group">
                      <label>Service Type</label>

                      <input
                        type="text"
                        value={service.serviceType}
                        onChange={(e) =>
                          handleServicePopupChange(
                            index,
                            "serviceType",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Position</label>

                      <input
                        type="text"
                        value={service.position}
                        onChange={(e) =>
                          handleServicePopupChange(
                            index,
                            "position",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Quantity</label>

                      <input
                        type="number"
                        value={service.quantity}
                        onChange={(e) =>
                          handleServicePopupChange(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Shift Start</label>

                      <input
                        type="time"
                        value={service.shiftStartTime || ""}
                        onChange={(e) =>
                          handleServicePopupChange(
                            index,
                            "shiftStartTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Shift End</label>

                      <input
                        type="time"
                        value={service.shiftEndTime || ""}
                        onChange={(e) =>
                          handleServicePopupChange(
                            index,
                            "shiftEndTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Assigned Employees</label>

                      {(service.assignedEmployees || []).map(
                        (emp, empIndex) => (
                          <div
                            key={empIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            <span
                              style={{
                                width: "90px",
                                fontWeight: "600",
                                marginRight: "10px",
                              }}
                            >
                              Employee {empIndex + 1}
                            </span>

                            <input
                              type="text"
                              style={{
                                flex: 1,
                                padding: "8px 10px",
                              }}
                              value={emp.employee || ""}
                              onChange={(e) => {
                                const updatedServices = [...sitePopup.services];

                                updatedServices[index].assignedEmployees[
                                  empIndex
                                ].employee = e.target.value;

                                setSitePopup({
                                  ...sitePopup,
                                  services: updatedServices,
                                });
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>
                    <div className="popupButtons">
                      <button
                        className="savePopupButton"
                        onClick={handleSitePopupSave}
                      >
                        Save
                      </button>

                      <button
                        className="cancelPopupButton"
                        onClick={() => setSitePopup(null)}
                      >
                        Cancel
                      </button>
                    </div>

                    {index !== sitePopup.services.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            </div>
          )}
          {adhocPopup && (
            <div className="sitePopupOverlay">
              <div className="sitePopup">
                <div className="popupHeader">
                  <span>Add Adhoc Service</span>

                  <button
                    className="closeBtn"
                    onClick={() => setAdhocPopup(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="serviceDetails">
                  <div className="form-group">
                    <label>Adhoc ID</label>

                    <input
                      type="text"
                      value={adhocPopup.adhocId || "Auto Generate"}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Service Type</label>

                    <input
                      type="text"
                      value={adhocPopup.serviceType}
                      onChange={(e) =>
                        setAdhocPopup({
                          ...adhocPopup,
                          serviceType: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>

                    <input
                      type="text"
                      value={adhocPopup.position}
                      onChange={(e) =>
                        setAdhocPopup({
                          ...adhocPopup,
                          position: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Shift Start</label>

                    <input
                      type="time"
                      value={adhocPopup.shiftStartTime}
                      onChange={(e) =>
                        setAdhocPopup({
                          ...adhocPopup,
                          shiftStartTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Shift End</label>

                    <input
                      type="time"
                      value={adhocPopup.shiftEndTime}
                      onChange={(e) =>
                        setAdhocPopup({
                          ...adhocPopup,
                          shiftEndTime: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="popupButtons">
                    <button
                      className="savePopupButton"
                      onClick={handleAdhocSave}
                    >
                      Save
                    </button>

                    <button
                      className="cancelPopupButton"
                      onClick={() => setAdhocPopup(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Employeesites;
