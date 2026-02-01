import express from 'express';

const router = express.Router();

// Company information
router.get('/info', (req, res) => {
  res.json({
    company: "Mystery-X PSP",
    description: "Professional Payment Service Provider - Secure, reliable payment processing solutions",
    contact: {
      email: "support@mystery-x.com",
      phone: "+234-816-945-3274",
      address: "Lagos, Nigeria"
    },
    services: [
      "Payment Processing",
      "Transaction Management",
      "Client Portal",
      "Admin Dashboard",
      "Secure Messaging",
      "Payment Tracking"
    ],
    message: "Welcome to Mystery-X PSP API. Register to access our comprehensive payment solutions."
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Mystery-X PSP API',
    version: '1.0.0'
  });
});

export default router;