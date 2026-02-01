import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { adminAPI, paymentAPI, messageAPI } from '../../services/api';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPayments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    unreadMessages: 0,
    adminPayments: [],
    adminMessages: [],
    recentPayments: [],
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch clients count
      const clientsRes = await adminAPI.getClients();
      const clients = clientsRes.data.clients || [];

      // Fetch all payments data
      const paymentsRes = await paymentAPI.getAllPayments();
      const payments = paymentsRes.data.payments || [];

      // Fetch admin's own payments
      const adminPaymentsRes = await paymentAPI.getUserPayments();
      const adminPayments = adminPaymentsRes.data.payments || [];

      // Fetch all messages data
      const messagesRes = await messageAPI.getAllMessages();
      const messages = messagesRes.data.messages || [];

      // Fetch admin's own messages
      const adminMessagesRes = await messageAPI.getUserMessages();
      const adminMessages = adminMessagesRes.data.messages || [];

      // Calculate stats
      const totalRevenue = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const pendingPayments = payments.filter(p => p.status === 'unpaid').length;
      const unreadMessages = messages.filter(m => !m.isRead).length;

      // Get recent payments (last 5)
      const recentPayments = payments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Get recent messages (last 5)
      const recentMessages = messages
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalClients: clients.length,
        totalPayments: payments.length,
        totalRevenue,
        pendingPayments,
        unreadMessages,
        adminPayments,
        adminMessages,
        recentPayments,
        recentMessages
      });
    } catch (error) {
      // Error fetching dashboard data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">
            <div className="admin-empty-icon">⏳</div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Welcome back, {user?.name || 'Administrator'}</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--admin-primary), var(--admin-secondary))',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          🔧 ADMIN DASHBOARD - System Management Center
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <div className="admin-stat-value">{stats.totalClients}</div>
            <div className="admin-stat-label">Total Clients</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">💳</span>
            <div className="admin-stat-value">{stats.totalPayments}</div>
            <div className="admin-stat-label">Client Payments</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <div className="admin-stat-value">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="admin-stat-label">Total Revenue</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">⏳</span>
            <div className="admin-stat-value">{stats.pendingPayments}</div>
            <div className="admin-stat-label">Pending Payments</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">💬</span>
            <div className="admin-stat-value">{stats.unreadMessages}</div>
            <div className="admin-stat-label">Unread Messages</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">👤</span>
            <div className="admin-stat-value">{stats.adminPayments.length}</div>
            <div className="admin-stat-label">My Payments</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📝</span>
            <div className="admin-stat-value">{stats.adminMessages.length}</div>
            <div className="admin-stat-label">My Messages</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📊</span>
            <div className="admin-stat-value">
              {stats.totalPayments > 0 ? Math.round((stats.totalPayments / stats.totalClients) * 10) / 10 : 0}
            </div>
            <div className="admin-stat-label">Avg Payments/Client</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-main">
            <h2 style={{ marginTop: 0, marginBottom: 24, color: 'var(--admin-text)' }}>Client Payments Overview</h2>
            {stats.recentPayments.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayments.map(payment => (
                      <tr key={payment._id}>
                        <td>{payment.userId?.name || 'Unknown'}</td>
                        <td>₦{payment.amount?.toLocaleString() || '0'}</td>
                        <td>
                          <span className={`admin-status admin-status-${payment.status?.toLowerCase() || 'unpaid'}`}>
                            {payment.status || 'Unpaid'}
                          </span>
                        </td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/admin/payments`} className="admin-btn admin-btn-outline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty">
                <span className="admin-empty-icon">💳</span>
                <p>No client payments found</p>
              </div>
            )}

            {/* Admin's Own Payments Section */}
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 24, color: 'var(--admin-text)' }}>My Payments</h2>
              {stats.adminPayments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.adminPayments.slice(0, 5).map(payment => (
                        <tr key={payment._id}>
                          <td>{payment.description || 'Payment'}</td>
                          <td>₦{payment.amount?.toLocaleString() || '0'}</td>
                          <td>
                            <span className="admin-status admin-status-paid">
                              Paid
                            </span>
                          </td>
                          <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty">
                  <span className="admin-empty-icon">💰</span>
                  <p>No personal payments found</p>
                  <Link to="/admin/payments" className="admin-btn admin-btn-primary">
                    Make a Payment
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="admin-sidebar">
            <h3 style={{ marginTop: 0, marginBottom: 24, color: 'var(--admin-text)' }}>Client Messages</h3>
            {stats.recentMessages.length > 0 ? (
              <div>
                {stats.recentMessages.map(message => (
                  <div key={message._id} style={{
                    padding: '16px',
                    marginBottom: '12px',
                    background: 'rgba(124, 58, 237, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--admin-primary)' }}>
                        {message.fromUserId?.name || 'Unknown'}
                      </strong>
                      <small style={{ color: 'var(--admin-muted)' }}>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.9rem' }}>
                      {message.content?.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                <Link to="/admin/messages" className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  View All Messages
                </Link>
              </div>
            ) : (
              <div className="admin-empty">
                <span className="admin-empty-icon">💬</span>
                <p>No client messages found</p>
              </div>
            )}

            {/* Admin's Own Messages Section */}
            <div style={{ marginTop: 32 }}>
              <h3 style={{ marginBottom: 16, color: 'var(--admin-text)' }}>My Messages</h3>
              {stats.adminMessages.length > 0 ? (
                <div>
                  {stats.adminMessages.slice(0, 3).map(message => (
                    <div key={message._id} style={{
                      padding: '12px',
                      marginBottom: '8px',
                      background: 'rgba(255, 215, 0, 0.1)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--admin-text)', fontSize: '0.85rem' }}>
                          {message.toUserId?.name || 'Unknown'}
                        </strong>
                        <small style={{ color: 'var(--admin-muted)', fontSize: '0.75rem' }}>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p style={{ margin: 0, color: 'var(--admin-text)', fontSize: '0.8rem' }}>
                        {message.content?.substring(0, 60)}...
                      </p>
                    </div>
                  ))}
                  <Link to="/admin/messages" className="admin-btn admin-btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                    View My Messages
                  </Link>
                </div>
              ) : (
                <div className="admin-empty" style={{ padding: '20px 0' }}>
                  <span className="admin-empty-icon">📝</span>
                  <p style={{ fontSize: '0.9rem' }}>No personal messages</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 32 }}>
              <h3 style={{ marginTop: 0, marginBottom: 16, color: 'var(--admin-text)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/admin/clients" className="admin-btn admin-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  👥 Manage Clients
                </Link>
                <Link to="/admin/payments" className="admin-btn admin-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  💳 Manage Payments
                </Link>
                <Link to="/admin/messages" className="admin-btn admin-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  💬 Manage Messages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
