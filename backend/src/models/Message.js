import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  body: {
    type: String,
    required: [true, 'Message body is required'],
    maxlength: [5000, 'Message body cannot exceed 5000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  category: {
    type: String,
    enum: ['general', 'payment', 'support', 'notification', 'admin'],
    default: 'general'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
messageSchema.index({ fromUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, isRead: 1 });
messageSchema.index({ category: 1 });
messageSchema.index({ priority: 1 });

// Virtual for sender
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'fromUserId',
  foreignField: '_id',
  justOne: true,
  select: 'name email'
});

// Virtual for recipient
messageSchema.virtual('recipient', {
  ref: 'User',
  localField: 'toUserId',
  foreignField: '_id',
  justOne: true,
  select: 'name email'
});

// Pre-save middleware to validate users
messageSchema.pre('save', async function(next) {
  if (this.fromUserId.equals(this.toUserId)) {
    return next(new Error('Cannot send message to yourself'));
  }
  next();
});

// Instance method to mark as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(userId1, userId2, limit = 50) {
  return this.find({
    $or: [
      { fromUserId: userId1, toUserId: userId2 },
      { fromUserId: userId2, toUserId: userId1 }
    ]
  })
  .populate('sender', 'name email')
  .populate('recipient', 'name email')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get unread count for user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ toUserId: userId, isRead: false });
};

const Message = mongoose.model('Message', messageSchema);

export default Message;