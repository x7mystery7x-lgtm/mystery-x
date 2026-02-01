import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { paymentAPI, messageAPI } from '../../services/api';
import '../../styles/client.css';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext) || {};
  const [stats, setStats] = useState({
    balance: 0,
    due: 0,
    paymentsThisMonth: 0,
    unreadMessages: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch payments data
      const paymentsResponse = await paymentAPI.getUserPayments();
      const payments = paymentsResponse.data.payments || [];

      // Fetch messages data
      const messagesResponse = await messageAPI.getUserMessages();
      const messages = messagesResponse.data.messages || [];

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const paymentsThisMonth = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      }).length;

      const totalPaid = payments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);

      const totalDue = payments
        .filter(payment => payment.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0);

      const unreadMessages = messages.filter(message => !message.isRead).length;

      setStats({
        balance: totalPaid,
        due: totalDue,
        paymentsThisMonth,
        unreadMessages
      });

      // Get recent payments (last 5)
      const sortedPayments = payments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentPayments(sortedPayments);

      // Get recent messages (last 5)
      const sortedMessages = messages
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentMessages(sortedMessages);

    } catch (error) {
      // Error fetching dashboard data
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="client-page">
        <div className="client-container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-page">
      <div className="client-container">
        <div className="client-header">
          <div>
            <h1 className="client-title">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
            <p className="client-subtitle">Manage your profile, payments and messages</p>
          </div>
          <div className="client-actions">
            <Link to="/client/payments" className="client-btn client-btn-primary">
              💳 Make Payment
            </Link>
            <Link to="/client/profile" className="client-btn client-btn-secondary">
              👤 Edit Profile
            </Link>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--client-primary), var(--client-secondary))',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          👤 CLIENT DASHBOARD - Personal Account Center
        </div>

        <div className="client-stats">
          <div className="client-stat-card">
            <span className="client-stat-icon">💰</span>
            <div className="client-stat-value">{formatCurrency(stats.balance)}</div>
            <div className="client-stat-label">Total Paid</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">⏳</span>
            <div className="client-stat-value" style={{ color: stats.due > 0 ? 'var(--client-error)' : 'var(--client-success)' }}>
              {formatCurrency(stats.due)}
            </div>
            <div className="client-stat-label">Outstanding Due</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">📊</span>
            <div className="client-stat-value">{stats.paymentsThisMonth}</div>
            <div className="client-stat-label">Payments This Month</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">💬</span>
            <div className="client-stat-value">{stats.unreadMessages}</div>
            <div className="client-stat-label">Unread Messages</div>
          </div>
        </div>

        <div className="client-main">
          <div className="client-panel">
            <h3 className="client-panel-title">Recent Payments</h3>
            {recentPayments.length > 0 ? (
              <div className="client-list">
                {recentPayments.map(payment => (
                  <div key={payment._id} className="client-list-item">
                    <div className="client-list-content">
                      <div className="client-list-title">
                        Payment #{payment._id.slice(-6)}
                      </div>
                      <div className="client-list-meta">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="client-list-actions">
                      <div className="client-list-amount">
                        {formatCurrency(payment.amount)}
                      </div>
                      <span className={`client-status ${payment.status === 'paid' ? 'client-status-success' : 'client-status-warning'}`}>
                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="client-empty">
                <span className="client-empty-icon">💳</span>
                <p>No payments found</p>
              </div>
            )}
            <div className="client-panel-footer">
              <Link to="/client/payments" className="client-link">View all payments →</Link>
            </div>
          </div>

          <div className="client-panel">
            <h3 className="client-panel-title">Recent Messages</h3>
            {recentMessages.length > 0 ? (
              <div className="client-list">
                {recentMessages.map(message => (
                  <div key={message._id} className="client-list-item">
                    <div className="client-list-content">
                      <div className="client-list-title">
                        {message.subject || 'No Subject'}
                      </div>
                      <div className="client-list-meta">
                        {new Date(message.createdAt).toLocaleDateString()}
                        {!message.isRead && <span className="client-unread-dot"></span>}
                      </div>
                    </div>
                    <div className="client-list-actions">
                      <div className="client-list-preview">
                        {message.content?.slice(0, 50) || message.body?.slice(0, 50) || 'No content'}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="client-empty">
                <span className="client-empty-icon">💬</span>
                <p>No messages found</p>
              </div>
            )}
            <div className="client-panel-footer">
              <Link to="/client/messages" className="client-link">View all messages →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
