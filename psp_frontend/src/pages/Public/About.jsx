import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import './About.css'; // We'll create a dedicated CSS for cleaner code

export default function About() {
  return (
    <>
      <main className="about-page container py-12">
        <header className="about-header centered">
          {/* The greeting now has its own centered wrapper */}
          <div className="greeting-wrapper">
            <span className="hero-greeting">Our Mission & Vision</span>
          </div>
          
          <h1 className="hero-title">
            The Foundation of <br />
            <span>Mystery-X PSP.</span>
          </h1>
          
          <p className="hero-lead mx-auto">
            We are more than just a payment provider. We are the trusted digital infrastructure 
            powering secure payment management and seamless client-admin communications.
          </p>
        </header>

        <section className="mission-vision-grid">
          <div className="vision-card elevated">
            <div className="icon-circle">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To provide transparent, UUID-driven payment management solutions. 
              We prioritise data integrity through unique property identification 
              and secure JWT-protected environments.
            </p>
          </div>

          <div className="vision-card elevated">
            <div className="icon-circle">💳</div>
            <h2>Our Vision</h2>
            <p>
              To be the leading payment service provider for modern businesses, 
              simplifying payment processing and client management through 
              automated reporting and instant verification.
            </p>
          </div>
        </section>

        <section className="values-section">
          <h3 className="section-title">Core Operating Values</h3>
          <div className="values-grid">
            <div className="value-item">
              <strong>Security First</strong>
              <p>Utilizing JWT access and refresh strategy to ensure client data remains private.</p>
            </div>
            <div className="value-item">
              <strong>Unique Transparency</strong>
              <p>Every address is assigned a unique UUID for error-free payment tracking.</p>
            </div>
            <div className="value-item">
              <strong>Direct Communication</strong>
              <p>Encrypted messaging channels between our team and our clients.</p>
            </div>
          </div>
        </section>

        <section className="team-section centered">
          <h3 className="section-title">Leadership Team</h3>
          <div className="team-grid">
            <div className="team-card elevated">
              <div className="team-avatar lp">LP</div>
              <div className="team-info">
                <strong>Lawman P.</strong>
                <span className="muted">Founder & CEO</span>
              </div>
            </div>
            <div className="team-card elevated">
              <div className="team-avatar am">AM</div>
              <div className="team-info">
                <strong>Aisha M.</strong>
                <span className="muted">Head of Product</span>
              </div>
            </div>
            <div className="team-card elevated">
              <div className="team-avatar tn">TN</div>
              <div className="team-info">
                <strong>Tunde N.</strong>
                <span className="muted">CTO</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="cta-content">
            <p>Ready to streamline your payment management?</p>
            <Link to="/contact" className="btn-primary">Contact our team</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}