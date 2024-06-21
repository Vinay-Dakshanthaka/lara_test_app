//import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import UpdatePassword from './components/UpdatePassword';
import PasswordUpdateWarning from './components/PasswordUpdateWarning';
import Signup from './components/SignUp';
import Signin from './components/SignIn';
import Sidebar from './components/Sidebar';
import ResetPasswordEmail from './components/ResetPasswordEmail';
import ResetPassword from './components/ResetPassword';
import { useEffect, useState } from 'react';

import Dashboard from './components/Dashboard'; // Import the Dashboard component

const App = () => {
    const location = useLocation();
    const hideSidebarRoutes = ['/signin', '/signup'];
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsSignedIn(true);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsSignedIn(false);
        navigate('/signin');
    };

    const ProtectedRoute = ({ element }) => {
        if (!isSignedIn) {
            return <Navigate to="/signin" />;
        }
        return element;
    };

    return (
        <>
            {isSignedIn && !hideSidebarRoutes.includes(location.pathname) && <Sidebar onSignOut={handleSignOut} />}
            <Routes>
                <Route path="/signin" element={<Signin setIsSignedIn={setIsSignedIn} />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/password-update-warning" element={<PasswordUpdateWarning />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password-email" element={<ResetPasswordEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/" element={<Signin setIsSignedIn={setIsSignedIn} />} /> {/* Default route */}
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
