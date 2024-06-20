//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
//import Sidebar from './components/Sidebar';
// import StudentNavBar from './components/Navbars/StudentNavbar';
// import AdminNavbar from './components/Navbars/AdminNavabr';
// import PlacementOfficerNavbar from './components/Navbars/PlacementOfficerNavbar';
// import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
// import AdminNavbar from './components/Navbars/AdminNavabr';
// import PlacementOfficerNavbar from './components/Navbars/PlacementOfficerNavbar';


const App = () => {
    // const isLoggedIn = localStorage.getItem("token");
    // const role = localStorage.getItem("role");
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [role, setRole] = useState('');

    // useEffect(() => {
    // // Assuming you set 'isLoggedIn' and 'role' in localStorage upon login
    // const userLoggedIn = localStorage.getItem('token')
    // const userRole = localStorage.getItem('role');

    // setIsLoggedIn(userLoggedIn);
    // setRole(userRole);
    // },[]);
    return (
        <>
            <Router>
            {/* {isLoggedIn && 
            <>
                {role === 'SUPER ADMIN' && <AdminNavbar />}
                {role === 'PLACEMENT OFFICER' && <PlacementOfficerNavbar />}
                {role === 'STUDENT' && <StudentNavBar />}
            </>
            } */}
            {/* <PlacementOfficerNavbar/> */}
            <Sidebar/>
                <Routes>
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="/" element={<SignIn />} />
                    <Route path="#" element={<SignUp/>} />
                    <Route path="dashboard" element={<Dashboard/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
