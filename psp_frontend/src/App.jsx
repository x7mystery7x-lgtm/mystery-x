import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx'

// Lazy load components
const Home = React.lazy(() => import('./pages/Public/Home.jsx'))
const About = React.lazy(() => import('./pages/Public/About.jsx'))
const Services = React.lazy(() => import('./pages/Public/Services.jsx'))
const Contact = React.lazy(() => import('./pages/Public/Contact.jsx'))
const Payments = React.lazy(() => import('./pages/Public/Payments.jsx'))
const Dashboard = React.lazy(() => import('./pages/Public/Dashboard.jsx'))
const Help = React.lazy(() => import('./pages/Public/Help.jsx'))
const Compliance = React.lazy(() => import('./pages/Public/Compliance.jsx'))
const Docs = React.lazy(() => import('./pages/Public/Docs.jsx'))
const ClientDashboard = React.lazy(() => import('./pages/Client/Dashboard.jsx'))
const ClientMessages = React.lazy(() => import('./pages/Client/Messages.jsx'))
const ClientPayments = React.lazy(() => import('./pages/Client/Payments.jsx'))
const ClientProfile = React.lazy(() => import('./pages/Client/Profile.jsx'))
const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard.jsx'))
const AdminMessages = React.lazy(() => import('./pages/Admin/AdminMessages.jsx'))
const AdminPayments = React.lazy(() => import('./pages/Admin/AdminPayments.jsx'))
const AdminClients = React.lazy(() => import('./pages/Admin/Clients.jsx'))
const RoleSelection = React.lazy(() => import('./pages/Auth/RoleSelection.jsx'))
const Login = React.lazy(() => import('./pages/Auth/Login.jsx'))
const Register = React.lazy(() => import('./pages/Auth/Register.jsx'))
const RegisterAdmin = React.lazy(() => import('./pages/Auth/RegisterAdmin.jsx'))
const RegisterClient = React.lazy(() => import('./pages/Auth/RegisterClient.jsx'))

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="fullscreen-center">
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid var(--primary-blue)',
              borderRadius: '50%'
            }}></div>
          </div>
        }>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/help" element={<Help />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/docs" element={<Docs />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/client" element={<Login />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/register" element={<RoleSelection />} />
          <Route path="/register/client" element={<RegisterClient />} />
          <Route path="/register/admin" element={<RegisterAdmin />} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/messages" element={<ProtectedRoute><ClientMessages /></ProtectedRoute>} />
          <Route path="/client/payments" element={<ProtectedRoute><ClientPayments /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><AdminClients /></ProtectedRoute>} />
        </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App
