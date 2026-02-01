import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import './RoleSelectionModal.css';

const RoleSelection = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Start with modal open
  const navigate = useNavigate();
  const modalRef = React.useRef(null);
  const triggerButtonRef = React.useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
    // Focus will be set in useEffect
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Focus will return to trigger button
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 100);
  };

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus the close button when modal opens
      setTimeout(() => {
        const closeButton = modalRef.current?.querySelector('.modal-close');
        closeButton?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleSelection = (type) => {
    console.log(`Selected account type: ${type}`);
    closeModal();
    const route = type === 'Company Admin' ? '/register/admin' : '/register/client';
    navigate(route);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🚀</div>
              <h1>Mystery-X PSP</h1>
            </div>
            <h2>Welcome to Our Platform</h2>
            <p>Professional Payment Solutions for Everyone</p>
          </div>

          <div className="get-started-section">
            <button
              className="get-started-btn"
              onClick={openModal}
              ref={triggerButtonRef}
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
            >
              Get Started
            </button>
          </div>

          <div className="auth-footer">
            <p>Already have an account?
              <Link to="/login" className="auth-link"> Sign In</Link>
            </p>
            <p>
              <Link to="/" className="auth-link">← Back to Homepage</Link>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <h3>Professional Payment Solutions</h3>
            <p>Whether you're an individual or managing a business, our platform provides secure and efficient payment processing tailored to your needs.</p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Enterprise Security</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Fast Processing</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Multi-Platform Access</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Tailored Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-subtitle"
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close role selection modal"
            >
              ×
            </button>
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">REGISTRATION</h2>
              <p id="modal-subtitle" className="modal-subtitle">Please choose type of account</p>
            </div>
            <div className="choice-cards" role="group" aria-labelledby="modal-title">
              <div
                className="choice-card"
                onClick={() => handleSelection('Company Admin')}
                role="button"
                tabIndex={0}
                aria-label="Select Company Admin account type"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelection('Company Admin');
                  }
                }}
              >
                <div className="choice-icon" aria-hidden="true">💼</div>
                <div className="choice-content">
                  <h3>Company Admin</h3>
                  <p>Manage client accounts and oversee payments</p>
                </div>
              </div>
              <div
                className="choice-card"
                onClick={() => handleSelection('Individual Client')}
                role="button"
                tabIndex={0}
                aria-label="Select Individual Client account type"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelection('Individual Client');
                  }
                }}
              >
                <div className="choice-icon" aria-hidden="true">👤</div>
                <div className="choice-content">
                  <h3>Individual Client</h3>
                  <p>Access personal payment services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;