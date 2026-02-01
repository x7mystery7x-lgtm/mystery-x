# 🚀 React Frontend - Complete Step-by-Step Implementation Guide

**Timeline:** Jan 12-15, 2026 (3 Days)  
**Status:** Starting Now

---

## ⏰ TIMELINE BREAKDOWN

```
DAY 1 (Jan 12): React Setup + Public Pages + Auth
DAY 2 (Jan 13): Client Dashboard (Profile, Payments, Messaging)
DAY 3 (Jan 14): Admin Dashboard + Polish
DAY 4 (Jan 15): Testing + Deployment (Deadline)
```

---

## 📋 COMPLETE STEP-BY-STEP INSTRUCTIONS

### STEP 1: Create React Project with Vite (15 min)

```bash
# Navigate to parent directory of psp_project_1
cd c:\Users\Lenovo E14\Desktop

# Create React app with Vite
npm create vite@latest psp_frontend -- --template react

# Navigate into project
cd psp_frontend

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom axios react-query formik yup bootstrap react-bootstrap
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Start dev server (KEEP RUNNING)
npm run dev
```

**Result:** React app running on `http://localhost:5173`

---

### STEP 2: Project Structure & Configuration

```bash
# Create folder structure
mkdir -p src/pages src/components src/components/common src/components/public src/components/client src/components/admin
mkdir -p src/services src/hooks src/context src/utils src/styles
```

**Create file structure:**
```
psp_frontend/
├── src/
│   ├── pages/
│   │   ├── Public/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Services.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   ├── Client/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Messages.jsx
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── AdminPayments.jsx
│   │   │   ├── AdminMessages.jsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   ├── styles/
│   │   ├── tailwind.css
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── package.json
└── vite.config.js
```

---

### STEP 3: Tailwind CSS Setup

**`tailwind.config.js`:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d6efd',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        neutral: '#6c757d',
      },
    },
  },
  plugins: [],
}
```

**`src/styles/tailwind.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition;
}

.form-control {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600;
}

.card {
  @apply bg-white rounded shadow p-4;
}
```

**`src/main.jsx`:** (Update to include Tailwind)
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### STEP 4: API Service Layer

**`src/services/api.js`:**
```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // For session cookies
});

// Auth
export const authAPI = {
  register: (data) => api.post('/public/register', data),
  login: (data) => api.post('/public/login', data),
  logout: () => api.post('/public/logout'),
  getMe: () => api.get('/user/me'),
};

// User Profile
export const userAPI = {
  getProfile: (id) => api.get(`/user/profile/${id}`),
  updateProfile: (data) => api.patch('/user/me/profile', data),
  changePassword: (data) => api.patch('/user/me/password', data),
  deleteAccount: (id) => api.delete(`/user/profile/${id}`),
};

// Address
export const addressAPI = {
  getAddress: () => api.get('/user/me/address'),
  createAddress: (data) => api.post('/user/me/address', data),
  updateAddress: (data) => api.patch('/user/me/address', data),
  deleteAddress: () => api.delete('/user/me/address'),
};

// Payments
export const paymentAPI = {
  // Client
  getMyPayments: (filters = {}) => api.get('/payments/me/payments', { params: filters }),
  getPayment: (id) => api.get(`/payments/me/payments/${id}`),
  createMockPayment: (data) => api.post('/payments/me/payments/mock-pay', data),
  
  // Admin
  getAllPayments: (filters = {}) => api.get('/payments/admin/payments', { params: filters }),
  updatePaymentStatus: (id, data) => api.patch(`/payments/admin/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/payments/admin/payments/${id}`),
};

// Messages
export const messageAPI = {
  // Client
  getMyMessages: () => api.get('/messages/me/messages'),
  sendMessage: (data) => api.post('/messages/me/messages', data),
  markAsRead: (id) => api.patch(`/messages/me/messages/${id}/read`),
  
  // Admin
  getAllMessages: (filters = {}) => api.get('/messages/admin/messages', { params: filters }),
  sendAdminMessage: (data) => api.post('/messages/admin/messages', data),
  deleteMessage: (id) => api.delete(`/messages/admin/messages/${id}`),
};

// Admin
export const adminAPI = {
  getClients: (filters = {}) => api.get('/admin/clients', { params: filters }),
  getClient: (id) => api.get(`/admin/clients/${id}`),
  updateClient: (id, data) => api.patch(`/admin/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/admin/clients/${id}`),
};

export default api;
```

---

### STEP 5: Authentication Context

**`src/context/AuthContext.jsx`:**
```jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (email, password, name) => {
    try {
      setError(null);
      const response = await authAPI.register({ email, password, name });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### STEP 6: Protected Route Component

**`src/components/common/ProtectedRoute.jsx`:**
```jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
```

---

### STEP 7: Navigation Component

**`src/components/common/Navbar.jsx`:**
```jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">PSP Company</Link>
        
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/about" className="hover:text-blue-200">About</Link>
          <Link to="/services" className="hover:text-blue-200">Services</Link>
          <Link to="/contact" className="hover:text-blue-200">Contact</Link>
        </div>

        <div className="flex gap-4">
          {!user ? (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm">{user.name} ({user.role})</span>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} className="hover:text-blue-200">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
```

---

### STEP 8: Main App Router

**`src/App.jsx`:**
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';
import Services from './pages/Public/Services';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Client Pages
import ClientDashboard from './pages/Client/Dashboard';
import Profile from './pages/Client/Profile';
import Payments from './pages/Client/Payments';
import Messages from './pages/Client/Messages';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import Clients from './pages/Admin/Clients';
import AdminPayments from './pages/Admin/AdminPayments';
import AdminMessages from './pages/Admin/AdminMessages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/client/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/client/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><Clients /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## 🎯 NEXT STEPS: BUILD PAGES

Continue with creating each page following the templates provided in the next section...

This guide continues with complete implementations for all pages.
