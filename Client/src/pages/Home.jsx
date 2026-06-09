import "../App.css";
import { Route, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import leaveImg from "../images/leavemanagement.jfif";
import payrollImg from "../images/payrools.jfif";
import rosterImg from "../images/roster.jfif";
import orgImg from "../images/orhanizationpolicies.jfif";
import askItImg from "../images/askit.jfif";
import askHrImg from "../images/askhr.jfif";
import corosolimg from "../images/corosolimg.jpg";

function Home() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Leaves Management",
      desc: "Smart Leave Management for Modern Teams",
      img: leaveImg,
      route: "/leave-request",
    },
    {
      title: "Payrolls",
      desc: "Reliable & Accurate Payroll Management",
      img: payrollImg,
      route: "/payroll",
    },
    {
      title: "Roster / Shift",
      desc: "Plan Shifts Smarter and Faster",
      img: rosterImg,
      route: "/schedule",
    },
    {
      title: "Organization Policies",
      desc: "Clear policies for a stronger organization",
      img: orgImg,
      route: "/organisation-policies",
    },
    {
      title: "Ask for IT",
      desc: "Report technical issues instantly",
      img: askItImg,
      route: "/ask-for-it",
    },
    {
      title: "Ask for HR",
      desc: "A simple way to communicate HR issues",
      img: askHrImg,
      route: "/ask-for-hr",
    },
  ];

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} className="logoimage" />
        </div>

        <div className="nav-links">
          <a
            role="button"
            tabIndex={0}
            onClick={() => navigate("/PatrolingSchedule")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                navigate("/PatrolingSchedule");
            }}
          >
            PATROLLING
          </a>
          <a
            role="button"
            tabIndex={0}
            onClick={() => navigate("/schedule")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/schedule");
            }}
          >
            OPERATIONS
          </a>

          <a
            role="button"
            tabIndex={0}
            onClick={() => navigate("/hrms")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/hrms");
            }}
          >
            HRMS
          </a>
          <a>MY TASK</a>
          <a>MY TICKETS</a>
          <div className="profile">👤</div>
        </div>
      </div>

      <div className="navbarbgc">
        <img src={corosolimg} className="hero-img" />

        <div className="hero-content">
          <div className="search-box">
            <input placeholder="What are you looking for?" />
            <button>Search</button>
          </div>
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

export default Home;
