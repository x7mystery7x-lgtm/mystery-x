import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import '../../styles/client.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ month: '', year: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ month: '', year: '' });

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

      const response = await paymentAPI.getUserPayments(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      // Error fetching payments
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    if (!newPayment.month || !newPayment.year) {
      alert('Please select month and year');
      return;
    }

    try {
      await paymentAPI.createMockPayment({
        month: parseInt(newPayment.month),
        year: parseInt(newPayment.year)
      });
      setNewPayment({ month: '', year: '' });
      setShowPaymentModal(false);
      fetchPayments();
      alert('Mock payment created successfully');
    } catch (error) {
      // Error creating payment
      alert('Failed to create payment: ' + (error.response?.data?.error || error.message));
    }
  };

  const clearFilters = () => {
    setFilters({ month: '', year: '', status: '' });
  };

  const getTotalPaid = () => {
    return payments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalDue = () => {
    return payments
      .filter(payment => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0);
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
          <div className="client-loading">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading your payments...</p>
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
            <h1 className="client-title">My Payments</h1>
            <p className="client-subtitle">View your payment history and make new payments</p>
          </div>
          <div className="client-actions">
            <button className="client-btn client-btn-primary" onClick={fetchPayments}>
              🔄 Refresh
            </button>
            <button className="client-btn client-btn-secondary" onClick={() => setShowPaymentModal(true)}>
              💳 Make Payment
            </button>
          </div>
        </div>

        <div className="client-stats">
          <div className="client-stat-card">
            <span className="client-stat-icon">💰</span>
            <div className="client-stat-value">{formatCurrency(getTotalPaid())}</div>
            <div className="client-stat-label">Total Paid</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">⏳</span>
            <div className="client-stat-value">{formatCurrency(getTotalDue())}</div>
            <div className="client-stat-label">Outstanding Due</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">📊</span>
            <div className="client-stat-value">{payments.length}</div>
            <div className="client-stat-label">Total Payments</div>
          </div>

          <div className="client-stat-card">
            <span className="client-stat-icon">✅</span>
            <div className="client-stat-value">
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'paid').length / payments.length) * 100) : 0}%
            </div>
            <div className="client-stat-label">Payment Success Rate</div>
          </div>
        </div>

        <div className="client-filters">
          <div className="client-filter-group">
            <select
              name="month"
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              className="client-form-control"
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
          <div className="client-filter-group">
            <select
              name="year"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              className="client-form-control"
              style={{ width: '100px' }}
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => (
                <option key={2024 + i} value={2024 + i}>{2024 + i}</option>
              ))}
            </select>
          </div>
          <div className="client-filter-group">
            <select
              name="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="client-form-control"
              style={{ width: '120px' }}
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button className="client-btn client-btn-secondary" onClick={clearFilters}>
            🗑️ Clear
          </button>
        </div>

        <div className="client-main" style={{ gridTemplateColumns: '1fr' }}>
          {payments.length > 0 ? (
            <div className="client-panel">
              <h3 className="client-panel-title">Payment History</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="client-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id}>
                        <td>{payment.description || 'Payment'}</td>
                        <td style={{ fontWeight: '600' }}>{formatCurrency(payment.amount)}</td>
                        <td>
                          <span className={`client-status ${payment.status === 'paid' ? 'client-status-success' : 'client-status-warning'}`}>
                            {payment.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="client-empty">
              <span className="client-empty-icon">💳</span>
              <p>No payments found</p>
              <button className="client-btn client-btn-primary" onClick={() => setShowPaymentModal(true)}>
                Make Your First Payment
              </button>
            </div>
          )}
        </div>

        {/* Make Payment Modal */}
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
              background: 'var(--client-surface)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid var(--client-border)'
            }}>
              <h2 style={{ marginTop: 0, color: 'var(--client-text)' }}>Create Mock Payment</h2>
              <form onSubmit={handleCreatePayment}>
                <div className="client-form-group">
                  <label>Month</label>
                  <select
                    value={newPayment.month}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, month: e.target.value }))}
                    className="client-form-control"
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div className="client-form-group">
                  <label>Year</label>
                  <select
                    value={newPayment.year}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, year: e.target.value }))}
                    className="client-form-control"
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="client-btn client-btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="client-btn client-btn-primary">
                    Make Payment
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

export default Payments;
