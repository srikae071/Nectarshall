import { useNavigate } from "react-router-dom";
import "./LeavesSidebar.css";

function LeaveSidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>Leave Management</h3>

      <div onClick={() => navigate("/leave-request")}>Leave Request</div>

      <div onClick={() => navigate("/leave-balance")}>Leave Balance</div>

      <div onClick={() => navigate("/leave-calendar")}>Leave Calendar</div>

      <div onClick={() => navigate("/leave-status")}>Leave Status</div>
    </div>
  );
}

export default LeaveSidebar;
