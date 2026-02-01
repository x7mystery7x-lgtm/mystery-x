import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col brand-col">
          <div className="footer-logo">Mystery-X PSP</div>
          <p className="footer-description">Secure, professional payment management solutions for modern businesses.</p>
          <div className="footer-badge-grid">
            <span className="secure-badge">🔒 PCI-DSS Secure</span>
            <span className="secure-badge">✓ Certified Provider</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul className="footer-links">
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/compliance">Compliance</Link></li>
            <li><Link to="/docs">API Docs</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-inner">
          <p>© {new Date().getFullYear()} Mystery-X PSP</p>
          <div className="footer-contact">
            <span>support@mystery-x.com</span>
            <span>System Status: Operational</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}