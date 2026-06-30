import "../../../App.jsx";
import "./index.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import leaveImg from "../../../images/leavemanagement.jfif";
import payrollImg from "../../../images/payrools.jfif";
import rosterImg from "../../../images/roster.jfif";

function OpMainPage() {
  console.log(leaveImg);
  const navigate = useNavigate();

  const services = [
    {
      title: "HR",
      desc: "*****************",
      img: leaveImg,
      //   route: "/leave-request",
    },
    {
      title: "IT",
      desc: "*****************",
      img: payrollImg,
      //   route: "/payroll",
    },
    {
      title: "Organisation Policies",
      desc: "*****************",
      img: rosterImg,
      //   route: "/schedule",
    },
  ];

  return (
    <div className="OPPage">
      <div className="navbar">
        <div className="logo">
          <img
            src={logo}
            className="logoimage"
            alt="Logo"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="OPServices">
        {services.map((item, index) => (
          <div
            className="OPCard"
            key={index}
            onClick={() => item.route && navigate(item.route)}
          >
            <img src={item.img} alt={item.title} className="OPCardImage" />

            <div className="OPCardContent">
              <h3 className="OPCardTitle">{item.title}</h3>
              <p className="OPCardDescription">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpMainPage;
