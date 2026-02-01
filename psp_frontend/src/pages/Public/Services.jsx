import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import './Services.css';

export default function Services() {
  const servicesList = [
    {
      icon: "👤",
      title: "Client Registration & Profiles",
      description: "Secure sign-up with email verification, password policy enforcement, and comprehensive profile management for all client data."
    },
    {
      icon: "🏠",
      title: "Address & UUID Management",
      description: "Capture and manage client addresses with automatic UUID generation for unique property identification and payment routing."
    },
    {
      icon: "💳",
      title: "Monthly Payment Tracking",
      description: "Mock payment records with monthly status tracking, allowing clients to view paid/unpaid statuses and initiate payments securely."
    },
    {
      icon: "💬",
      title: "Secure Client Messaging",
      description: "Encrypted communication channels between clients and administrators, with in-app notifications for payment updates and messages."
    },
    {
      icon: "🔒",
      title: "JWT Authentication & Security",
      description: "Industry-standard authentication with short-lived access tokens, refresh strategies, and role-based access control for clients and admins."
    },
    {
      icon: "📊",
      title: "Admin Dashboard & Analytics",
      description: "Professional dashboard for administrators to manage clients, filter payments by month, UUID, or email, and export data for reporting."
    },
    {
      icon: "🛡️",
      title: "Compliance & Audit Trails",
      description: "Full compliance with security standards, including PCI-DSS, audit logging of admin actions, and secure data protection measures."
    },
    {
      icon: "📋",
      title: "API & Integration Services",
      description: "RESTful API endpoints for seamless integration, with comprehensive documentation for developers and automated payment processing."
    }
  ];

  return (
    <>
      <main className="services-page container py-12">
        <header className="services-header centered">
          <div className="greeting-wrapper">
            <span className="hero-greeting">Our Services</span>
          </div>
          
          <h1 className="hero-title">
            Professional Payment <br />
            <span>Management Solutions.</span>
          </h1>
          
          <p className="hero-lead mx-auto">
            Mystery-X PSP provides comprehensive payment management services for clients, 
            featuring secure authentication, unique address identification, and robust 
            administrative tools for efficient operations.
          </p>
        </header>

        <section className="services-grid-section">
          <div className="services-grid">
            {servicesList.map((service, index) => (
              <div key={index} className="service-card elevated">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="muted">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <h3 className="section-title">Key Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <strong>24/7 Secure Access</strong>
              <p>Round-the-clock account access with JWT-protected sessions.</p>
            </div>
            <div className="feature-item">
              <strong>Unique UUID System</strong>
              <p>Automated UUID generation for error-free payment identification.</p>
            </div>
            <div className="feature-item">
              <strong>Real-time Notifications</strong>
              <p>Instant updates on payment status and administrative messages.</p>
            </div>
            <div className="feature-item">
              <strong>Export & Reporting</strong>
              <p>CSV exports and professional reporting for payment data.</p>
            </div>
          </div>
        </section>

        <section className="services-cta centered">
          <h3>Ready to get started?</h3>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">Create Account</Link>
            <Link to="/contact" className="btn-secondary">Contact Support</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}