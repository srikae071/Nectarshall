import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HrmsHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/regular-form", { replace: true });
  }, [navigate]);

  return null;
}

export default HrmsHome;
