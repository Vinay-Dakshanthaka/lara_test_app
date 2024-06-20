import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BsBoxArrowLeft, BsHouse, BsList, BsX } from 'react-icons/bs';
import './style.css'; // Import custom CSS for sidebar styles
import { Link } from 'react-router-dom';

const StudentNavBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
    }

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header_toggle" onClick={toggleSidebar}>
                    {sidebarOpen ? <BsBoxArrowLeft /> : <BsList />}
                </div>
                <div className="header_img">
                    <img src="" alt="Profile" />
                </div>
            </header>

            {/* Sidebar */}
            <div className={`l-navbar ${sidebarOpen ? 'show' : ''}`}>
                <nav className="nav">
                    <div>
                        <Link to="#" className="nav_logo">
                            <i className='bx bx-layer nav_logo-icon'></i>
                            <span className="nav_logo-name">LARA</span>
                        </Link>
                        <div className="nav_list">
                            {/* <a href="#" className="nav_link active">
                                <BsSpeedometer className='nav_icon' />
                                <span className="nav_name">Dashboard</span>
                            </a> */}
                            <Link to="#" className="nav_link">
                                <BsHouse className='nav_icon' />
                                <span className="nav_name">Home</span>
                            </Link>
                            {/* Add more links here as needed */}
                        </div>
                    </div>
                    <Link href="#" className="nav_link">
                        <BsBoxArrowLeft className='nav_icon' onClick={handleLogout} />
                        <span className="nav_name">SignOut</span>
                    </Link>
                    <div className="nav_toggle" onClick={toggleSidebar}>
                        {sidebarOpen ? <BsX className='border border-danger'/> : <BsList />}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default StudentNavBar;