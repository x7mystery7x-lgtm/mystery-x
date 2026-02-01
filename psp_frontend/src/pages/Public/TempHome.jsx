import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import './Home.css';

export default function Home() {
  return (
    <>
      <main className="home-page container py-12">
        <section className="hero-section">
          <div className="container hero-container">
            
            <div className="hero-content">
              <div className="greeting-wrapper">
                <span className="hero-greeting">Welcome to Mystery-X PSP</span>
              </div>
              
              <h1 className="hero-title">
                Professional Payment <br />
                <span>Management Simplified.</span>
              </h1>

              <div className="hero-badge">Trusted by 1000+ Clients</div>

              <p className="hero-lead mx-auto">
                A secure platform for managing client payments, tracking transactions, 
                and accessing professional payment services. Register today and manage your 
                account with ease.
              </p>
              
              <div className="hero-actions">
                <Link to="/register" className="btn-primary">Get Started</Link>
                <Link to="/services" className="btn-secondary">View Services →</Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <strong>24/7</strong>
                  <span>Account Access</span>
                </div>
                <div className="stat-item">
                  <strong>Secure</strong>
                  <span>JWT Authentication</span>
                </div>
                <div className="stat-item">
                  <strong>99.9%</strong>
                  <span>Uptime Guarantee</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-container">
                <div className="image-wrapper elevated">
                  {/* Dashboard preview image */}
                  <img src="/assets/psprovider.jpg" alt="PSP Dashboard" width="400" height="300" />
                  
                  {/* Status badge */}
                  <div className="floating-badge-large">
                    <div className="badge-icon">✓</div>
                    <div className="badge-text">
                      <span>Secure & Ready</span>
                      <strong>Account Created</strong>
                    </div>
                  </div>
                </div>
                
                {/* Decorative element to add depth */}
                <div className="visual-glow-background"></div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}