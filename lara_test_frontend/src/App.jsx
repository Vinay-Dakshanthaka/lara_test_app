import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UpdatePassword from './components/UpdatePassword';
import PasswordUpdateWarning from './components/PasswordUpdateWarning';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import Sidebar from './components/Sidebar';
import ResetPasswordEmail from './components/ResetPasswordEmail';
import ResetPassword from './components/ResetPassword';
import BulkSignup from './components/admin/BulkSignup';
import AddSubject from './components/admin/AddSubject';
import UpdateRole from './components/admin/UpdateRole';
import CumulativeTest from './components/admin/CumulativeTest';
import StudentDashboard from './components/student/StudentDashboard';
import UpdateProfile from './components/student/UpdateProfile';
import StudentCumulativeTest from './components/student/StudentCumulativeTest';
import StartTest from './components/student/StartTest';
import AllTestResults from './components/student/AllTestResults';
import DetailedResult from './components/student/DetailedResult';
import ProtectedRoute from './ProtectedRoute';
import AllStudentDetails from './components/admin/AllStudentDetails';

const App = () => {
    const location = useLocation();
    const hideSidebarRoutes = ['/signin', '/signup', '/'];

    return (
        <>
            {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/password-update-warning" element={<PasswordUpdateWarning />} />
                <Route path="/reset-password-email" element={<ResetPasswordEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Signin />} /> {/* Default route */}

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/update-role" element={<UpdateRole />} />
                    <Route path="/bulk-signup" element={<BulkSignup />} />
                    <Route path="/add-subject" element={<AddSubject />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/update-profile" element={<UpdateProfile />} />
                    <Route path="/cumulative-test" element={<CumulativeTest />} />
                    <Route path="/student-cumulative-test" element={<StudentCumulativeTest />} />
                    <Route path="/start-test" element={<StartTest />} />
                    <Route path="/all-test-results" element={<AllTestResults />} />
                    <Route path="/all-test-results/:test_id" element={<DetailedResult />} />
                    <Route path="/all-students-details" element={<AllStudentDetails />} />
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
