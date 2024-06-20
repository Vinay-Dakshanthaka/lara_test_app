import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/admin/AdminDashboard';


const App = () => {
    return (
        <>
            <Sidebar />
            <Router>
                <Routes>
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/" element={<SignIn />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
