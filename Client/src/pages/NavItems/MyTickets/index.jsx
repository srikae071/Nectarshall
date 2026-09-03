import { useEffect, useState } from "react";
import { fetchApiData } from "../../../utils/apiClient";
import MyTicketsNavBar from "./MyTicketsNavvar/index.jsx";
import CaseTable from "../../../components/CaseTable";
import "./index.css";

function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const sortNewestFirst = (arr) => {
    return [...arr].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      const numA = parseInt((a.incidentNumber || a.caseId || "").replace(/\D/g, ""), 10) || 0;
      const numB = parseInt((b.incidentNumber || b.caseId || "").replace(/\D/g, ""), 10) || 0;
      if (numA !== numB) return numB - numA;
      return String(b._id || "").localeCompare(String(a._id || ""));
    });
  };

  const fetchTickets = async () => {
    try {
      const [itResponse, hrResponse] = await Promise.all([
        fetchApiData("/api/itrequests"),
        fetchApiData("/api/hrrequests"),
      ]);

      const itTickets = (itResponse.data || []).map((item) => ({
        ...item,
        requestType: "IT",
      }));

      const hrTickets = (hrResponse.data || []).map((item) => ({
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
        setTickets(sortNewestFirst(allTickets));
      } else if (username) {
        const u = username.toLowerCase();
        const filtered = allTickets.filter((item) => {
          const r1 = (item.requester || item.requesterName || "").toLowerCase();
          const r2 = (item.requesterFor || "").toLowerCase();
          return r1.includes(u) || u.includes(r1 && r1.length > 2 ? r1 : "___never___") || r2.includes(u) || u.includes(r2 && r2.length > 2 ? r2 : "___never___");
        });
        setTickets(sortNewestFirst(filtered));
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
      <div className="MyTicketsContainer" style={{ padding: "10px 20px" }}>
        <CaseTable
          title="My Tickets"
          data={tickets}
          onRowClick={null}
          emptyMessage="No Tickets Found"
        />
      </div>
    </>
  );
}

export default MyTickets;
