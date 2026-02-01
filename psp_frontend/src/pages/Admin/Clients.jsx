import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import '../../styles/admin.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ email: '', uuid: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', isVerified: false });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Auto-apply filters when they change
    const timeoutId = setTimeout(() => {
      fetchClients();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.email) params.email = filters.email;
      if (filters.uuid) params.uuid = filters.uuid;
      if (filters.search) params.search = filters.search;

      const response = await adminAPI.getClients(params);
      setClients(response.data.clients || []);
    } catch (error) {
      // Error fetching clients
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ email: '', uuid: '', search: '' });
  };

  const handleViewClient = async (client) => {
    try {
      const response = await adminAPI.getClient(client._id);
      setSelectedClient(response.data.client || response.data);
      setEditData({
        name: response.data.name || '',
        email: response.data.email || '',
        isVerified: response.data.isVerified || false
      });
    } catch (error) {
      // Error fetching client details
    }
  };

  const handleUpdateClient = async () => {
    try {
      await adminAPI.updateClient(selectedClient._id, editData);
      alert('Client updated successfully');
      setEditMode(false);
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await adminAPI.deleteClient(id);
        alert('Client deleted successfully');
        fetchClients();
        setSelectedClient(null);
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Client Management</h1>
            <p className="admin-subtitle">Manage all registered clients</p>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" onClick={fetchClients}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {selectedClient ? (
          <div className="admin-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: 'var(--admin-text)' }}>{selectedClient.name}</h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="admin-btn admin-btn-secondary"
              >
                ← Back to List
              </button>
            </div>

            <div className="admin-content" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <div className="admin-form-group">
                  <label style={{ color: 'var(--admin-text)' }}>Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="admin-form-control"
                    />
                  ) : (
                    <div style={{ color: 'var(--admin-muted)', padding: '12px', background: 'var(--admin-surface)', borderRadius: '8px' }}>
                      {selectedClient.name}
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label style={{ color: 'var(--admin-text)' }}>Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="admin-form-control"
                    />
                  ) : (
                    <div style={{ color: 'var(--admin-muted)', padding: '12px', background: 'var(--admin-surface)', borderRadius: '8px' }}>
                      {selectedClient.email}
                    </div>
                  )}
                </div>

                <div className="admin-form-group">
                  <label style={{ color: 'var(--admin-text)' }}>Verified</label>
                  {editMode ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={editData.isVerified}
                        onChange={(e) => setEditData({ ...editData, isVerified: e.target.checked })}
                      />
                      Account Verified
                    </label>
                  ) : (
                    <div style={{ color: selectedClient.isVerified ? 'var(--admin-success)' : 'var(--admin-error)' }}>
                      {selectedClient.isVerified ? '✓ Verified' : '✗ Unverified'}
                    </div>
                  )}
                </div>

                {editMode ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleUpdateClient} className="admin-btn admin-btn-primary">
                      💾 Save Changes
                    </button>
                    <button onClick={() => setEditMode(false)} className="admin-btn admin-btn-secondary">
                      ❌ Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setEditMode(true)} className="admin-btn admin-btn-outline">
                      ✏️ Edit Client
                    </button>
                    <button
                      onClick={() => handleDeleteClient(selectedClient._id)}
                      className="admin-btn admin-btn-secondary"
                      style={{ background: 'var(--admin-error)' }}
                    >
                      🗑️ Delete Client
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ color: 'var(--admin-text)', marginBottom: '16px' }}>Account Details</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-muted)' }}>Role:</span>
                    <span style={{ color: 'var(--admin-text)' }}>{selectedClient.role}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-muted)' }}>UUID:</span>
                    <span style={{ color: 'var(--admin-text)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {selectedClient.account}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-muted)' }}>Joined:</span>
                    <span style={{ color: 'var(--admin-text)' }}>
                      {new Date(selectedClient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--admin-muted)' }}>Last Updated:</span>
                    <span style={{ color: 'var(--admin-text)' }}>
                      {new Date(selectedClient.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="admin-filters">
              <div className="admin-search">
                <input
                  type="text"
                  name="search"
                  placeholder="Search by name, email, or UUID..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="admin-form-control"
                />
              </div>
              <div className="admin-filter-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Filter by email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  className="admin-form-control"
                  style={{ width: '200px' }}
                />
              </div>
              <div className="admin-filter-group">
                <input
                  type="text"
                  name="uuid"
                  placeholder="Filter by UUID"
                  value={filters.uuid}
                  onChange={handleFilterChange}
                  className="admin-form-control"
                  style={{ width: '200px' }}
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
                  <p>Loading clients...</p>
                </div>
              ) : clients.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>UUID</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client._id}>
                          <td>{client.name}</td>
                          <td>{client.email}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {client.account}
                          </td>
                          <td>
                            <span className={`admin-status ${client.isVerified ? 'admin-status-paid' : 'admin-status-unpaid'}`}>
                              {client.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="admin-btn admin-btn-outline"
                                onClick={() => handleViewClient(client)}
                                style={{ padding: '8px 12px', fontSize: '0.875rem' }}
                              >
                                👁️ View
                              </button>
                              <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => handleDeleteClient(client._id)}
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
                  <span className="admin-empty-icon">👥</span>
                  <p>No clients found matching your criteria</p>
                  <button className="admin-btn admin-btn-primary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Clients;
