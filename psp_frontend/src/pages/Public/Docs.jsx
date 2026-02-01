import { Link } from 'react-router-dom';
import './Docs.css';

export default function Docs() {
  return (
    <div className="docs-page">
      <div className="container">
        <div className="docs-header">
          <h1>API Documentation</h1>
          <p>Complete technical documentation for integrating with Mystery-X PSP</p>
        </div>

        <div className="docs-intro">
          <div className="intro-card">
            <div className="intro-icon">🚀</div>
            <h2>Developer-Friendly API</h2>
            <p>
              Our RESTful API provides secure, reliable access to payment processing,
              account management, and transaction data with comprehensive documentation.
            </p>
          </div>
        </div>

        <div className="api-overview">
          <h2>API Overview</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <div className="overview-icon">🔗</div>
              <h3>RESTful Design</h3>
              <p>Standard HTTP methods with JSON responses</p>
            </div>
            <div className="overview-item">
              <div className="overview-icon">🔐</div>
              <h3>JWT Authentication</h3>
              <p>Secure token-based authentication</p>
            </div>
            <div className="overview-item">
              <div className="overview-icon">📊</div>
              <h3>Rate Limiting</h3>
              <p>Auth: 5 req/15min, General: 100 req/15min</p>
            </div>
            <div className="overview-item">
              <div className="overview-icon">🌐</div>
              <h3>CORS Enabled</h3>
              <p>Cross-origin requests supported</p>
            </div>
          </div>
        </div>

        <div className="api-endpoints">
          <h2>API Endpoints</h2>

          <div className="endpoint-section">
            <h3>🔐 Authentication</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/auth/login</div>
                <p>User authentication</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/auth/register</div>
                <p>User registration</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/auth/refresh</div>
                <p>Refresh access token</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/auth/logout</div>
                <p>User logout</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/auth/me</div>
                <p>Get current user info</p>
              </div>
            </div>
          </div>

          <div className="endpoint-section">
            <h3>💳 Payments</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/user/me/payments</div>
                <p>Get user payments</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/user/me/payments/mock-pay</div>
                <p>Create mock payment</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/admin/payments</div>
                <p>Get all payments (Admin)</p>
              </div>
              <div className="endpoint-card">
                <div className="method">PATCH</div>
                <div className="endpoint">/api/admin/payments/:id</div>
                <p>Update payment status (Admin)</p>
              </div>
            </div>
          </div>

          <div className="endpoint-section">
            <h3>💬 Messages</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/user/me/messages</div>
                <p>Get user messages</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/user/me/messages</div>
                <p>Send message</p>
              </div>
              <div className="endpoint-card">
                <div className="method">PATCH</div>
                <div className="endpoint">/api/user/me/messages/:id/read</div>
                <p>Mark message as read</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/admin/messages</div>
                <p>Get all messages (Admin)</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/admin/messages</div>
                <p>Send message to client (Admin)</p>
              </div>
            </div>
          </div>

          <div className="endpoint-section">
            <h3>👤 Profile & Address</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">PATCH</div>
                <div className="endpoint">/api/user/me/profile</div>
                <p>Update user profile</p>
              </div>
              <div className="endpoint-card">
                <div className="method">PATCH</div>
                <div className="endpoint">/api/user/me/password</div>
                <p>Change password</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/user/me/address</div>
                <p>Get user address</p>
              </div>
              <div className="endpoint-card">
                <div className="method">POST</div>
                <div className="endpoint">/api/user/me/address</div>
                <p>Create/update address</p>
              </div>
            </div>
          </div>

          <div className="endpoint-section">
            <h3>👑 Admin Management</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/admin/clients</div>
                <p>Get all clients</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/admin/clients/:id</div>
                <p>Get client by ID</p>
              </div>
              <div className="endpoint-card">
                <div className="method">PATCH</div>
                <div className="endpoint">/api/admin/clients/:id</div>
                <p>Update client</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/admin/dashboard/stats</div>
                <p>Get dashboard statistics</p>
              </div>
            </div>
          </div>

          <div className="endpoint-section">
            <h3>🌐 Public Information</h3>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/public/info</div>
                <p>Get company information</p>
              </div>
              <div className="endpoint-card">
                <div className="method">GET</div>
                <div className="endpoint">/api/public/health</div>
                <p>Health check</p>
              </div>
            </div>
          </div>
        </div>

        <div className="authentication-section">
          <h2>Authentication</h2>
          <div className="auth-content">
            <div className="auth-method">
              <h3>JWT Token Authentication</h3>
              <p>
                All protected API requests require a valid JWT access token in the Authorization header.
                Access tokens expire after 15 minutes. Use the refresh endpoint to get new access tokens.
              </p>
              <div className="code-block">
                <pre><code>Authorization: Bearer your_access_token_here</code></pre>
              </div>
            </div>

            <div className="auth-method">
              <h3>Refresh Tokens</h3>
              <p>
                Refresh tokens are stored in httpOnly cookies and are valid for 7 days.
                They are automatically used to generate new access tokens when they expire.
              </p>
              <div className="code-block">
                <pre><code>POST /api/auth/refresh
// No body needed - refresh token is in cookie</code></pre>
              </div>
            </div>

            <div className="auth-method">
              <h3>Session Cookies</h3>
              <p>
                For browser-based applications, session cookies are automatically managed.
                Include credentials in your requests for proper session handling.
              </p>
              <div className="code-block">
                <pre><code>fetch('/api/user/me/profile', &#123;
  method: 'PATCH',
  credentials: 'include',
  headers: &#123;
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token'
  &#125;,
  body: JSON.stringify(profileData)
&#125;)</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="response-formats">
          <h2>Response Formats</h2>
          <div className="format-examples">
            <div className="format-card">
              <h3>Success Response</h3>
              <div className="code-block">
                <pre><code>&#123;
  "success": true,
  "message": "Operation successful",
  "data": &#123; ... &#125;
&#125;</code></pre>
              </div>
            </div>
            <div className="format-card">
              <h3>Error Response</h3>
              <div className="code-block">
                <pre><code>&#123;
  "success": false,
  "error": "Error description"
&#125;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="sdk-section">
          <h2>SDKs & Libraries</h2>
          <h3>Available SDKs</h3>
          <div className="sdk-grid">
            <div className="sdk-card">
              <div className="sdk-icon">📱</div>
              <h4>JavaScript SDK</h4>
              <p>Official JavaScript library for easy integration</p>
              <button className="btn-secondary">Download</button>
            </div>
            <div className="sdk-card">
              <div className="sdk-icon">🐍</div>
              <h4>Python SDK</h4>
              <p>Python library for server-side integrations</p>
              <button className="btn-secondary">Download</button>
            </div>
            <div className="sdk-card">
              <div className="sdk-icon">☕</div>
              <h4>Java SDK</h4>
              <p>Java library for enterprise applications</p>
              <button className="btn-secondary">Coming Soon</button>
            </div>
            <div className="sdk-card">
              <div className="sdk-icon">📚</div>
              <h4>Postman Collection</h4>
              <p>Ready-to-use API collection for testing</p>
              <button className="btn-secondary">Download</button>
            </div>
          </div>
        </div>

        <div className="support-section">
          <h2>Developer Support</h2>
          <h3>Support Options</h3>
          <div className="support-content">
            <div className="support-item">
              <div className="support-icon">💬</div>
              <h4>Developer Forum</h4>
              <p>Join our community of developers</p>
              <a href="#" className="btn-secondary">Join Forum</a>
            </div>
            <div className="support-item">
              <div className="support-icon">📧</div>
              <h4>Email Support</h4>
              <p>dev-support@mystery-x.com</p>
              <a href="mailto:dev-support@mystery-x.com" className="btn-secondary">Email Us</a>
            </div>
            <div className="support-item">
              <div className="support-icon">📞</div>
              <h4>Technical Support</h4>
              <p>24/7 technical assistance</p>
              <a href="tel:+1234567890" className="btn-secondary">Call Now</a>
            </div>
          </div>
        </div>

        <div className="related-resources">
          <h2>Related Resources</h2>
          <h3>Explore More</h3>
          <div className="resource-grid">
            <Link to="/compliance" className="resource-card">
              <span className="resource-icon">📋</span>
              <div>
                <h4>Compliance</h4>
                <p>Security and regulatory information</p>
              </div>
            </Link>
            <Link to="/help" className="resource-card">
              <span className="resource-icon">❓</span>
              <div>
                <h4>Help Center</h4>
                <p>Common questions and answers</p>
              </div>
            </Link>
            <Link to="/services" className="resource-card">
              <span className="resource-icon">🛠️</span>
              <div>
                <h4>Our Services</h4>
                <p>Explore available services</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}