import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BsBoxArrowLeft, BsHouse, BsList, BsPersonCircle, BsSpeedometer, BsX } from 'react-icons/bs';
import './style.css'; // Import custom CSS for sidebar styles
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logout Success');
        setTimeout(() => {
            navigate('/signin');
        }, 2000); // Delay for 2 seconds
    };

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        setIsLoggedIn(!!userLoggedIn);
        setRole(userRole);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header_toggle" onClick={toggleSidebar}>
                    {/* {sidebarOpen ? <BsBoxArrowLeft /> : <BsList />} */}
                </div>
                <div className="header_img">
                    <img src="..." alt="Profile" />
                </div>
            </header>

            {/* Sidebar */}
            <div className={`l-navbar ${sidebarOpen ? 'show' : ''}`}>
                <nav className="nav">
                    <div>
                        <Link  className="nav_logo mt-2">
                            {/* <i className='bx bx-layer nav_logo-icon'></i> */}
                            <span className="nav_logo-name mt-3">
                                <BsPersonCircle className='fs-4'/>
                            </span>
                        </Link>
                        <div className="nav_list">
                            {isLoggedIn && (role === 'SUPER ADMIN' || role === 'PLACEMENT OFFICER') && (
                                <Link to="/" className="nav_link active">
                                    <BsSpeedometer className="nav_icon" />
                                    <span className="nav_name">Dashboard</span>
                                </Link>
                            )}
                            <Link to="/" className="nav_link">
                                <BsHouse className='nav_icon' />
                                <span className="nav_name">Home</span>
                            </Link>
                            {/* Add more links here as needed */}
                        </div>
                    </div>
                    <div className="nav_link" onClick={handleLogout}>
                        <BsBoxArrowLeft className='nav_icon' style={{cursor:'pointer'}} />
                        <span className="nav_name" style={{cursor:'pointer'}}>SignOut</span>
                    </div>
                    <div className="nav_toggle" onClick={toggleSidebar}>
                        {sidebarOpen ? <BsX className='border border-danger' /> : <BsList />}
                    </div>
                </nav>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Sidebar;
