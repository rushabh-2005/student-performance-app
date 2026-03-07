import React from 'react';
import { Link } from 'react-router-dom';
import '../Css_Files/HomeCss.css'; // Make sure the footer styles are active globally when Footer is mounted

const Footer = () => {
    return (
        <footer className="home-footer">
            <div className="home-footer-content">
                <div className="home-footer-section">
                    <Link to="/" className="home-logo" style={{ color: "white", marginBottom: "1rem" }}>
                        <span className="home-logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 14H10V20" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 10H14V4" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="11.5" y="11.5" width="1" height="1" fill="#FF6B00" />
                            </svg>
                        </span>
                        Student Performance App
                    </Link>
                    <p className="home-footer-text">
                        A comprehensive platform designed to track, analyze, and monitor student academic performance, helping students achieve their educational goals.
                    </p>
                </div>
                <div className="home-footer-section">
                    <h4 className="home-footer-title">Quick Links</h4>
                    <ul className="home-footer-links">
                        <li><Link to="/about" className="home-footer-link">About Us</Link></li>
                        <li><Link to="/register" className="home-footer-link">Create Account</Link></li>
                        <li><Link to="/login/user" className="home-footer-link">Student Login</Link></li>
                    </ul>
                </div>
                <div className="home-footer-section">
                    <h4 className="home-footer-title">Contact Information</h4>
                    <p className="home-footer-text">Email: hodbca@gmail.com</p>
                    <p className="home-footer-text">Phone: 9999555555</p>
                    <p className="home-footer-text">Address: S.S. Agrawal College Campus, Devina Park Society, Gandevi Rd, Navsari, Gujarat 396445</p>
                </div>
            </div>
            <div className="home-footer-bottom">
                &copy; {new Date().getFullYear()} Student Performance App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
