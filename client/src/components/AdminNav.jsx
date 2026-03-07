import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    return (
        <nav className="home-navbar about-navbar" style={{ backgroundColor: '#2c2c31' }}>
            <div className="home-logo" style={{ cursor: 'default', color: '#ffffff' }}>
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
                <Link to="/admin/dashboard" className="home-nav-link" style={{ color: '#ffffff' }}>Dashboard</Link>
                <Link to="/admin/upload-result" className="home-nav-link" style={{ color: '#ffffff' }}>Upload Results</Link>
                <Link to="/admin/manage-subjects" className="home-nav-link" style={{ color: '#ffffff' }}>Manage Subjects</Link>
                <Link to="/admin/publish-results" className="home-nav-link" style={{ color: '#ffffff' }}>Publish Marks</Link>
                <Link to="/admin/attendance" className="home-nav-link" style={{ color: '#ffffff' }}>Attendance</Link>
                <Link to="/admin/risk-dashboard" className="home-nav-link" style={{ color: '#ffffff' }}>Monitoring</Link>
            </div>

            <button onClick={handleLogout} className="home-btn-primary" style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>
                Log out
            </button>
        </nav>
    );
};

export default AdminNav;
