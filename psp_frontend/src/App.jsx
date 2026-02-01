import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Lazy load components
const Home = React.lazy(() => import('./pages/Public/TempHome'))
const About = React.lazy(() => import('./pages/Public/About'))
const Services = React.lazy(() => import('./pages/Public/Services'))
const Contact = React.lazy(() => import('./pages/Public/Contact'))
const Payments = React.lazy(() => import('./pages/Public/Payments'))
const Dashboard = React.lazy(() => import('./pages/Public/Dashboard'))
const Help = React.lazy(() => import('./pages/Public/Help'))
const Compliance = React.lazy(() => import('./pages/Public/Compliance'))
const Docs = React.lazy(() => import('./pages/Public/Docs'))
const ClientDashboard = React.lazy(() => import('./pages/Client/Dashboard'))
const ClientMessages = React.lazy(() => import('./pages/Client/Messages'))
const ClientPayments = React.lazy(() => import('./pages/Client/Payments'))
const ClientProfile = React.lazy(() => import('./pages/Client/Profile'))
const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard'))
const AdminMessages = React.lazy(() => import('./pages/Admin/AdminMessages'))
const AdminPayments = React.lazy(() => import('./pages/Admin/AdminPayments'))
const AdminClients = React.lazy(() => import('./pages/Admin/Clients'))
const RoleSelection = React.lazy(() => import('./pages/Auth/RoleSelection'))
const Login = React.lazy(() => import('./pages/Auth/Login'))
const Register = React.lazy(() => import('./pages/Auth/Register'))
const RegisterAdmin = React.lazy(() => import('./pages/Auth/RegisterAdmin'))
const RegisterClient = React.lazy(() => import('./pages/Auth/RegisterClient'))

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
