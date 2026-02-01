import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  houseNumber: {
    type: String,
    required: [true, 'House number is required'],
    trim: true,
    maxlength: [20, 'House number cannot exceed 20 characters']
  },
  street: {
    type: String,
    required: [true, 'Street is required'],
    trim: true,
    maxlength: [100, 'Street cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  uuid: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
addressSchema.index({ country: 1, state: 1 });

// Pre-save middleware to generate UUID
addressSchema.pre('save', async function(next) {
  if (this.isNew && !this.uuid) {
    let uuid;
    let exists = true;
    let attempts = 0;

    // Generate unique UUID (with retry logic)
    while (exists && attempts < 10) {
      uuid = uuidv4();
      exists = await mongoose.models.Address.findOne({ uuid });
      attempts++;
    }

    if (exists) {
      return next(new Error('Failed to generate unique UUID'));
    }

    this.uuid = uuid;
  }
  next();
});

// Virtual for user
addressSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for full address
addressSchema.virtual('fullAddress').get(function() {
  return `${this.houseNumber} ${this.street}, ${this.state}, ${this.country}`;
});

// Static method to find by UUID
addressSchema.statics.findByUUID = function(uuid) {
  return this.findOne({ uuid, isActive: true });
};

const Address = mongoose.model('Address', addressSchema);

export default Address;