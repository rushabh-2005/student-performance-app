import React from 'react';
import { Link } from 'react-router-dom';

const Nav1 = () => {
    return (
        <nav className="home-navbar about-navbar">
            <Link to="/" className="home-logo">
                <span className="home-logo-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 14H10V20" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 10H14V4" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="11.5" y="11.5" width="1" height="1" fill="#FF6B00" />
                    </svg>
                </span>
                Student Performance App
            </Link>

            <div className="home-nav-links">
                <Link to="/about" className="home-nav-link">About</Link>
                <Link to="/register" className="home-nav-link">Register</Link>
                <Link to="/login/user" className="home-nav-link">Login</Link>
                <Link to="/parent-login" className="home-nav-link">Parent Login</Link>
                <Link to="/parent-register" className="home-nav-link">Parent Register</Link>
                <Link to="/login/admin" className="home-nav-link">Admin Login</Link>
            </div>

            <Link to="/register" className="home-btn-primary">
                Get Started
            </Link>
        </nav>
    );
};

export default Nav1;
