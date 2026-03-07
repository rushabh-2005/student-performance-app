import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="home-navbar about-navbar" style={{ backgroundColor: '#2c2c31' }}>
            <div className="home-logo" style={{ cursor: 'default' }}>
                <span className="home-logo-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 14H10V20" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 10H14V4" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="11.5" y="11.5" width="1" height="1" fill="#FF6B00" />
                    </svg>
                </span>
                Student Performance App
            </div>

            <div className="home-nav-links">
                <Link to="/user/dashboard" className="home-nav-link">Dashboard</Link>
                <Link to="/user/view-results" className="home-nav-link">View Results</Link>
                <Link to="/user/internal-marks" className="home-nav-link">Internal Marks</Link>
                <Link to="/user/view-attendance" className="home-nav-link">Attendance</Link>
                <Link to="/user/full-marksheet" className="home-nav-link">Full Marksheet</Link>
                <Link to="/user/study-log" className="home-nav-link">Study Log</Link>
            </div>

            <button onClick={handleLogout} className="home-btn-primary" style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                Log out
            </button>
        </nav>
    );
};

export default UserNav;
