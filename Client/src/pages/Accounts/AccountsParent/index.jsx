import React, { useMemo, useState } from "react";
import "./index.css";

function AccountsParent() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const weekOptions = useMemo(() => {
    const createWeekData = (weekNumber) => ({
      id: weekNumber,
      label: `Week ${weekNumber}`,
      workers: [
        {
          id: 1,
          name: "Alex Carter",
          role: "Security Officer",
          sites: [
            { siteName: "North Gate Site", hours: 2, ratePerHour: 22.5 },
            { siteName: "Harbor Entry Site", hours: 2, ratePerHour: 22.5 },
          ],
        },
        {
          id: 2,
          name: "Maria Gomez",
          role: "Cleaner",
          sites: [
            { siteName: "Main Office", hours: 4, ratePerHour: 18.0 },
          ],
        },
        {
          id: 3,
          name: "David Lewis",
          role: "Site Support",
          sites: [
            { siteName: "Warehouse Block", hours: 3, ratePerHour: 20.0 },
            { siteName: "South Yard", hours: 1, ratePerHour: 20.0 },
          ],
        },
      ],
    });

    return Array.from({ length: 52 }, (_, index) => createWeekData(index + 1));
  }, []);

  const selectedWeekData = useMemo(() => {
    return weekOptions.find((week) => week.id === selectedWeek) || weekOptions[0];
  }, [selectedWeek, weekOptions]);

  const totalWeeklyPay = useMemo(() => {
    return selectedWeekData.workers.reduce((total, worker) => {
      const workerTotal = worker.sites.reduce((sum, site) => sum + site.hours * site.ratePerHour, 0);
      return total + workerTotal;
    }, 0);
  }, [selectedWeekData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="accountsParentContainer">
      <div className="accountsHeader">
        <div>
          <h2>📋 PayRun Accounts Dashboard</h2>
          <p className="accountsSubtext">
            Select a week to review worker placements, assigned sites, hours worked, and payable wages.
          </p>
        </div>

        <div className="accountsSearchBox">
          <select
            className="accountsSearchInput"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
          >
            {weekOptions.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="accountsTabButtons">
        <button className="accountsTabBtn active">
          📋 {selectedWeekData.label} Weekly Wage View
        </button>
      </div>

      <div className="accountsTableWrapper">
        <table className="accountsTable">
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Role</th>
              <th>Site</th>
              <th>Hours</th>
              <th>Rate / Hour</th>
              <th>Site Pay</th>
            </tr>
          </thead>
          <tbody>
            {selectedWeekData.workers.map((worker) =>
              worker.sites.map((site, index) => (
                <tr key={`${worker.id}-${site.siteName}`}>
                  {index === 0 ? (
                    <>
                      <td className="empNameText">👤 {worker.name}</td>
                      <td>{worker.role}</td>
                    </>
                  ) : (
                    <>
                      <td></td>
                      <td></td>
                    </>
                  )}
                  <td>{site.siteName}</td>
                  <td>{site.hours}</td>
                  <td>{formatCurrency(site.ratePerHour)}</td>
                  <td>{formatCurrency(site.hours * site.ratePerHour)}</td>
                </tr>
              ))
            )}
            <tr>
              <td colSpan="5" className="boldText">
                Total Payable for {selectedWeekData.label}
              </td>
              <td className="boldText">{formatCurrency(totalWeeklyPay)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountsParent;