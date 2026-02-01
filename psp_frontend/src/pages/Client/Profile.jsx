import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { userAPI, addressAPI } from '../../services/api';
import '../../styles/client.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [addressData, setAddressData] = useState({ houseNumber: '', street: '', state: '', country: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // User data comes from AuthContext, just fetch address
        setFormData({ 
          name: user?.name || '', 
          email: user?.email || '' 
        });
        
        // Get address data
        const addressRes = await addressAPI.getAddress();
        if (addressRes.data && addressRes.data.address) {
          setAddress(addressRes.data.address);
          setAddressData({
            houseNumber: addressRes.data.address.houseNumber || '',
            street: addressRes.data.address.street || '',
            state: addressRes.data.address.state || '',
            country: addressRes.data.address.country || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile({ name: formData.name });
      alert('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      alert('Error updating profile: ' + error.response?.data?.message);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      if (address) {
        await addressAPI.updateAddress(addressData);
      } else {
        await addressAPI.createAddress(addressData);
      }
      alert('Address saved successfully');
      const res = await addressAPI.getAddress();
      setAddress(res.data.address);
    } catch (error) {
      alert('Error saving address: ' + error.response?.data?.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!formData.password) {
      alert('Please enter a new password');
      return;
    }
    try {
      await userAPI.changePassword({ newPassword: formData.password });
      alert('Password changed successfully');
      setFormData({ ...formData, password: '' });
    } catch (error) {
      alert('Error changing password: ' + error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="client-page">
        <div className="client-container">
          <div className="client-loading">
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p>Loading your profile...</p>
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
            <h1 className="client-title">My Profile</h1>
            <p className="client-subtitle">Manage your personal information and account settings</p>
          </div>
        </div>

        <div className="client-main">
          {/* Profile Information Section */}
          <div className="client-panel">
            <h3 className="client-panel-title">Profile Information</h3>

            {!editMode ? (
              <div className="client-profile-section">
                <div className="client-profile-field">
                  <span className="client-profile-label">Name</span>
                  <span className="client-profile-value">{formData.name}</span>
                </div>
                <div className="client-profile-field">
                  <span className="client-profile-label">Email</span>
                  <span className="client-profile-value">{formData.email}</span>
                </div>
                <div className="client-profile-field">
                  <span className="client-profile-label">Account Type</span>
                  <span className="client-profile-value">Client</span>
                </div>
                <div className="client-profile-field">
                  <span className="client-profile-label">Member Since</span>
                  <span className="client-profile-value">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div style={{ paddingTop: '16px', textAlign: 'right' }}>
                  <button className="client-btn client-btn-primary" onClick={() => setEditMode(true)}>
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="client-profile-section">
                <div className="client-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="client-form-control"
                    required
                  />
                </div>
                <div className="client-form-group">
                  <label>Email (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    className="client-form-control"
                    disabled
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="submit" className="client-btn client-btn-primary">
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    className="client-btn client-btn-secondary"
                    onClick={() => setEditMode(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Password Change Section */}
          <div className="client-panel">
            <h3 className="client-panel-title">Change Password</h3>
            <div className="client-profile-section">
              <div className="client-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="client-form-control"
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  className="client-btn client-btn-secondary"
                  onClick={handlePasswordChange}
                  disabled={!formData.password}
                >
                  🔒 Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="client-panel">
            <h3 className="client-panel-title">Address Information</h3>

            {address && (
              <div style={{
                background: 'rgba(13, 110, 253, 0.1)',
                border: '1px solid rgba(13, 110, 253, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🆔</span>
                  <span style={{ fontWeight: '600', color: 'var(--client-primary)' }}>Your UUID</span>
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'var(--client-primary)',
                  wordBreak: 'break-all'
                }}>
                  {address.uuid}
                </div>
              </div>
            )}

            <form onSubmit={handleAddressUpdate} className="client-profile-section">
              <div className="client-form-group">
                <label>House Number</label>
                <input
                  type="text"
                  placeholder="Enter house number"
                  value={addressData.houseNumber}
                  onChange={(e) => setAddressData({ ...addressData, houseNumber: e.target.value })}
                  className="client-form-control"
                />
              </div>
              <div className="client-form-group">
                <label>Street</label>
                <input
                  type="text"
                  placeholder="Enter street name"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                  className="client-form-control"
                />
              </div>
              <div className="client-form-group">
                <label>State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  className="client-form-control"
                />
              </div>
              <div className="client-form-group">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={addressData.country}
                  onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                  className="client-form-control"
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="client-btn client-btn-primary">
                  💾 Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
