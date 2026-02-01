import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/auth.css';

const RegisterClient = () => {
  const role = 'client';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    houseNumber: '',
    street: '',
    state: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';

    const trimmedName = name.trim();

    // Check minimum length
    if (trimmedName.length < 3) return 'Name must be at least 3 characters long';

    // Check maximum length
    if (trimmedName.length > 50) return 'Name must be less than 50 characters';

    // Check for numbers or special characters at the beginning
    if (/^[^a-zA-Z]/.test(trimmedName)) return 'Name must start with a letter';

    // Check for only numbers
    if (/^\d+$/.test(trimmedName)) return 'Name cannot be only numbers';

    // Check for excessive numbers
    if (/\d{3,}/.test(trimmedName)) return 'Name cannot contain 3 or more numbers';

    // Check for valid name format (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';

    // Check for at least one space (first and last name)
    if (!/\s/.test(trimmedName)) return 'Please enter both first and last name';

    // Check for reasonable word count
    const words = trimmedName.split(/\s+/);
    if (words.length > 4) return 'Name appears too long - please use a shorter version';

    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';

    const trimmedEmail = email.trim().toLowerCase();

    // Check basic email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail)) return 'Please enter a valid email address';

    // Check for common typos
    if (trimmedEmail.includes('..')) return 'Email address cannot contain consecutive dots';
    if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return 'Email address cannot start or end with a dot';

    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[!@#$%^&*])/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';

    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const validateHouseNumber = (houseNumber) => {
    if (!houseNumber.trim()) return 'House number is required';
    const trimmed = houseNumber.trim();
    if (trimmed.length > 10) return 'House number must be less than 10 characters';
    if (!/^[a-zA-Z0-9\s\-\/]+$/.test(trimmed)) return 'House number can only contain letters, numbers, spaces, hyphens, and slashes';
    return '';
  };

  const validateStreet = (street) => {
    if (!street.trim()) return 'Street address is required';
    const trimmed = street.trim();
    if (trimmed.length < 3) return 'Street address must be at least 3 characters long';
    if (trimmed.length > 100) return 'Street address must be less than 100 characters';
    if (!/^[a-zA-Z0-9\s\-.,]+$/.test(trimmed)) return 'Street address contains invalid characters';
    return '';
  };

  const validateState = (state) => {
    if (!state.trim()) return 'State is required';
    const trimmed = state.trim();
    if (trimmed.length < 2) return 'State must be at least 2 characters long';
    if (trimmed.length > 50) return 'State must be less than 50 characters';
    if (!/^[a-zA-Z\s\-]+$/.test(trimmed)) return 'State can only contain letters, spaces, and hyphens';
    return '';
  };

  const validateCountry = (country) => {
    if (!country.trim()) return 'Country is required';
    const trimmed = country.trim();
    if (trimmed.length < 2) return 'Country must be at least 2 characters long';
    if (trimmed.length > 50) return 'Country must be less than 50 characters';
    if (!/^[a-zA-Z\s\-]+$/.test(trimmed)) return 'Country can only contain letters, spaces, and hyphens';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      houseNumber: validateHouseNumber(formData.houseNumber),
      street: validateStreet(formData.street),
      state: validateState(formData.state),
      country: validateCountry(formData.country)
    };

    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!acceptedTerms) {
      setErrors({ terms: 'You must accept the terms and conditions to register' });
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, {
        houseNumber: formData.houseNumber,
        street: formData.street,
        state: formData.state,
        country: formData.country
      }, role, formData.confirmPassword);
      navigate('/client/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🚀</div>
              <h1>Mystery-X PSP</h1>
            </div>
            <h2>Client Registration</h2>
            <p>Create your client account to access payment services</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="alert error">
                <span className="alert-icon">⚠️</span>
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                  required
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  className={errors.email ? 'error' : ''}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'error' : ''}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
              <div className="password-strength">
                <small>Password must contain: uppercase, lowercase, number, and special character</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="houseNumber">House Number</label>
              <div className="input-wrapper">
                <span className="input-icon">🏠</span>
                <input
                  id="houseNumber"
                  name="houseNumber"
                  type="text"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="123, 45A, etc."
                  className={errors.houseNumber ? 'error' : ''}
                  required
                  autoComplete="address-line1"
                />
              </div>
              {errors.houseNumber && <span className="field-error">{errors.houseNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <div className="input-wrapper">
                <span className="input-icon">🛣️</span>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Main Street, Oak Avenue, etc."
                  className={errors.street ? 'error' : ''}
                  required
                  autoComplete="address-line2"
                />
              </div>
              {errors.street && <span className="field-error">{errors.street}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <div className="input-wrapper">
                <span className="input-icon">🏛️</span>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Lagos, California, etc."
                  className={errors.state ? 'error' : ''}
                  required
                  autoComplete="address-level1"
                />
              </div>
              {errors.state && <span className="field-error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <div className="input-wrapper">
                <span className="input-icon">🌍</span>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Nigeria, United States, etc."
                  className={errors.country ? 'error' : ''}
                  required
                  autoComplete="country-name"
                />
              </div>
              {errors.country && <span className="field-error">{errors.country}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="checkmark"></span>
                I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>
              </label>
              {errors.terms && <span className="field-error">{errors.terms}</span>}
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="auth-button primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Client Account...
                </>
              ) : (
                'Create Client Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account?
              <Link to="/login" className="auth-link"> Sign in here</Link>
            </p>
            <p>
              <Link to="/register" className="auth-link">← Change Account Type</Link>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <h3>Client Account Benefits</h3>
            <p>Access secure payment processing and manage your transactions.</p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">💳</span>
                <span>Payment Processing</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Transaction History</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span>Support Messages</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👤</span>
                <span>Profile Management</span>
              </div>
            </div>

            <div className="security-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>SSL Encrypted</span>
              </div>
              <div className="badge">
                <span className="badge-icon">✅</span>
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;