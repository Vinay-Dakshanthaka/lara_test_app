import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BsBoxArrowLeft, BsHouse, BsList, BsPen, BsPersonCircle, BsSpeedometer, BsX } from 'react-icons/bs';
import './style.css'; // Import custom CSS for sidebar styles
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileImage from './student/ProfileImage'
import { Accordion } from 'react-bootstrap';


const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

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

    useEffect(() => {
        if (sidebarOpen) {
            document.addEventListener('click', handleClickOutside, true);
        } else {
            document.removeEventListener('click', handleClickOutside, true);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [sidebarOpen]);

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header_toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? <BsBoxArrowLeft /> : <BsList />}
                </div>
                <div className="header_img">
                    {/* <img src="..." alt="Profile" /> */}
                    <ProfileImage/>
                </div>
            </header>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`l-navbar ${sidebarOpen ? 'show' : ''}`}>
                <nav className="nav">
                    <div>
                        <Link to="#" className="nav_logo mt-2">
                            <span className="nav_logo-name mt-3">
                                <BsPersonCircle className='fs-4' />
                            </span>
                        </Link>
                        <div className="nav_list">
                            {isLoggedIn && (role === 'SUPER ADMIN' || role === 'PLACEMENT OFFICER') && (
                                <Accordion className="custom-bg">
                                    <Accordion.Item eventKey="0" className='custom-bg accordion-item'>
                                        <Accordion.Header className="custom-bg ">
                                            <BsSpeedometer className="nav_icon" />
                                            <span className="nav_name ms-2">Dashboard</span>
                                        </Accordion.Header>
                                        <Accordion.Body className="custom-bg">
                                            <Link to="/update-role" className="nav_link custom-bg margin-bottom-0">
                                                <span className="nav_name custom-bg dropdown-link ">Update Role</span>
                                            </Link>
                                            <Link to="/bulk-signup" className="nav_link custom-bg margin-bottom-0">
                                                <span className="nav_name dropdown-link">Bulk Signup</span>
                                            </Link>
                                            {/* <Link to="/add-subject" className="nav_link custom-bg margin-bottom-0">
                                                <span className="nav_name dropdown-link">Add Subject</span>
                                            </Link> */}
                                            <Link to="/cumulative-test" className="nav_link custom-bg margin-bottom-0">
                                                <span className="nav_name dropdown-link">Cumulative Test</span>
                                            </Link>
                                            {/* Add more links here as needed */}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            )}
                        </div>
                        <Link to="/student-dashboard" className="nav_link">
                                <BsHouse className='nav_icon' />
                                <span className="nav_name">Home</span>
                        </Link>
                        <Link to="/student-cumulative-test" className="nav_link">
                                <BsPen className='nav_icon' />
                                <span className="nav_name">Write Test</span>
                        </Link>
                        
                    </div>
                    <div className="nav_link" onClick={handleLogout}>
                        <BsBoxArrowLeft className='nav_icon' style={{ cursor: 'pointer' }} />
                        <span className="nav_name" style={{ cursor: 'pointer' }}>Sign Out</span>
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
