# 📄 React Pages - Complete Implementation

## PUBLIC PAGES

### HOME PAGE - `src/pages/Public/Home.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Professional Service Provider</h1>
        <p className="text-xl mb-8">Manage your payments and services with ease</p>
        <Link to="/register" className="btn-primary bg-white text-blue-600 px-8 py-3 rounded-lg font-bold">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">🔒 Secure</h3>
              <p>Enterprise-grade security with JWT authentication and encrypted payments</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">📊 Track Payments</h3>
              <p>Monitor your monthly payments and payment status in real-time</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">💬 Direct Support</h3>
              <p>Secure messaging with our support team directly in your dashboard</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
```

---

### ABOUT PAGE - `src/pages/Public/About.jsx`

```jsx
import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">About PSP</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            To provide reliable, transparent, and secure payment management solutions 
            for professional service providers and their clients.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-4">
            To become the leading platform for service provider and client relationships, 
            enabling seamless communication and payment management.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Core Values</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✓ Security & Privacy</li>
          <li>✓ Transparency & Trust</li>
          <li>✓ Excellence in Service</li>
          <li>✓ Innovation & Improvement</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
```

---

### SERVICES PAGE - `src/pages/Public/Services.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await authAPI.getMe(); // Or use a dedicated services endpoint
        setServices(response.data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center py-12">Loading services...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Services</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="card hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-700">{service.description}</p>
            {service.price && <p className="text-blue-600 font-bold mt-4">${service.price}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
```

---

### CONTACT PAGE - `src/pages/Public/Contact.jsx`

```jsx
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message. We will respond shortly!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="form-control"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            required
          ></textarea>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">📍 Address</h3>
            <p className="text-gray-700">123 Business Street, Lagos, Nigeria</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">📞 Phone</h3>
            <p className="text-gray-700">+234 (0) 800 123 4567</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">📧 Email</h3>
            <p className="text-gray-700">support@pspcompany.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">🕐 Hours</h3>
            <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
```

---

## 🔐 AUTH PAGES

### LOGIN PAGE - `src/pages/Auth/Login.jsx`

```jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600 font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

### REGISTER PAGE - `src/pages/Auth/Register.jsx`

```jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
```

---

## 👤 CLIENT DASHBOARD PAGES

### PROFILE PAGE - `src/pages/Client/Profile.jsx`

```jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { userAPI, addressAPI } from '../../services/api';

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
        const [profileRes, addressRes] = await Promise.all([
          userAPI.getProfile(user?._id),
          addressAPI.getAddress()
        ]);
        setProfile(profileRes.data.profile || profileRes.data);
        setFormData({ name: profileRes.data.name, email: profileRes.data.email });
        if (addressRes.data.address) {
          setAddress(addressRes.data.address);
          setAddressData({
            houseNumber: addressRes.data.address.houseNumber,
            street: addressRes.data.address.street,
            state: addressRes.data.address.state,
            country: addressRes.data.address.country
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      // Refresh address
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

  if (loading) return <div className="text-center py-12">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12">My Profile</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          
          {!editMode ? (
            <div>
              <p className="text-gray-600 mb-2"><strong>Name:</strong> {formData.name}</p>
              <p className="text-gray-600 mb-4"><strong>Email:</strong> {formData.email}</p>
              <button onClick={() => setEditMode(true)} className="btn-primary">Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          <hr className="my-6" />

          <h3 className="text-xl font-bold mb-4">Change Password</h3>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-control"
            />
            <button onClick={handlePasswordChange} className="btn-primary">Update Password</button>
          </div>
        </div>

        {/* Address Card */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Address Information</h2>
          
          {address && (
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Your UUID:</p>
              <p className="text-lg font-mono font-bold text-blue-600">{address.uuid}</p>
            </div>
          )}

          <form onSubmit={handleAddressUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="House Number"
              value={addressData.houseNumber}
              onChange={(e) => setAddressData({ ...addressData, houseNumber: e.target.value })}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Street"
              value={addressData.street}
              onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
              className="form-control"
            />
            <input
              type="text"
              placeholder="State"
              value={addressData.state}
              onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Country"
              value={addressData.country}
              onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
              className="form-control"
            />
            <button type="submit" className="btn-primary w-full">Save Address</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
```

---

### PAYMENTS PAGE - `src/pages/Client/Payments.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ month: '', year: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.status) params.status = filters.status;

      const response = await paymentAPI.getMyPayments(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMockPayment = async () => {
    const month = prompt('Enter month (1-12):');
    const year = prompt('Enter year:');
    if (month && year) {
      try {
        await paymentAPI.createMockPayment({ month, year });
        fetchPayments();
        alert('Mock payment created successfully');
      } catch (error) {
        alert('Error: ' + error.response?.data?.message);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchPayments();
  };

  if (loading) return <div className="text-center py-12">Loading payments...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Payments</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input type="number" name="month" placeholder="Month (1-12)" value={filters.month} onChange={handleFilterChange} className="form-control" />
          <input type="number" name="year" placeholder="Year" value={filters.year} onChange={handleFilterChange} className="form-control" />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="form-control">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <button onClick={applyFilters} className="btn-primary mr-2">Apply Filters</button>
        <button onClick={handleCreateMockPayment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Create Mock Payment</button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Month</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{payment.month}</td>
                <td className="px-6 py-3">{payment.year}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="p-6 text-center text-gray-500">No payments found</p>}
      </div>
    </div>
  );
};

export default Payments;
```

---

### MESSAGES PAGE - `src/pages/Client/Messages.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { messageAPI } from '../../services/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMyMessages();
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!subject || !newMessage) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await messageAPI.sendMessage({ subject, body: newMessage });
      setSubject('');
      setNewMessage('');
      fetchMessages();
      alert('Message sent successfully');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messageAPI.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) return <div className="text-center py-12">Loading messages...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Send Message */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Send Message to Admin</h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
            />
            <textarea
              placeholder="Message"
              rows="5"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-control"
            ></textarea>
            <button type="submit" className="btn-primary w-full">Send</button>
          </form>
        </div>

        {/* Messages List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Messages</h2>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg._id} className={`p-4 rounded border ${msg.readAt ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold">{msg.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">{msg.body}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  {!msg.readAt && (
                    <button onClick={() => handleMarkAsRead(msg._id)} className="text-sm text-blue-600">Mark as read</button>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
```

---

### CLIENT DASHBOARD - `src/pages/Client/Dashboard.jsx`

```jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-12">Manage your profile, payments, and messages</p>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/client/profile" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">👤 Profile</h3>
          <p className="text-gray-600">Edit your profile and manage address</p>
        </Link>

        <Link to="/client/payments" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">💳 Payments</h3>
          <p className="text-gray-600">View and manage your payments</p>
        </Link>

        <Link to="/client/messages" className="card hover:shadow-lg transition cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">💬 Messages</h3>
          <p className="text-gray-600">Communicate with admin</p>
        </Link>
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p className="text-gray-700"><strong>Account Status:</strong> Active ✓</p>
          <p className="text-gray-700"><strong>Email Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
```

---

## ⚙️ ADMIN DASHBOARD PAGES

Continuing in next part...
