import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import '../../styles/admin.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ month: '', year: '', status: '', uuid: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: '', description: '' });
  const [editForm, setEditForm] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    // Auto-apply filters when they change
    const timeoutId = setTimeout(() => {
      fetchPayments();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.status) params.status = filters.status;
      if (filters.uuid) params.uuid = filters.uuid;
      if (filters.email) params.email = filters.email;

      const response = await paymentAPI.getAllPayments(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      // Error fetching payments
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ month: '', year: '', status: '', uuid: '', email: '' });
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setEditForm({
      status: payment.status || '',
      notes: payment.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await paymentAPI.updatePaymentStatus(selectedPayment._id, editForm);
      setShowEditModal(false);
      setSelectedPayment(null);
      fetchPayments(); // Refresh the list
    } catch (error) {
      // Error updating payment
      alert('Failed to update payment');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
      return;
    }

    try {
      await paymentAPI.deletePayment(paymentId);
      fetchPayments(); // Refresh the list
    } catch (error) {
      // Error deleting payment
      alert('Failed to delete payment');
    }
  };

  const handleCreateAdminPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.amount || !newPayment.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await paymentAPI.createAdminPayment({
        amount: parseFloat(newPayment.amount),
        description: newPayment.description
      });
      setNewPayment({ amount: '', description: '' });
      setShowPaymentModal(false);
      fetchPayments();
      alert('Payment created successfully');
    } catch (error) {
      // Error creating payment
      alert('Failed to create payment');
    }
  };

  const handleExportCSV = () => {
    let csv = 'Month,Year,Client,Amount,Status,Date,Notes\n';
    payments.forEach((p) => {
      csv += `${p.month || 'N/A'},${p.year || 'N/A'},"${p.userId?.name || 'Unknown'}",${p.amount || 0},"${p.status || 'unpaid'}","${new Date(p.createdAt).toLocaleDateString()}","${p.notes || ''}"\n`;
    });

    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = 'payments.csv';
    link.click();
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'admin-status-paid';
      case 'unpaid':
        return 'admin-status-unpaid';
      case 'overdue':
        return 'admin-status-overdue';
      default:
        return 'admin-status-unpaid';
    }
  };

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'unpaid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Payment Management</h1>
            <p className="admin-subtitle">Track and manage all payments</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" onClick={fetchPayments}>
              🔄 Refresh
            </button>
            <button className="admin-btn admin-btn-secondary" onClick={() => setShowPaymentModal(true)}>
              💳 Make Payment
            </button>
            <button className="admin-btn admin-btn-outline" onClick={handleExportCSV}>
              📥 Export CSV
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <div className="admin-stat-value">₦{getTotalRevenue().toLocaleString()}</div>
            <div className="admin-stat-label">Total Revenue</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">⏳</span>
            <div className="admin-stat-value">₦{getPendingAmount().toLocaleString()}</div>
            <div className="admin-stat-label">Pending Amount</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📊</span>
            <div className="admin-stat-value">{payments.length}</div>
            <div className="admin-stat-label">Total Payments</div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">✅</span>
            <div className="admin-stat-value">
              {payments.filter(p => p.status === 'paid').length}
            </div>
            <div className="admin-stat-label">Paid Payments</div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-filter-group">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="admin-form-control"
              style={{ width: '150px' }}
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="admin-filter-group">
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="admin-form-control"
              style={{ width: '120px' }}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-filter-group">
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="admin-form-control"
              style={{ width: '100px' }}
            >
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div className="admin-filter-group">
            <input
              type="text"
              name="uuid"
              value={filters.uuid}
              onChange={handleFilterChange}
              placeholder="Filter by UUID"
              className="admin-form-control"
              style={{ width: '180px' }}
            />
          </div>
          <div className="admin-filter-group">
            <input
              type="email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by Email"
              className="admin-form-control"
              style={{ width: '180px' }}
            />
          </div>
          <button className="admin-btn admin-btn-secondary" onClick={clearFilters}>
            🗑️ Clear
          </button>
        </div>

        <div className="admin-main">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-empty-icon">⏳</div>
              <p>Loading payments...</p>
            </div>
          ) : payments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Month/Year</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.userId?.name || 'Unknown'}</td>
                      <td>₦{payment.amount?.toLocaleString() || '0'}</td>
                      <td>
                        <span className={`admin-status ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status || 'Unpaid'}
                        </span>
                      </td>
                      <td>
                        {payment.month && payment.year
                          ? `${new Date(0, payment.month - 1).toLocaleString('default', { month: 'short' })} ${payment.year}`
                          : 'N/A'
                        }
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {payment.notes || 'No notes'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="admin-btn admin-btn-outline"
                            onClick={() => handleEditPayment(payment)}
                            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => handleDeletePayment(payment._id)}
                            style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              <span className="admin-empty-icon">💳</span>
              <p>No payments found matching your criteria</p>
              <button className="admin-btn admin-btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Edit Payment Modal */}
        {showEditModal && selectedPayment && (
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
              maxWidth: '500px',
              width: '90%',
              border: '1px solid var(--admin-border)'
            }}>
              <h2 style={{ marginTop: 0, color: 'var(--admin-text)' }}>Edit Payment</h2>
              <form onSubmit={handleUpdatePayment}>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="admin-form-control"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="admin-form-control"
                    rows="3"
                    placeholder="Optional notes about this payment"
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Update Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Admin Payment Modal */}
        {showPaymentModal && (
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
              maxWidth: '500px',
              width: '90%',
              border: '1px solid var(--admin-border)'
            }}>
              <h2 style={{ marginTop: 0, color: 'var(--admin-text)' }}>Create Admin Payment</h2>
              <form onSubmit={handleCreateAdminPayment}>
                <div className="admin-form-group">
                  <label>Amount (₦)</label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                    className="admin-form-control"
                    placeholder="Enter payment amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    value={newPayment.description}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                    className="admin-form-control"
                    rows="3"
                    placeholder="Describe the purpose of this payment"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Create Payment
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

export default AdminPayments;
