import React, { useEffect, useState } from 'react';
import { messageAPI } from '../../services/api';
import '../../styles/client.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getUserMessages();
      setMessages(response.data.messages || []);
    } catch (error) {
      // Error fetching messages
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.subject || !newMessage.content) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await messageAPI.sendMessage({
        subject: newMessage.subject,
        content: newMessage.content
      });
      setNewMessage({ subject: '', content: '' });
      setShowSendModal(false);
      fetchMessages();
      alert('Message sent successfully');
    } catch (error) {
      // Error sending message
      alert('Failed to send message');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messageAPI.markAsRead(id);
      fetchMessages();
    } catch (error) {
      // Error marking message as read
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  if (loading) {
    return (
      <div className="client-page">
        <div className="client-container">
          <div className="client-loading">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading your messages...</p>
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
            <h1 className="client-title">Messages</h1>
            <p className="client-subtitle">Communicate with administrators and view your message history</p>
          </div>
          <div className="client-actions">
            <button className="client-btn client-btn-primary" onClick={fetchMessages}>
              🔄 Refresh
            </button>
            <button className="client-btn client-btn-secondary" onClick={() => setShowSendModal(true)}>
              ✉️ Send Message
            </button>
          </div>
        </div>

        <div className="client-stats">
          <div className="client-stat-card">
            <span className="client-stat-icon">💬</span>
            <div className="client-stat-value">{messages.length}</div>
            <div className="client-stat-label">Total Messages</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">📬</span>
            <div className="client-stat-value">{getUnreadCount()}</div>
            <div className="client-stat-label">Unread Messages</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">📊</span>
            <div className="client-stat-value">
              {messages.length > 0 ? Math.round((messages.filter(m => m.isRead).length / messages.length) * 100) : 0}%
            </div>
            <div className="client-stat-label">Read Rate</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">⏰</span>
            <div className="client-stat-value">
              {messages.length > 0 ? Math.round((new Date() - new Date(messages[0]?.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="client-stat-label">Days Since Last Message</div>
          </div>
        </div>

        <div className="client-main" style={{ gridTemplateColumns: '1fr' }}>
          {messages.length > 0 ? (
            <div className="client-panel">
              <h3 className="client-panel-title">Your Messages</h3>
              <div className="client-messages-list">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`client-message ${!message.isRead ? 'unread' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="client-message-header">
                      <div className="client-message-sender">
                        {message.subject || 'No Subject'}
                      </div>
                      <div className="client-message-date">
                        {new Date(message.createdAt).toLocaleDateString()}
                        {!message.isRead && <span className="client-unread-dot" style={{ marginLeft: '8px' }}></span>}
                      </div>
                    </div>
                    <div className="client-message-content">
                      {message.content?.slice(0, 150) || message.body?.slice(0, 150) || 'No content'}
                      {(message.content?.length > 150 || message.body?.length > 150) && '...'}
                    </div>
                    {!message.isRead && (
                      <div style={{ marginTop: '12px' }}>
                        <button
                          className="client-btn client-btn-outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message._id);
                          }}
                          style={{ fontSize: '0.875rem', padding: '6px 12px' }}
                        >
                          Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="client-empty">
              <span className="client-empty-icon">💬</span>
              <p>No messages found</p>
              <button className="client-btn client-btn-primary" onClick={() => setShowSendModal(true)}>
                Send Your First Message
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
              background: 'var(--client-surface)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '90%',
              border: '1px solid var(--client-border)'
            }}>
              <h2 style={{ marginTop: 0, color: 'var(--client-text)' }}>Send Message to Admin</h2>
              <form onSubmit={handleSendMessage}>
                <div className="client-form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="client-form-control"
                    placeholder="Message subject"
                    required
                  />
                </div>
                <div className="client-form-group">
                  <label>Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    className="client-form-control"
                    rows="6"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="client-btn client-btn-secondary"
                    onClick={() => setShowSendModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="client-btn client-btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
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
              background: 'var(--client-surface)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid var(--client-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: 'var(--client-text)' }}>
                  {selectedMessage.subject || 'No Subject'}
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--client-muted)'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '16px', color: 'var(--client-muted)', fontSize: '0.875rem' }}>
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>

              <div style={{ lineHeight: '1.6', color: 'var(--client-text)' }}>
                {selectedMessage.content || selectedMessage.body || 'No content'}
              </div>

              {!selectedMessage.isRead && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button
                    className="client-btn client-btn-primary"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage._id);
                      setSelectedMessage(null);
                    }}
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
