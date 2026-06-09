import HrmsLeftLayout from "../Hrms/Hrmsleftlayout";
import "./LeaveStatus.css";

const data = [
  {
    id: 1,
    type: "Casual leave",
    start: "11/01/2025",
    end: "11/04/2025",
    total: 4,
    status: "Withdrawn",
  },
  {
    id: 2,
    type: "Maternity leave",
    start: "12/16/2025",
    end: "12/22/2025",
    total: 7,
    status: "Pending approval",
  },
  {
    id: 3,
    type: "Unpaid leave",
    start: "12/15/2025",
    end: "12/15/2025",
    total: 1,
    status: "Approved",
  },
  {
    id: 4,
    type: "Unpaid leave",
    start: "12/06/2025",
    end: "12/06/2025",
    total: 1,
    status: "Cancelled",
  },
  {
    id: 5,
    type: "Comp-off",
    start: "12/10/2025",
    end: "12/11/2025",
    total: 2,
    status: "Registered",
  },
];

function LeaveStatus() {
  return (
    <HrmsLeftLayout>
      <div className="Openhome">
        <div>
          <h3 className="openheading">Leave Status</h3>

          <table className="opentable">
            <thead className="opentablerow">
              <tr className="opentablerow">
                <th className="opentablerow">Leave ID</th>
                <th className="opentablerow">Leave type</th>
                <th className="opentablerow">Start date</th>
                <th className="opentablerow">End date</th>
                <th className="opentablerow">Total leave count</th>
                <th className="opentablerow">Status</th>
              </tr>
            </thead>

            <tbody className="opentablerow">
              {data.map((item) => (
                <tr className="opentablerow" key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>
                  <td>{item.total}</td>
                  <td>
                    <span
                      className={`badge ${item.status.replace(" ", "-").toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div> */}
      </div>
    </HrmsLeftLayout>
  );
}

export default LeaveStatus;
