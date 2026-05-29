import { useNavigate } from "react-router-dom";

function Mainframe() {
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Enhance Services
        </div>

        <div className="profile">👤</div>
      </div>
      <div className="sidebar">
        <h3>Leave Management</h3>

        <div onClick={() => navigate("/leave-request")}>Leave Request</div>

        <div onClick={() => navigate("/leave-balance")}>Leave Balance</div>

        <div onClick={() => navigate("/leave-calendar")}>Leave Calendar</div>

        <div onClick={() => navigate("/leave-status")}>Leave Status</div>
      </div>
    </>
  );
}
export default Mainframe;
