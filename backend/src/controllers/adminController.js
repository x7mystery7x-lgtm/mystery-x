import User from '../models/User.js';
import Address from '../models/Address.js';
import Payment from '../models/Payment.js';
import Message from '../models/Message.js';
import logger from '../utils/logger.js';

export const adminController = {
  // Get all clients with filters
  async getClients(req, res) {
    try {
      const { email, uuid, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      let filter = { role: 'client' };

      if (email) {
        filter.email = { $regex: email, $options: 'i' };
      }

      if (uuid) {
        // Find users with addresses matching the UUID
        const addresses = await Address.find({ uuid: { $regex: uuid, $options: 'i' } });
        const userIds = addresses.map(addr => addr.userId);
        filter._id = { $in: userIds };
      }

      const clients = await User.find(filter)
        .populate('profile')
        .populate('address')
        .select('-password -refreshTokens')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      res.json({
        success: true,
        clients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get clients error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get clients'
      });
    }
  },

  // Get client by ID
  async getClientById(req, res) {
    try {
      const { id } = req.params;

      const client = await User.findById(id)
        .populate('profile')
        .populate('address')
        .select('-password -refreshTokens');

      if (!client || client.role !== 'client') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      res.json({
        success: true,
        client
      });
    } catch (error) {
      logger.error('Get client by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get client'
      });
    }
  },

  // Update client (limited fields)
  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const { name, isEmailVerified } = req.body;

      const client = await User.findById(id);

      if (!client || client.role !== 'client') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Only allow updating specific fields
      if (name !== undefined) client.name = name;
      if (isEmailVerified !== undefined) client.isEmailVerified = isEmailVerified;

      await client.save();

      logger.info(`Client updated by admin: ${client.email}`);

      res.json({
        success: true,
        message: 'Client updated successfully',
        client: {
          id: client._id,
          name: client.name,
          email: client.email,
          isEmailVerified: client.isEmailVerified
        }
      });
    } catch (error) {
      logger.error('Update client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update client'
      });
    }
  },

  // Get all payments with filters
  async getPayments(req, res) {
    try {
      const { month, year, uuid, email, status, page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};

      if (month) filter.month = parseInt(month);
      if (year) filter.year = parseInt(year);
      if (status) filter.status = status;
      if (uuid) filter.addressUuid = { $regex: uuid, $options: 'i' };

      if (email) {
        // Find users with matching email
        const users = await User.find({ email: { $regex: email, $options: 'i' } });
        const userIds = users.map(user => user._id);
        filter.userId = { $in: userIds };
      }

      const payments = await Payment.find(filter)
        .populate('user', 'name email')
        .populate('address', 'uuid fullAddress')
        .sort({ year: -1, month: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Payment.countDocuments(filter);

      res.json({
        success: true,
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get payments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payments'
      });
    }
  },

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found'
        });
      }

      payment.status = status;
      if (notes !== undefined) payment.notes = notes;

      // If marking as paid, set payment date
      if (status === 'paid' && payment.status !== 'paid') {
        payment.paymentDate = new Date();
      }

      await payment.save();
      await payment.populate('user', 'name email');
      await payment.populate('address', 'uuid fullAddress');

      logger.info(`Payment status updated by admin: ${payment._id}, status: ${status}`);

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        payment
      });
    } catch (error) {
      logger.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update payment status'
      });
    }
  },

  // Get all messages
  async getMessages(req, res) {
    try {
      const { userId, page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};

      if (userId) {
        filter.$or = [
          { fromUserId: userId },
          { toUserId: userId }
        ];
      }

      const messages = await Message.find(filter)
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Message.countDocuments(filter);

      res.json({
        success: true,
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get messages'
      });
    }
  },

  // Send message to client
  async sendMessage(req, res) {
    try {
      const { toUserId, subject, body, priority, category } = req.body;
      const fromUserId = req.user._id;

      // Verify recipient exists and is a client
      const recipient = await User.findById(toUserId);
      if (!recipient || recipient.role !== 'client') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }

      // Create message
      const message = new Message({
        fromUserId,
        toUserId,
        subject,
        body,
        priority: priority || 'normal',
        category: category || 'admin'
      });

      await message.save();
      await message.populate('sender', 'name email');
      await message.populate('recipient', 'name email');

      logger.info(`Admin message sent to client: ${recipient.email}`);

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      logger.error('Send admin message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  },

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const totalClients = await User.countDocuments({ role: 'client' });
      const totalPayments = await Payment.countDocuments();
      const paidPayments = await Payment.countDocuments({ status: 'paid' });
      const pendingPayments = await Payment.countDocuments({ status: 'pending' });
      const totalMessages = await Message.countDocuments();

      // Recent activity
      const recentPayments = await Payment.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentMessages = await Message.find()
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        stats: {
          totalClients,
          totalPayments,
          paidPayments,
          pendingPayments,
          totalMessages,
          paymentCompletionRate: totalPayments > 0 ? (paidPayments / totalPayments * 100).toFixed(1) : 0
        },
        recentActivity: {
          payments: recentPayments,
          messages: recentMessages
        }
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard statistics'
      });
    }
  }
};