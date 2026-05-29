import HrmsLeftLayout from "../../../Hrmsleftlayout/index";
import "./index.css";

const data = [
  {
    id: 101,
    name: "Amit Jain",
    dept: "IT",
    category: "Payroll",
    status: "Open",
  },
  { id: 102, name: "Sumit Jain", dept: "IT", category: "Tax", status: "Open" },
  {
    id: 103,
    name: "Saumya Singh",
    dept: "Operations",
    category: "Compensation",
    status: "Resolved",
  },
  {
    id: 104,
    name: "Kanak Singh",
    dept: "HR",
    category: "Compensation",
    status: "Resolved",
  },
];

function All() {
  return (
    <HrmsLeftLayout>
      <div className="home">
        <div className="tableCard">
          <h3>All</h3>

          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Requester Name</th>
                <th>Department</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.dept}</td>
                  <td>{item.category}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footer">
          © Copyright 2023 Enhance Services - All Rights Reserved.
        </div>
      </div>
    </HrmsLeftLayout>
  );
}

export default All;
