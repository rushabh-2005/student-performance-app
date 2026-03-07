import React from 'react';
import { Link } from 'react-router-dom';
import '../../Css_Files/HomeCss.css';
import '../../Css_Files/AboutCss.css';
import AboutImg from '../../Logos/About.png';
import LogoImg from '../../Logos/Logo.png';
import Nav1 from '../../components/nav1';
import Footer from '../../components/footer';

const About = () => {
    return (
        <div className="home-container">
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            {/* Customized Navbar for About Page */}
            <Nav1 />

            <main>
                {/* Hero Banner Section (Replicating Image 1 Layout) */}
                <section className="about-hero-section">
                    <div className="about-hero-overlay"></div>
                    <div className="about-hero-content">
                        <h2 className="about-hero-title">About us</h2>
                    </div>
                </section>

                {/* Discover About Us Section (Replicating Image 2 Layout) */}
                <section className="about-discover-section">
                    <div className="about-discover-header">
                        <div className="about-discover-subtitle">Discover</div>
                        <h2 className="about-discover-title">Our Site </h2>
                    </div>

                    <div className="about-grid">
                        <div className="about-images-wrapper">
                            <img
                                src={AboutImg}
                                alt="Students group"
                                className="about-image-back"
                            />
                            <img
                                src={LogoImg}
                                alt="System Dashboard"
                                className="about-image-front"
                            />
                        </div>

                        <div className="about-text-content">
                            <p>
                                This is a student performance and monitoring app. It is a web application that is used to track and monitor the performance of students. It is a web application that is used to track and monitor the performance of students.

                            </p>

                            <ul className="about-features-list">
                                <li>Notifies the parents about the result</li>
                                <li>Student can check their results.</li>
                                <li>Student can check their current semester as well as past semester results.</li>
                                <li>Student can predict their exam score according to the study pattern.</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            {/* Same Footer as Home */}
            <Footer />
        </div>
    );
};

export default About;