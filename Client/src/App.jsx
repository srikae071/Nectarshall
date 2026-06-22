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
import Open from "./pages/Hrms/Open/index.jsx";
import Resolved from "../src/pages/Hrms/Resolved/index.jsx";
import Assingtome from "../src/pages/Hrms/Assigntome/index.jsx";
// import OnboardingCompliance from "../src/pages/Hrms/OnboardingCompliance/indeex.jsx";
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
import HomeLeaveStatus from "./pages/Home/LeaveManagement/LeaveManagementRightSide/HomeLeaveStatus/index.jsx";
import HomeLeaveRequest from "./pages/Home/LeaveManagement/LeaveManagementRightSide/HomeLeaveRequest/index.jsx";
import HomeLeaveBalance from "./pages/Home/LeaveManagement/LeaveManagementRightSide/HomeLeaveBalance/index.jsx";
import HomeLeaveCalendar from "./pages/Home/LeaveManagement/LeaveManagementRightSide/HomeLeaveCalender/index.jsx";
import MyTasks from "./pages/MyTasks/index.jsx";
import ITSaves from "./pages/Hrms/SavedForms/ITSaves/index.jsx";
import HRSaves from "./pages/Hrms/SavedForms/HRSaves/index.jsx";
import HRSavesCases from "./pages/Hrms/HRSavesCases/index.jsx";
import "./App.css";
import MyTickets from "./pages/NavItems/MyTickets/index.jsx";
import ItNavMain from "./pages/NavItems/IT/ItRightSide/ItNavMain/index.jsx";
import ITCreateNew from "./pages/NavItems/IT/ItRightSide/ITCreateNew/index.jsx";
import ItOpen from "./pages/NavItems/IT/ItRightSide/ItOpen/index.jsx";
import ItResolved from "./pages/NavItems/IT/ItRightSide/ItResolved/index.jsx";
import ItAssignedToMe from "./pages/NavItems/IT/ItRightSide/ItAssignedToMe/index.jsx";
import ItClosed from "./pages/NavItems/IT/ItRightSide/ItClosed/index.jsx";
import ItPending from "./pages/NavItems/IT/ItRightSide/ItPending/index.jsx";
import ItWorkInProgress from "./pages/NavItems/IT/ItRightSide/ItWorkInProgress/index.jsx";
import OnBoardingCompliance from "./pages/Hrms/OnBoarding/OnBoardingClinet/OnBoardingCompliance/indeex.jsx";
import OnBoardingResonanceRequirementsAll from "./pages/Hrms/OnBoarding/OnBoardingEmployee/ResonanceRequirements/OnBoardingResonanceRequirementsAll/index.jsx";
import OnBoardingResonanceRequirementsCreateNew from "./pages/Hrms/OnBoarding/OnBoardingEmployee/ResonanceRequirements/OnBoardingResonanceRequirementsCreateNew/index.jsx";
import OnBoardingResonanceRequirementsResolve from "./pages/Hrms/OnBoarding/OnBoardingEmployee/ResonanceRequirements/OnBoardingResonanceRequirementsResolve/index.jsx";
import OnBoardingSaves from "./pages/Hrms/OnBoarding/OnBoardingEmployee/OnBoardingSaves/index.jsx";
import ResonanceMain from "./pages/Home/Resonance/ResonanceMain/index.jsx";
import OnBoardingPreJoining from "./pages/Hrms/OnBoarding/OnBoardingPreJoining/index.jsx";
import OnBoardingOfferLetter from "./pages/Hrms/OnBoarding/OnBoardingOfferLetter/index.jsx";
import OnBoardingResolve from "./pages/Hrms/OnBoarding/OnBoardingResolve";
import OnBoardingEmReqAll from "./pages/Hrms/OnBoarding/OnBoardingEmpReqAll/index.jsx";
import EmployeeRequestSave from "./pages/Home/EmployeRequestSave/index.jsx";
import CandidateForm from "./pages/Hrms/OnBoarding/OnBoardingClinet/CandidateForm";
import Candidateform2 from "./pages/Hrms/OnBoarding/OnBoardingClinet/Candidateform2";
import OnBoardingComplianceSupplier from "./pages/Hrms/OnBoarding/OnBoardingSupplier/OnBoardingComplianceSupplier/indeex.jsx";
import Interview from "./pages/Hrms/OnBoarding/Interview/index.jsx";
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
      {/* <Route path="/onboarding/clint" element={<OnboardingCompliance />} /> */}

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
      <Route path="/askforit/:id" element={<MainAFI />} />
      <Route path="/askforit" element={<MainAFI />} />
      <Route path="/askforhr" element={<AskForHrMainPage />} />
      <Route path="/askforhr/:id" element={<AskForHrMainPage />} />
      <Route path="/home-leave-status" element={<HomeLeaveStatus />} />
      <Route path="/home-leave-request" element={<HomeLeaveRequest />} />
      <Route path="/home-leave-balance" element={<HomeLeaveBalance />} />
      <Route path="/home-leave-calendar" element={<HomeLeaveCalendar />} />
      <Route path="/my-tasks" element={<MyTasks />} />
      {/* <Route path="/hrms/itsaves" element={<ITSaves />} /> */}
      <Route path="/hrms/itsaves/:id" element={<ITSaves />} />
      <Route path="/hrms/hrsaves/:id" element={<HRSaves />} />
      <Route path="/hrms/hrsavescases" element={<HRSavesCases />} />
      <Route path="/my-tickets" element={<MyTickets />} />
      <Route path="/it" element={<ItNavMain />} />
      <Route path="/it/create-new" element={<ITCreateNew />} />
      <Route path="/it/open" element={<ItOpen />} />
      <Route path="/it/resolved" element={<ItResolved />} />
      <Route path="/it/closed" element={<ItClosed />} />
      <Route path="/it/assigned-to-me" element={<ItAssignedToMe />} />
      <Route path="/it/pending" element={<ItPending />} />
      <Route path="/it/work-in-progress" element={<ItWorkInProgress />} />
      <Route
        path="/Client/onboarding-compliance"
        element={<OnBoardingCompliance />}
      />
      <Route
        path="/onboarding/resonancerequirement/all"
        element={<OnBoardingResonanceRequirementsAll />}
      />
      <Route
        path="/onboarding/resonancerequirement/createnew"
        element={<OnBoardingResonanceRequirementsCreateNew />}
      />
      {/* <Route
        path="/onboarding/resonancerequirement/resolved"
        element={<OnBoardingResonanceRequirementsResolve />}
      /> */}
      <Route path="/onboarding-saves/:id" element={<OnBoardingSaves />} />
      <Route path="/Resonancereq" element={<ResonanceMain />} />

      <Route path="/onboarding/prejoining" element={<OnBoardingPreJoining />} />
      <Route
        path="/onboarding/Offerletter"
        element={<OnBoardingOfferLetter />}
      />
      <Route
        path="/onboarding/resonancerequirement/resolved"
        element={<OnBoardingResolve />}
      />
      <Route
        path="/onboarding/employerequest"
        element={<OnBoardingEmReqAll />}
      />
      <Route
        path="/employee-request-save/:id"
        element={<EmployeeRequestSave />}
      />
      <Route path="/candidate-form/:id" element={<CandidateForm />} />
      <Route
        path="/supplier/onboardingcompilence"
        element={<OnBoardingComplianceSupplier />}
      />
      <Route path="/onboarding/Interview" element={<Interview />} />
      <Route path="/Candidate-form2/:id" element={<Candidateform2 />} />
    </Routes>
  );
}

export default App;
