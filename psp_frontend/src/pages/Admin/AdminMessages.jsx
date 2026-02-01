import React, { useEffect, useState } from 'react';
import { messageAPI, adminAPI } from '../../services/api';
import '../../styles/admin.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ userId: '', isRead: '' });
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', content: '' });
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchClients();
  }, []);

  useEffect(() => {
    // Auto-apply filters when they change
    const timeoutId = setTimeout(() => {
      fetchMessages();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.userId) params.userId = filters.userId;
      if (filters.isRead) params.isRead = filters.isRead;

      const response = await messageAPI.getAllMessages(params);
      setMessages(response.data.messages || []);
    } catch (error) {
      // Error fetching messages
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await adminAPI.getClients();
      setClients(response.data.clients || []);
    } catch (error) {
      // Error fetching clients
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await messageAPI.sendAdminMessage({
        toUserId: newMessage.to,
        subject: newMessage.subject,
        body: newMessage.content
      });
      setNewMessage({ to: '', subject: '', content: '' });
      setShowSendModal(false);
      fetchMessages();
      alert('Message sent successfully');
    } catch (error) {
      // Error sending message
      alert('Failed to send message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      await messageAPI.deleteMessage(id);
      fetchMessages();
      alert('Message deleted successfully');
    } catch (error) {
      // Error deleting message
      alert('Failed to delete message');
    }
  };

  const clearFilters = () => {
    setFilters({ userId: '', isRead: '' });
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  const getClientName = (userId) => {
    const client = clients.find(c => c._id === userId);
    return client ? client.name : 'Unknown Client';
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Message Management</h1>
            <p className="admin-subtitle">Communicate with clients and manage message history</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" onClick={fetchMessages}>
              🔄 Refresh
            </button>
            <button className="admin-btn admin-btn-secondary" onClick={() => setShowSendModal(true)}>
              ✉️ Send Message
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💬</span>
            <div className="admin-stat-value">{messages.length}</div>
            <div className="admin-stat-label">Total Messages</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📬</span>
            <div className="admin-stat-value">{getUnreadCount()}</div>
            <div className="admin-stat-label">Unread Messages</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <div className="admin-stat-value">{clients.length}</div>
            <div className="admin-stat-label">Total Clients</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📊</span>
            <div className="admin-stat-value">
              {messages.length > 0 ? Math.round((messages.filter(m => m.isRead).length / messages.length) * 100) : 0}%
            </div>
            <div className="admin-stat-label">Read Rate</div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-filter-group">
            <select
              name="userId"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              className="admin-form-control"
              style={{ width: '200px' }}
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>
          <div className="admin-filter-group">
            <select
              name="isRead"
              value={filters.isRead}
              onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
              className="admin-form-control"
              style={{ width: '150px' }}
            >
              <option value="">All Messages</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={clearFilters}>
            🗑️ Clear
          </button>
        </div>

        <div className="admin-main">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-empty-icon">⏳</div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id}>
                      <td>{getClientName(message.fromUserId || message.toUserId)}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message.subject || 'No Subject'}
                      </td>
                      <td>
                        <span className={`admin-status ${message.isRead ? 'admin-status-paid' : 'admin-status-unpaid'}`}>
                          {message.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message.content || message.body || 'No content'}
                      </td>
                      <td>
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleDeleteMessage(message._id)}
                          style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <span className="admin-empty-icon">💬</span>
              <p>No messages found matching your criteria</p>
              <button className="admin-btn admin-btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Send Message Modal */}
        {showSendModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--admin-card)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              border: '1px solid var(--admin-border)'
            }}>
              <h2 style={{ marginTop: 0, color: 'var(--admin-text)' }}>Send Message to Client</h2>
              <form onSubmit={handleSendMessage}>
                <div className="admin-form-group">
                  <label>To</label>
                  <select
                    value={newMessage.to}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                    className="admin-form-control"
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="admin-form-control"
                    placeholder="Message subject"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    className="admin-form-control"
                    rows="6"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowSendModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
