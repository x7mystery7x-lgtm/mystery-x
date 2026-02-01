import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, paymentSchemas, messageSchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Client management
router.get('/clients', adminController.getClients);
router.get('/clients/:id', adminController.getClientById);
router.patch('/clients/:id', adminController.updateClient);

// Payment management
router.get('/payments', adminController.getPayments);
router.patch('/payments/:id', validate(paymentSchemas.updateStatus), adminController.updatePaymentStatus);

// Message management
router.get('/messages', adminController.getMessages);
router.post('/messages', validate(messageSchemas.create), adminController.sendMessage);

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

export default router;