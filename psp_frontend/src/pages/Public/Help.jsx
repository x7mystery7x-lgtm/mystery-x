import React from 'react';
import { Link } from 'react-router-dom';
import './Help.css';

export default function Help() {
  return (
    <div className="help-page">
      <div className="container">
        <div className="help-header">
          <h1>Help Center</h1>
          <p>Find answers to common questions and get support for your account</p>
        </div>

        <div className="help-grid">
          <div className="help-section">
            <div className="help-icon">💳</div>
            <h3>Making Payments</h3>
            <p>Learn how to make secure payments and track your transaction history.</p>
            <ul>
              <li>How to make a payment</li>
              <li>Payment methods accepted</li>
              <li>Viewing payment history</li>
              <li>Payment confirmation</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-icon">👤</div>
            <h3>Account Management</h3>
            <p>Manage your profile, security settings, and account preferences.</p>
            <ul>
              <li>Updating profile information</li>
              <li>Changing password</li>
              <li>Account security</li>
              <li>Two-factor authentication</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-icon">💬</div>
            <h3>Messages & Communication</h3>
            <p>Stay connected with our support team and manage your messages.</p>
            <ul>
              <li>Sending messages to support</li>
              <li>Viewing message history</li>
              <li>Message notifications</li>
              <li>Response times</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-icon">🔒</div>
            <h3>Security & Privacy</h3>
            <p>Your security is our priority. Learn about our protection measures.</p>
            <ul>
              <li>Data encryption</li>
              <li>Secure payment processing</li>
              <li>Privacy policy</li>
              <li>Account protection</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-icon">📊</div>
            <h3>Reports & Analytics</h3>
            <p>Access detailed reports and analytics for your account activity.</p>
            <ul>
              <li>Payment reports</li>
              <li>Transaction analytics</li>
              <li>Exporting data</li>
              <li>Custom date ranges</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-icon">⚙️</div>
            <h3>Troubleshooting</h3>
            <p>Common issues and how to resolve them quickly.</p>
            <ul>
              <li>Login problems</li>
              <li>Payment failures</li>
              <li>Browser compatibility</li>
              <li>Mobile app issues</li>
            </ul>
          </div>
        </div>

        <div className="help-contact">
          <h2>Still Need Help?</h2>
          <p>Our support team is here to assist you 24/7.</p>
          <div className="contact-options">
            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h4>Live Chat</h4>
              <p>Chat with our support team in real-time</p>
              <button className="btn-primary">Start Chat</button>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4>Email Support</h4>
              <p>Send us an email and we'll respond within 24 hours</p>
              <a href="mailto:support@mystery-x.com" className="btn-secondary">Email Us</a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h4>Phone Support</h4>
              <p>Speak directly with our support specialists</p>
              <a href="tel:+1234567890" className="btn-secondary">Call Now</a>
            </div>
          </div>
        </div>

        <div className="help-resources">
          <h2>Additional Resources</h2>
          <div className="resource-links">
            <Link to="/compliance" className="resource-link">
              <span className="resource-icon">📋</span>
              <div>
                <h4>Compliance & Regulations</h4>
                <p>Learn about our compliance standards and regulatory requirements</p>
              </div>
            </Link>
            <Link to="/docs" className="resource-link">
              <span className="resource-icon">📚</span>
              <div>
                <h4>API Documentation</h4>
                <p>Technical documentation for developers integrating with our platform</p>
              </div>
            </Link>
            <Link to="/services" className="resource-link">
              <span className="resource-icon">🛠️</span>
              <div>
                <h4>Our Services</h4>
                <p>Explore all the services and features we offer</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}