import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LeaveRequest from "./pages/LeaveRequest/LeaveRequest";
import LeaveBalance from "./pages/LeaveBalance/LeaveBalance";
import LeaveCalendar from "./pages/LeaveCalendar/LeaveCalendar";
import LeaveStatus from "./pages/LeaveStatus/LeaveStatus";
import PayrollMain from "./pages/PayrollPage/PayrollMain";
import OrganisationPolicies from "./pages/OrganisationPolicies/OpMainPage/index.jsx";
import MainAFI from "./pages/AskFORITPage/MainAFI";
import AskForHrMainPage from "./pages/AskForHrPage/AskForHrMainPage";
import HrmsHome from "../src/pages/Hrms/HrmsHome.jsx";
import Createnew from "../src/pages/Hrms/Createnew/index.jsx";
import Open from "../src/pages/Hrms/Open/index.jsx";
import Resolved from "../src/pages/Hrms/Resolved/index.jsx";
import Assingtome from "../src/pages/Hrms/Assigntome/index.jsx";
import OnboardingCompliance from "../src/pages/Hrms/OnboardingCompliance/indeex.jsx";
import All from "../src/pages/Hrms/Employee/ResourceRequirement/All/index.jsx";
import EmployeeCreateNew from "../src/pages/Hrms/Employee/ResourceRequirement/EmployeeCreateNew/index.jsx";
import EmployeeResolved from "../src/pages/Hrms/Employee/ResourceRequirement/EmployeeResolved/index.jsx";
import PreAll from "../src/pages/Hrms/Employee/PreJoiningCompliance/PreAll/index.jsx";
import PreEmployeeCreateNew from "../src/pages/Hrms/Employee/PreJoiningCompliance/PreEmployeeCreateNew/index.jsx";
import PreEmployeeResolved from "../src/pages/Hrms/Employee/PreJoiningCompliance/PreEmployeeResolved/index.jsx";
import OfferLetter from "../src/pages/Hrms/Employee/OfferLetter/index.jsx";
// import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import Schedule from "./pages/Dashboard/DashboardRightLayout/Schedule/index.jsx";

import TimeSheat from "./pages/Dashboard/DashboardRightLayout/TimeSheat";
import Employeesites from "./pages/Dashboard/DashboardRightLayout/Employessites/index.jsx";
import Reportss from "./pages/Dashboard/DashboardRightLayout/Reportss/index.jsx";
import Incidents from "./pages/Dashboard/DashboardRightLayout/Incidents/index.jsx";
import MainDashboard from "./pages/Dashboard/DashboardRightLayout/MainDashboard/index.jsx";
import PatrollingSchedule from "./pages/Patrolling/PatrollingRightContent/PatrollingSchedule/index.jsx";
import PatrollingMainDashboard from "./pages/Patrolling/PatrollingRightContent/PatrollingMainDashboard/index.jsx";
import PatrollingTimesheets from "./pages/Patrolling/PatrollingRightContent/PatrollingTimeSheat/index.jsx";
import PatrollingSites from "./pages/Patrolling/PatrollingRightContent/PatrollingEmployessites/index.jsx";
import PatrollingReports from "./pages/Patrolling/PatrollingRightContent/PatrollingReportss/index.jsx";
import PatrollingIncidents from "./pages/Patrolling/PatrollingRightContent/PatrollingIncidents/index.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leave-request" element={<LeaveRequest />} />
      <Route path="/leave-balance" element={<LeaveBalance />} />
      <Route path="/leave-calendar" element={<LeaveCalendar />} />
      <Route path="/leave-status" element={<LeaveStatus />} />
      <Route path="/payroll" element={<PayrollMain />} />
      <Route path="/hrms" element={<HrmsHome />} />
      <Route path="/hrms/createnew" element={<Createnew />} />
      <Route path="/hrms/open" element={<Open />} />
      <Route path="/hrms/resolved-cases" element={<Resolved />} />
      <Route path="/hrms/assigned-cases" element={<Assingtome />} />
      <Route path="/onboarding/clint" element={<OnboardingCompliance />} />
      <Route path="/onboarding/resonance/all" element={<All />} />
      <Route
        path="/onboarding/resonance/create"
        element={<EmployeeCreateNew />}
      />
      <Route
        path="/onboarding/resonance/resolve"
        element={<EmployeeResolved />}
      />
      <Route path="/onboarding/prejoining/all" element={<PreAll />} />
      <Route path="/onboarding/prejoining/create" element={<Createnew />} />
      <Route
        path="/onboarding/prejoining/resolve"
        element={<PreEmployeeResolved />}
      />
      <Route path="/onboarding/offer-letter" element={<OfferLetter />} />
      <Route path="/organisation-policies" element={<OrganisationPolicies />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/timesheets" element={<TimeSheat />} />
      <Route path="/employe-sites" element={<Employeesites />} />
      <Route path="/reports" element={<Reportss />} />
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/main-dashboard" element={<MainDashboard />} />
      <Route path="/ask-for-it" element={<MainAFI />} />
      <Route path="/ask-for-hr" element={<AskForHrMainPage />} />

      <Route path="/PatrolingSchedule" element={<PatrollingSchedule />} />
      <Route
        path="/PatrollingMainDashboard"
        element={<PatrollingMainDashboard />}
      />
      <Route path="/PatrollingTimesheets" element={<PatrollingTimesheets />} />
      <Route path="/PatrollingSites" element={<PatrollingSites />} />
      <Route path="/PatrollingReports" element={<PatrollingReports />} />
      <Route path="/PatrollingIncidents" element={<PatrollingIncidents />} />
    </Routes>
  );
}

export default App;
