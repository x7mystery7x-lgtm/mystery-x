import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, userSchemas, addressSchemas, paymentSchemas, messageSchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.patch('/me/profile', validate(userSchemas.updateProfile), userController.updateProfile);
router.patch('/me/password', validate(userSchemas.changePassword), userController.changePassword);

// Address routes
router.get('/me/address', userController.getAddress);
router.post('/me/address', validate(addressSchemas.create), userController.updateAddress);
router.patch('/me/address', validate(addressSchemas.update), userController.updateAddress);

// Payment routes
router.get('/me/payments', userController.getPayments);
router.post('/me/payments/mock-pay', validate(paymentSchemas.createMock), userController.createMockPayment);

// Message routes
router.get('/me/messages', userController.getMessages);
router.post('/me/messages', validate(messageSchemas.create), userController.sendMessage);
router.patch('/me/messages/:messageId/read', validate(messageSchemas.markAsRead), userController.markMessageAsRead);

export default router;