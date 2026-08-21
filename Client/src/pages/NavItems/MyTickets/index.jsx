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

      const allTickets = [...itTickets, ...hrTickets];

      // User role & username filtering
      let authUser = null;
      try {
        const saved = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (saved) authUser = JSON.parse(saved);
      } catch (e) {
        const raw = localStorage.getItem("authUser") || localStorage.getItem("user") || localStorage.getItem("username");
        if (raw && typeof raw === "string") authUser = { username: raw };
      }

      const username = (authUser?.username || authUser?.name || authUser?.displayName || (typeof authUser === "string" ? authUser : "")).trim();
      const role = (authUser?.role || "").toUpperCase();
      const isAdmin = role === "ADMIN" || username.toLowerCase().includes("sumit");

      if (isAdmin) {
        setTickets(allTickets);
      } else if (username) {
        const u = username.toLowerCase();
        const filtered = allTickets.filter((item) => {
          const r1 = (item.requester || "").toLowerCase();
          const r2 = (item.requesterFor || "").toLowerCase();
          return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u);
        });
        setTickets(filtered);
      } else {
        setTickets([]);
      }
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
              <th>Requested For</th>
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
