import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Address from '../models/Address.js';
import Payment from '../models/Payment.js';
import Message from '../models/Message.js';
import logger from '../utils/logger.js';

export const userController = {
  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user._id;

      const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      logger.info(`Profile updated for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  },

  // Get user address
  async getAddress(req, res) {
    try {
      const address = await Address.findOne({ userId: req.user._id });

      res.json({
        success: true,
        address
      });
    } catch (error) {
      logger.error('Get address error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get address'
      });
    }
  },

  // Create or update address
  async updateAddress(req, res) {
    try {
      const addressData = req.body;
      const userId = req.user._id;

      let address = await Address.findOne({ userId });

      if (address) {
        // Update existing address
        Object.assign(address, addressData);
        await address.save();
      } else {
        // Create new address
        address = new Address({ ...addressData, userId });
        await address.save();
      }

      logger.info(`Address updated for user: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Address updated successfully',
        address: {
          id: address._id,
          houseNumber: address.houseNumber,
          street: address.street,
          state: address.state,
          country: address.country,
          uuid: address.uuid,
          fullAddress: address.fullAddress
        }
      });
    } catch (error) {
      logger.error('Update address error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update address'
      });
    }
  },

  // Get user payments
  async getPayments(req, res) {
    try {
      const { month, year, status } = req.query;
      const filters = {};

      if (month) filters.month = parseInt(month);
      if (year) filters.year = parseInt(year);
      if (status) filters.status = status;

      const payments = await Payment.getUserPayments(req.user._id, filters)
        .populate('address', 'uuid fullAddress')
        .sort({ year: -1, month: -1 });

      res.json({
        success: true,
        payments
      });
    } catch (error) {
      logger.error('Get payments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payments'
      });
    }
  },

  // Create mock payment
  async createMockPayment(req, res) {
    try {
      const { month, year } = req.body;
      const userId = req.user._id;

      // Check if address exists
      const address = await Address.findOne({ userId });
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Address required before creating payments'
        });
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        userId,
        month,
        year
      });

      if (existingPayment) {
        return res.status(409).json({
          success: false,
          error: 'Payment already exists for this month'
        });
      }

      // Create payment
      const payment = new Payment({
        userId,
        addressUuid: address.uuid,
        month,
        year,
        status: 'pending',
        amount: 50000 // Default amount
      });

      await payment.save();

      logger.info(`Mock payment created for user: ${req.user.email}, month: ${month}/${year}`);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        payment
      });
    } catch (error) {
      logger.error('Create mock payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment'
      });
    }
  },

  // Get user messages
  async getMessages(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const messages = await Message.find({ toUserId: req.user._id })
        .populate('sender', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Message.countDocuments({ toUserId: req.user._id });
      const unreadCount = await Message.getUnreadCount(req.user._id);

      res.json({
        success: true,
        messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      });
    } catch (error) {
      logger.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get messages'
      });
    }
  },

  // Send message
  async sendMessage(req, res) {
    try {
      const { toUserId, subject, body, priority, category } = req.body;
      const fromUserId = req.user._id;

      // Verify recipient exists
      const recipient = await User.findById(toUserId);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          error: 'Recipient not found'
        });
      }

      // Create message
      const message = new Message({
        fromUserId,
        toUserId,
        subject,
        body,
        priority: priority || 'normal',
        category: category || 'general'
      });

      await message.save();
      await message.populate('sender', 'name email');
      await message.populate('recipient', 'name email');

      logger.info(`Message sent from ${req.user.email} to ${recipient.email}`);

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  },

  // Mark message as read
  async markMessageAsRead(req, res) {
    try {
      const { messageId } = req.params;

      const message = await Message.findOne({
        _id: messageId,
        toUserId: req.user._id
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      await message.markAsRead();

      res.json({
        success: true,
        message: 'Message marked as read'
      });
    } catch (error) {
      logger.error('Mark message as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark message as read'
      });
    }
  }
};