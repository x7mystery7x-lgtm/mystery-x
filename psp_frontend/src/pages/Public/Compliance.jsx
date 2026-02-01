import React from 'react';
import { Link } from 'react-router-dom';
import './Compliance.css';

export default function Compliance() {
  return (
    <div className="compliance-page">
      <div className="container">
        <div className="compliance-header">
          <h1>Compliance & Regulatory Information</h1>
          <p>Our commitment to security, compliance, and regulatory standards</p>
        </div>

        <div className="compliance-intro">
          <div className="intro-card">
            <div className="intro-icon">🛡️</div>
            <h2>Your Security is Our Priority</h2>
            <p>
              Mystery-X PSP maintains the highest standards of security and compliance
              to protect your data and ensure regulatory adherence across all operations.
            </p>
          </div>
        </div>

        <div className="compliance-grid">
          <div className="compliance-section">
            <div className="section-icon">🔒</div>
            <h3>PCI DSS Compliance</h3>
            <p>
              We are fully compliant with Payment Card Industry Data Security Standards (PCI DSS),
              ensuring secure handling of payment card information.
            </p>
            <ul>
              <li>Level 1 PCI DSS certification</li>
              <li>Annual security assessments</li>
              <li>Regular vulnerability testing</li>
              <li>Secure payment processing</li>
            </ul>
          </div>

          <div className="compliance-section">
            <div className="section-icon">🇳🇬</div>
            <h3>CBN Regulations</h3>
            <p>
              Compliant with Central Bank of Nigeria regulations for payment service providers,
              including licensing and operational requirements.
            </p>
            <ul>
              <li>CBN Payment Service Provider license</li>
              <li>Anti-Money Laundering (AML) compliance</li>
              <li>Know Your Customer (KYC) procedures</li>
              <li>Regulatory reporting</li>
            </ul>
          </div>

          <div className="compliance-section">
            <div className="section-icon">🔐</div>
            <h3>Data Protection</h3>
            <p>
              We implement comprehensive data protection measures to safeguard your personal
              and financial information in accordance with global standards.
            </p>
            <ul>
              <li>End-to-end encryption</li>
              <li>GDPR compliance</li>
              <li>Regular security audits</li>
              <li>Data minimization practices</li>
            </ul>
          </div>

          <div className="compliance-section">
            <div className="section-icon">📊</div>
            <h3>Risk Management</h3>
            <p>
              Our robust risk management framework ensures operational resilience
              and protects against potential threats and vulnerabilities.
            </p>
            <ul>
              <li>Continuous monitoring</li>
              <li>Incident response planning</li>
              <li>Business continuity planning</li>
              <li>Regular risk assessments</li>
            </ul>
          </div>

          <div className="compliance-section">
            <div className="section-icon">👥</div>
            <h3>Customer Protection</h3>
            <p>
              We prioritize customer rights and provide clear policies for dispute resolution,
              refunds, and customer service excellence.
            </p>
            <ul>
              <li>Clear terms of service</li>
              <li>Dispute resolution process</li>
              <li>Customer complaint handling</li>
              <li>Refund policies</li>
            </ul>
          </div>

          <div className="compliance-section">
            <div className="section-icon">📋</div>
            <h3>Audit & Reporting</h3>
            <p>
              Regular independent audits and comprehensive reporting ensure transparency
              and accountability in all our operations.
            </p>
            <ul>
              <li>Annual independent audits</li>
              <li>Regulatory reporting</li>
              <li>Transparency reports</li>
              <li>Performance metrics</li>
            </ul>
          </div>
        </div>

        <div className="certifications">
          <h2>Certifications & Accreditations</h2>
          <div className="cert-grid">
            <div className="cert-item">
              <div className="cert-icon">💳</div>
              <h4>PCI DSS Level 1</h4>
              <p>Highest level of payment card security compliance</p>
            </div>
            <div className="cert-item">
              <div className="cert-icon">🇳🇬</div>
              <h4>CBN Licensed</h4>
              <p>Authorized Payment Service Provider</p>
            </div>
            <div className="cert-item">
              <div className="cert-icon">🔒</div>
              <h4>ISO 27001</h4>
              <p>Information Security Management System</p>
            </div>
            <div className="cert-item">
              <div className="cert-icon">🛡️</div>
              <h4>SOC 2 Type II</h4>
              <p>Security, Availability, and Confidentiality</p>
            </div>
          </div>
        </div>

        <div className="compliance-contact">
          <h2>Questions About Compliance?</h2>
          <p>
            If you have questions about our compliance measures or need more detailed
            information about our regulatory adherence, please contact our compliance team.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Compliance Officer:</span>
              <span>compliance@mystery-x.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span>+234 (0) 123 456 7890</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Response Time:</span>
              <span>Within 24 hours</span>
            </div>
          </div>
        </div>

        <div className="related-links">
          <h2>Related Information</h2>
          <div className="link-grid">
            <Link to="/help" className="info-link">
              <span className="link-icon">❓</span>
              <div>
                <h4>Help Center</h4>
                <p>Get answers to common questions</p>
              </div>
            </Link>
            <Link to="/docs" className="info-link">
              <span className="link-icon">📚</span>
              <div>
                <h4>API Documentation</h4>
                <p>Technical integration guides</p>
              </div>
            </Link>
            <Link to="/contact" className="info-link">
              <span className="link-icon">📞</span>
              <div>
                <h4>Contact Us</h4>
                <p>Reach out to our team</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}