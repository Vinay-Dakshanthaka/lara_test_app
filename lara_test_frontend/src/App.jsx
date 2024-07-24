import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import UpdatePassword from "./components/UpdatePassword";
import PasswordUpdateWarning from "./components/PasswordUpdateWarning";
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import Sidebar from "./components/Sidebar";
import ResetPasswordEmail from "./components/ResetPasswordEmail";
import ResetPassword from "./components/ResetPassword";
import BulkSignup from "./components/admin/BulkSignup";
import AddSubject from "./components/admin/AddSubject";
import UpdateRole from "./components/admin/UpdateRole";
import CumulativeTest from "./components/admin/CumulativeTest";
import StudentDashboard from "./components/student/StudentDashboard";
import UpdateProfile from "./components/student/UpdateProfile";
import StudentCumulativeTest from "./components/student/StudentCumulativeTest";
import StartTest from "./components/student/StartTest";
import AllTestResults from "./components/student/AllTestResults";
import DetailedResult from "./components/student/DetailedResult";
import ProtectedRoute from "./ProtectedRoute";
import AllStudentDetails from "./components/admin/AllStudentDetails";
import DeleteAccount from "./components/DeleteAccount";
import UploadCompanies from "./components/companies/UploadCompanies";
import CompaniesList from "./components/companies/CompaniesList";
import AddAgent from "./components/companies/AddAgent";
import AddJobs from "./components/companies/AddJob";
import ViewJobs from "./components/companies/ViewJobs";
import WebinarList from "./components/companies/WebinarList";
import WebinarForm from "./components/companies/WebinarForm";
import AddDrive from "./components/companies/AddDrive";
import ViewDrives from "./components/companies/ViewDrives";
import AddJob from "./components/companies/AddJob";
import EditJob from "./components/companies/EditJob";
import ManageSkills from "./components/companies/ManageSkills";
import UpdateCompanies from "./components/companies/UpdateCompanies";
import ViewAgents from "./components/companies/ViewAgents";
import ViewInteractions from "./components/companies/ViewInteractions";
import ManageDrives from "./components/companies/ManageDrives";
import AllDrives from "./components/admin/AllDrives";
import ViewJobsByDriveId from "./components/companies/ViewJobsByDriveId";
import StudentsDriveInfo from "./components/admin/StudentsDriveInfo";
import CreateTestLink from "./components/placementTest/CreateTestLink";
import PlacementTest from "./components/student/PlacementTest";
import FetchResultsByTestId from "./components/placementTest/FetchResultsByTestId";
import PlacementTestError from "./components/placementTest/PlacementTestError";
import NotFound from "./components/NotFound";
import SendTestLink from "./components/placementTest/SendTestLink";
import FaceDetector from "./components/placementTest/FaceDetector";

const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/signin", "/signup", "/"];
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  return (
    <>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/test/:test_id" element={<PlacementTest />} />
        <Route path="/malpractice-detected" element={<PlacementTestError />} />
        <Route
          path="/password-update-warning"
          element={<PasswordUpdateWarning />}
        />
        <Route path="/reset-password-email" element={<ResetPasswordEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Signin />} /> 
        <Route path="/not-found" element={<NotFound />} /> 
        <Route path="/*" element={<NotFound />} /> 
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/update-role" element={<UpdateRole />} />
          <Route path="/bulk-signup" element={<BulkSignup />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/cumulative-test" element={<CumulativeTest />} />
          <Route
            path="/student-cumulative-test"
            element={<StudentCumulativeTest />}
          />
          <Route path="/start-test" element={<StartTest />} />
          <Route path="/all-test-results" element={<AllTestResults />} />
          <Route
            path="/all-test-results/:test_id"
            element={<DetailedResult />}
          />
          <Route path="/all-students-details" element={<AllStudentDetails />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/add-companies" element={<UploadCompanies />} />
          <Route
            path="/companies-list"
            element={
              <CompaniesList setSelectedCompanyId={setSelectedCompanyId} />
            }
          />
          {/* <Route path="/add-company-agent" element={<AddAgent />} /> */}

          {/* Routes added by Abhilash */}
          {/* <Route path="/add-job" element = {<AddJobs selectedCompanyId={selectedCompanyId}/>}/> */}
          <Route
            path="/add-drive"
            element={<AddDrive selectedCompanyId={selectedCompanyId} />}
          />
          {/* <Route path='/view-jobs/:company_id' element={<ViewJobs/>}/> */}
          <Route path="/view-drives/:company_id" element={<ViewDrives />} />
          <Route path="/add-webinar" element={<WebinarForm />} />
          <Route path="/webinar-list" element={<WebinarList />} />
          <Route path="/drives/:drive_id/jobs" element={<ViewJobs/>} />
          <Route path="/drives/all-jobs/:drive_id/jobs" element={<ViewJobsByDriveId/>} />
          <Route path="/drives/:drive_id/add-job" element={<AddJob/>} />
          <Route path="/jobs/:job_id/edit" element={<EditJob/>} />
          <Route path="/jobs/:job_id/skills" element={<ManageSkills/>} />
          <Route path="/update-company/:company_id" element={<UpdateCompanies/>}/>
          <Route path="/view-agents/:companyId" element={<ViewAgents/>} />
          <Route path="/add-agent/:companyId" element={<AddAgent />} />
          <Route path="/interactions" element={<ViewInteractions />} />
          <Route path="/manage-drives" element={<ManageDrives/>}/>
          <Route path="/drives" element={<AllDrives />} />
          <Route path="/all-students-drive-info" element={<StudentsDriveInfo />} />
          <Route path="/create-test-link" element={<CreateTestLink />} />
          <Route path="/get-result/:test_id" element={<FetchResultsByTestId />} />
          <Route path="/email-test-link/:placement_test_id" element={<SendTestLink />} />
          <Route path="/face-detector" element={<FaceDetector />} />
        </Route>
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
