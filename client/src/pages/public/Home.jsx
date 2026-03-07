import React from 'react';
import { Link } from 'react-router-dom';
import '../../Css_Files/HomeCss.css';
import Nav1 from '../../components/nav1';
import Footer from '../../components/footer';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>

            <Nav1 />

            <main className="home-hero">


                <h1 className="home-title">
                    STUDENT ACADEMIC PERFORMANCE AND MONITORING APP.
                </h1>

                <p className="home-subtitle">
                    Check your exam score by giving your details
                </p>

                <div className="home-hero-buttons">
                    <Link to="/register" className="home-btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
                        Get Started
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;