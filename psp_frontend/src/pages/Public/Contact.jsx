import React, { useState } from 'react';
import Footer from '../../components/common/Footer';
import '../../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

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

    // Check for excessive numbers (more than 2 digits)
    if (/\d{3,}/.test(trimmedName)) return 'Name cannot contain 3 or more numbers';

    // Check for valid name format (letters, spaces, hyphens, apostrophes only)
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';

    // Check for at least one space (first and last name)
    if (!/\s/.test(trimmedName)) return 'Please enter both first and last name';

    // Check for minimum 2 words
    const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 2) return 'Please enter both first and last name';

    // Check for reasonable word lengths (no single letter words except I)
    for (const word of words) {
      if (word.length === 1 && word !== 'I') {
        return 'Name cannot contain single letter words (except I)';
      }
    }

    // Check for common spam patterns
    const spamPatterns = [
      /(.)\1{3,}/,  // Repeated characters
      /test/i,
      /spam/i,
      /fake/i,
      /dummy/i,
      /asdf/i,
      /qwerty/i
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(trimmedName)) {
        return 'Please enter a valid name';
      }
    }

    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email address is required';

    const trimmedEmail = email.trim().toLowerCase();

    // Check basic email format with stricter regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail)) return 'Please enter a valid email address';

    // Check for common typos and invalid patterns
    if (trimmedEmail.includes('..')) return 'Email address cannot contain consecutive dots';
    if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return 'Email address cannot start or end with a dot';
    if (trimmedEmail.includes('@.')) return 'Invalid email format';
    if (trimmedEmail.split('@').length !== 2) return 'Email address must contain exactly one @ symbol';

    // Check domain validity
    const domain = trimmedEmail.split('@')[1];
    if (!domain || domain.length < 4) return 'Please enter a valid email domain';
    if (!domain.includes('.')) return 'Email domain must contain a dot';

    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'temp-mail.org',
      'throwaway.email', 'yopmail.com', 'maildrop.cc', 'tempail.com'
    ];

    if (disposableDomains.some(disposable => domain.includes(disposable))) {
      return 'Please use a valid email address, not a temporary one';
    }

    // Check for common spam patterns
    const spamPatterns = [
      /noreply/i,
      /no-reply/i,
      /donotreply/i,
      /test/i,
      /spam/i,
      /fake/i,
      /example/i
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(trimmedEmail)) {
        return 'Please enter a valid email address';
      }
    }

    // Check length
    if (trimmedEmail.length > 254) return 'Email address is too long';

    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return ''; // Phone is optional

    const trimmedPhone = phone.trim();

    // Remove all non-digit characters for validation
    const digitsOnly = trimmedPhone.replace(/\D/g, '');

    // Check for Nigerian phone numbers with stricter validation
    const nigerianRegex = /^(\+?234|0)?[789]\d{9}$/;
    const internationalRegex = /^\+\d{10,15}$/;

    if (!nigerianRegex.test(trimmedPhone.replace(/\s+/g, '')) && !internationalRegex.test(trimmedPhone.replace(/\s+/g, ''))) {
      return 'Please enter a valid Nigerian phone number (080..., 081..., 090..., +234...) or international number';
    }

    // Check for valid Nigerian prefixes
    const nigerianPrefixes = ['080', '081', '090', '070', '091'];
    const prefix = digitsOnly.substring(0, 3);
    if (digitsOnly.length === 11 && !nigerianPrefixes.includes('0' + prefix.substring(1))) {
      return 'Please enter a valid Nigerian phone number starting with 080, 081, 090, 070, or 091';
    }

    // Check length
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return 'Phone number must be between 10 and 15 digits';
    }

    return '';
  };

  const validateSubject = (subject) => {
    if (!subject.trim()) return 'Subject is required';

    const trimmedSubject = subject.trim();

    if (trimmedSubject.length < 5) return 'Subject must be at least 5 characters long';
    if (trimmedSubject.length > 100) return 'Subject must be less than 100 characters';

    // Check for meaningful content
    if (/^\d+$/.test(trimmedSubject)) return 'Subject cannot be only numbers';
    if (/^(.)\1{4,}/.test(trimmedSubject)) return 'Subject cannot contain excessive repeated characters';

    // Check for minimum word count
    const words = trimmedSubject.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 1) return 'Subject must contain at least one word';

    // Check for spam patterns
    const spamPatterns = [
      /test/i,
      /spam/i,
      /fake/i,
      /dummy/i,
      /asdf/i,
      /qwerty/i,
      /hello/i,
      /hi there/i,
      /urgent/i,
      /important/i
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(trimmedSubject)) {
        return 'Please provide a meaningful subject';
      }
    }

    return '';
  };

  const validateMessage = (message) => {
    if (!message.trim()) return 'Message is required';

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 20) return 'Message must be at least 20 characters long';
    if (trimmedMessage.length > 1000) return 'Message must be less than 1000 characters';

    // Check for meaningful content
    const words = trimmedMessage.split(/\s+/).filter(word => word.length > 0);
    if (words.length < 5) return 'Message must contain at least 5 words';

    // Check for excessive repetition
    if (/^(.)\1{10,}/.test(trimmedMessage.replace(/\s/g, ''))) {
      return 'Message cannot contain excessive repeated characters';
    }

    // Check for spam patterns
    const spamPatterns = [
      /test/i,
      /spam/i,
      /fake/i,
      /dummy/i,
      /lorem ipsum/i,
      /asdf/i,
      /qwerty/i,
      /hello world/i,
      /this is a test/i,
      /please ignore/i
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(trimmedMessage)) {
        return 'Please provide a meaningful message';
      }
    }

    // Check for minimum sentence structure
    if (!/[.!?]/.test(trimmedMessage)) {
      return 'Message must contain at least one sentence ending with a period, exclamation mark, or question mark';
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message)
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

    // Prevent submission if already loading
    if (status.loading) return;

    setStatus({ loading: true, error: '', success: '' });

    // First validate all fields
    const isValid = validateForm();

    if (!isValid) {
      setStatus({
        loading: false,
        error: 'Please correct all validation errors before submitting your message.',
        success: ''
      });
      return;
    }

    // Additional security checks
    const securityChecks = [
      { field: 'name', validator: validateName, value: formData.name },
      { field: 'email', validator: validateEmail, value: formData.email },
      { field: 'phone', validator: validatePhone, value: formData.phone },
      { field: 'subject', validator: validateSubject, value: formData.subject },
      { field: 'message', validator: validateMessage, value: formData.message }
    ];

    const securityErrors = {};
    let hasSecurityErrors = false;

    for (const check of securityChecks) {
      const error = check.validator(check.value);
      if (error) {
        securityErrors[check.field] = error;
        hasSecurityErrors = true;
      }
    }

    if (hasSecurityErrors) {
      setErrors(securityErrors);
      setStatus({
        loading: false,
        error: 'Security validation failed. Please ensure all information is valid and try again.',
        success: ''
      });
      return;
    }

    // Final spam detection
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'free money', 'bitcoin scam',
      'urgent business', 'inheritance', 'prince', 'nigeria oil', 'bank account'
    ];

    const combinedText = `${formData.name} ${formData.subject} ${formData.message}`.toLowerCase();

    for (const keyword of spamKeywords) {
      if (combinedText.includes(keyword)) {
        setStatus({
          loading: false,
          error: 'Your message appears to contain spam content. Please provide genuine inquiry details.',
          success: ''
        });
        return;
      }
    }

    // Simulate API call with realistic delay
    setTimeout(() => {
      setStatus({
        loading: false,
        error: '',
        success: 'Thank you! Your message has been sent successfully. Our support team will respond within 24 hours.'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    }, 2500);
  };

  return (
    <>
      <main className="contact-page container py-12">
        <header className="contact-header centered">
          <div className="greeting-wrapper">
            <span className="hero-greeting">Get In Touch</span>
          </div>

          <h1 className="hero-title">
            Contact Our <br />
            <span>Expert Support Team</span>
          </h1>

          <p className="hero-lead mx-auto">
            Have questions about our payment services, need technical support, or want to learn more
            about Mystery-X PSP? Our dedicated team is here to help you succeed with comprehensive,
            reliable assistance.
          </p>
        </header>

        <div className="contact-content">
          <div className="contact-card elevated">
            <h2 className="contact-title">Send us a Message</h2>
            <p className="contact-sub">Questions about services, billing, or support? Send us a detailed message and we'll respond promptly.</p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {status.error && <div className="alert error">{status.error}</div>}
              {status.success && <div className="alert success">{status.success}</div>}

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name (First and Last)"
                  className={errors.name ? 'error' : ''}
                  required
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  className={errors.email ? 'error' : ''}
                  required
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 123 4567 or 08001234567"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
                <small className="field-help">For Nigerian numbers: 080..., 081..., 090..., etc.</small>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your inquiry"
                  className={errors.subject ? 'error' : ''}
                  required
                />
                {errors.subject && <span className="field-error">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your inquiry. Include any relevant account details, error messages, or specific questions."
                  rows="6"
                  className={errors.message ? 'error' : ''}
                  required
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
                <small className="field-help">{formData.message.length}/1000 characters</small>
              </div>

              <div className="actions">
                <button type="submit" className="btn-primary" disabled={status.loading}>
                  {status.loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          <aside className="contact-info">
            <div className="info-card elevated">
              <h3>Contact Information</h3>
              <p className="muted">Multiple ways to reach our expert support team</p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon email-icon">✉</div>
                  <div className="method-content">
                    <h4>Email Support</h4>
                    <p>For general inquiries, technical support, and detailed questions</p>
                    <a href="mailto:support@mystery-x.com">support@mystery-x.com</a>
                    <span className="response-time">Response within 24 hours</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon phone-icon">📞</div>
                  <div className="method-content">
                    <h4>Phone Support</h4>
                    <p>Mon-Fri, 9 AM - 6 PM WAT (West Africa Time)</p>
                    <a href="tel:+2348001234567">+234 (0) 800 123 4567</a>
                    <span className="response-time">Immediate assistance available</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon office-icon">🏢</div>
                  <div className="method-content">
                    <h4>Head Office</h4>
                    <p>Visit our headquarters for in-person support</p>
                    <address>
                      123 Business District<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </address>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon hours-icon">🕒</div>
                  <div className="method-content">
                    <h4>Business Hours</h4>
                    <div className="hours-grid">
                      <div className="hours-item">
                        <span className="day">Monday - Friday</span>
                        <span className="time">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Saturday</span>
                        <span className="time">10:00 AM - 2:00 PM</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Sunday</span>
                        <span className="time">Emergency Support Only</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon emergency-icon">🚨</div>
                  <div className="method-content">
                    <h4>Emergency Support</h4>
                    <p>For critical payment processing issues</p>
                    <a href="tel:+2348001234567">+234 (0) 800 123 4567</a>
                    <span className="response-time">24/7 emergency line</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card elevated">
              <h3>Quick Help Resources</h3>
              <p className="muted">Find answers to common questions</p>

              <div className="quick-help">
                <div className="help-item">
                  <h4>🔐 Security Questions</h4>
                  <p>Learn about our bank-level security and PCI compliance</p>
                </div>

                <div className="help-item">
                  <h4>💳 Payment Methods</h4>
                  <p>We support all major cards, bank transfers, and cryptocurrencies</p>
                </div>

                <div className="help-item">
                  <h4>🔧 API Integration</h4>
                  <p>Comprehensive documentation and developer support available</p>
                </div>

                <div className="help-item">
                  <h4>📊 Account Setup</h4>
                  <p>Step-by-step guides for getting started with Mystery-X PSP</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
