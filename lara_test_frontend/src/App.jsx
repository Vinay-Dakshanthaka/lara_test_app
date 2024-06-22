import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UpdatePassword from './components/UpdatePassword';
import PasswordUpdateWarning from './components/PasswordUpdateWarning';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import Sidebar from './components/Sidebar';
import ResetPasswordEmail from './components/ResetPasswordEmail';
import ResetPassword from './components/ResetPassword';
// import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import BulkSignup from './components/admin/BulkSignup';

const App = () => {
    const location = useLocation();
    const hideSidebarRoutes = ['/signin', '/signup', '/'];

    return (
        <>
            {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/password-update-warning" element={<PasswordUpdateWarning />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password-email" element={<ResetPasswordEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/bulk-signup" element={<BulkSignup />} />
                {/* <Route path="/admin/create-accounts" element={<BulkSignup />} /> */}
                <Route path="/" element={<Signin />} /> {/* Default route */}
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
