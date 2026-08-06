import { useEffect, useState } from "react";
import axios from "axios";
import { fetchApiData } from "../../../utils/apiClient";
import MyTicketsNavBar from "./MyTicketsNavvar/index.jsx";
import "./index.css";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const [itResponse, hrResponse] = await Promise.all([
        fetchApiData("/api/itrequests"),
        fetchApiData("/api/hrrequests"),
      ]);

      const itTickets = itResponse.data.map((item) => ({
        ...item,
        requestType: "IT",
      }));

      const hrTickets = hrResponse.data.map((item) => ({
        ...item,
        requestType: "HR",
      }));

      setTickets([...itTickets, ...hrTickets]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MyTicketsNavBar />
      <div className="MyTicketsContainer">
        <div className="MyTicketsHeader">
          <h2>My Ticket</h2>
        </div>
        <table className="MyTicketsTable">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Type</th>
              <th>Requester</th>
              <th>Requester For</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Urgency</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length > 0 ? (
              tickets.map((item) => (
                <tr key={item._id}>
                  <td>{item.incidentNumber}</td>
                  <td>
                    <span
                      className={
                        item.requestType === "IT"
                          ? "TicketBadgeIT"
                          : "TicketBadgeHR"
                      }
                    >
                      {item.requestType}
                    </span>
                  </td>
                  <td>{item.requester}</td>
                  <td>{item.requesterFor}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory}</td>
                  <td>{item.urgency}</td>
                  <td>{item.status || "Open"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="NoRecords">
                  No Tickets Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyTickets;
