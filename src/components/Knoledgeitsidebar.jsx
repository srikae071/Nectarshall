import { useNavigate } from "react-router-dom";

function Knoledgeitsidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>Organisation Policies </h3>

      <div onClick={() => navigate("/leave-request")}>Knowledge Base it</div>

      <div onClick={() => navigate("/leave-balance")}>Knowledge Base hr</div>

      <div onClick={() => navigate("/leave-calendar")}>
        Knoledge base operations
      </div>
    </div>
  );
}

export default Knoledgeitsidebar;
