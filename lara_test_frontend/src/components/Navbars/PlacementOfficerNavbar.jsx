import  { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { BsBoxArrowLeft, BsHouse, BsList, BsSpeedometer, BsX } from 'react-icons/bs';
import './style.css'; // Import custom CSS for sidebar styles
import { Link } from 'react-router-dom';

const PlacementOfficerNavbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                            <a href="#" className="nav_link active">
                                <BsSpeedometer className='nav_icon' />
                                <span className="nav_name">Dashboard</span>
                            </a>
                            <a href="#" className="nav_link">
                                <BsHouse className='nav_icon' />
                                <span className="nav_name">Home</span>
                            </a>
                            {/* Add more links here as needed */}
                        </div>
                    </div>
                    <a href="#" className="nav_link">
                        <BsBoxArrowLeft className='nav_icon' />
                        <span className="nav_name">SignOut</span>
                    </a>
                    <div className="nav_toggle" onClick={toggleSidebar}>
                        {sidebarOpen ? <BsX className='border border-danger'/> : <BsList />}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default PlacementOfficerNavbar;