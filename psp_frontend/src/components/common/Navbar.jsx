import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if we're on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')
  const isClientPage = location.pathname.startsWith('/client')

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`psp-navbar ${isAdminPage ? 'admin-navbar' : isClientPage ? 'client-navbar' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <div className="brand-logo-container">
            <span className="logo">💳</span>
          </div>
          <span className="brand-title">Mystery-X PSP</span>
          {isAdminPage && <span className="nav-role-badge admin-badge">ADMIN</span>}
          {isClientPage && <span className="nav-role-badge client-badge">CLIENT</span>}
        </Link>

        <nav className="nav-actions">
          {!user ? (
            // Public navigation
            <>
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
              <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
              <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>
              <Link to="/login" className="btn-outline" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={closeMobileMenu}>Get Started</Link>
            </>
          ) : user.role === 'admin' ? (
            // Admin navigation
            <>
              <Link to="/admin/dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/admin/clients" className="nav-link" onClick={closeMobileMenu}>Clients</Link>
              <Link to="/admin/payments" className="nav-link" onClick={closeMobileMenu}>Payments</Link>
              <Link to="/admin/messages" className="nav-link" onClick={closeMobileMenu}>Messages</Link>
              <span className="nav-user">Welcome, Admin</span>
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            </>
          ) : (
            // Client navigation
            <>
              <Link to="/client/dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/client/payments" className="nav-link" onClick={closeMobileMenu}>Payments</Link>
              <Link to="/client/messages" className="nav-link" onClick={closeMobileMenu}>Messages</Link>
              <Link to="/client/profile" className="nav-link" onClick={closeMobileMenu}>Profile</Link>
              <span className="nav-user">Welcome, {user.name || 'Client'}</span>
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-menu">
          {!user ? (
            // Public mobile navigation
            <>
              <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
              <Link to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>About</Link>
              <Link to="/services" className="mobile-nav-link" onClick={closeMobileMenu}>Services</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
              <div className="mobile-menu-buttons">
                <Link to="/login" className="btn-outline mobile-btn" onClick={closeMobileMenu}>Login</Link>
                <Link to="/register" className="btn-primary mobile-btn" onClick={closeMobileMenu}>Get Started</Link>
              </div>
            </>
          ) : user.role === 'admin' ? (
            // Admin mobile navigation
            <>
              <Link to="/admin/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/admin/clients" className="mobile-nav-link" onClick={closeMobileMenu}>Clients</Link>
              <Link to="/admin/payments" className="mobile-nav-link" onClick={closeMobileMenu}>Payments</Link>
              <Link to="/admin/messages" className="mobile-nav-link" onClick={closeMobileMenu}>Messages</Link>
              <div className="mobile-menu-footer">
                <span className="mobile-nav-user">Welcome, Admin</span>
                <button onClick={handleLogout} className="btn-outline mobile-btn">Logout</button>
              </div>
            </>
          ) : (
            // Client mobile navigation
            <>
              <Link to="/client/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/client/payments" className="mobile-nav-link" onClick={closeMobileMenu}>Payments</Link>
              <Link to="/client/messages" className="mobile-nav-link" onClick={closeMobileMenu}>Messages</Link>
              <Link to="/client/profile" className="mobile-nav-link" onClick={closeMobileMenu}>Profile</Link>
              <div className="mobile-menu-footer">
                <span className="mobile-nav-user">Welcome, {user.name || 'Client'}</span>
                <button onClick={handleLogout} className="btn-outline mobile-btn">Logout</button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
