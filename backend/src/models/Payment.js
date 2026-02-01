import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressUuid: {
    type: String,
    required: true,
    ref: 'Address'
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'pending', 'overdue'],
    default: 'unpaid'
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 50000 // Default monthly payment amount in NGN
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  transactionId: {
    type: String,
    sparse: true // Allow null but ensure uniqueness when present
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for performance
paymentSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
paymentSchema.index({ addressUuid: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ month: 1, year: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for user
paymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for address
paymentSchema.virtual('address', {
  ref: 'Address',
  localField: 'addressUuid',
  foreignField: 'uuid',
  justOne: true
});

// Pre-save middleware to set due date
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.dueDate) {
    // Set due date to last day of the month
    this.dueDate = new Date(this.year, this.month, 0);
  }
  next();
});

// Static method to get payments by user and date range
paymentSchema.statics.getUserPayments = function(userId, filters = {}) {
  const query = { userId };

  if (filters.month) query.month = filters.month;
  if (filters.year) query.year = filters.year;
  if (filters.status) query.status = filters.status;

  return this.find(query).sort({ year: -1, month: -1 });
};

// Static method to get payments by UUID
paymentSchema.statics.getPaymentsByUUID = function(uuid, filters = {}) {
  const query = { addressUuid: uuid };

  if (filters.month) query.month = filters.month;
  if (filters.year) query.year = filters.year;
  if (filters.status) query.status = filters.status;

  return this.find(query).populate('user', 'name email').sort({ year: -1, month: -1 });
};

// Instance method to mark as paid
paymentSchema.methods.markAsPaid = function(transactionId = null) {
  this.status = 'paid';
  this.paymentDate = new Date();
  if (transactionId) {
    this.transactionId = transactionId;
  }
  return this.save();
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;