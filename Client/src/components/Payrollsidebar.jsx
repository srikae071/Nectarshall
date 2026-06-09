import { useNavigate } from "react-router-dom";
import Payroll from "../pages/PayrollPage/Payroll";

function Payrollsidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>Payroll</h3>

      <div onClick={() => navigate("/leave-request")}>Salary Slip</div>
    </div>
  );
}

export default Payrollsidebar;
