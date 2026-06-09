import "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import leaveImg from "../../../images/leavemanagement.jfif";
import payrollImg from "../../../images/payrools.jfif";
import rosterImg from "../../../images/roster.jfif";

function OrganisationPolicies() {
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
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} className="logoimage" onClick={() => navigate("/")} />
        </div>
      </div>

      {/* <div className="services">
        {services.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => {
              if (item.title === "Leaves Management") {
                console.log("Navigating to Leave Request");
                navigate("/leave-request");
              } else if (item.title === "Payrolls") {
                console.log("Navigating to Payroll");
                navigate("/payroll");
              }
            }}
          >
            <div
              className="card-img"
              style={{ backgroundImage: `url(${item.img})` }}
            ></div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div> */}
      <div className="services">
        {services.map((item, index) => (
          <div
            className="card"
            key={index}
            onClick={() => item.route && navigate(item.route)}
          >
            <div
              className="card-img"
              style={{ backgroundImage: `url(${item.img})` }}
            ></div>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrganisationPolicies;
