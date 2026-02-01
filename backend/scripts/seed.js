import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Profile from '../src/models/Profile.js';
import logger from '../src/utils/logger.js';

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL_ATLAS);
    logger.info('Connected to database for seeding');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@mystery-x.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@mystery-x.com',
      password: 'Admin123!',
      role: 'admin',
      isEmailVerified: true
    });

    await admin.save();

    // Create admin profile
    const profile = new Profile({
      userId: admin._id,
      settings: {
        notifications: {
          email: true,
          sms: true,
          paymentReminders: true,
          messageNotifications: true
        }
      }
    });

    await profile.save();

    logger.info('✅ Admin user created successfully');
    logger.info('Email: admin@mystery-x.com');
    logger.info('Password: Admin123!');

  } catch (error) {
    logger.error('Seeding error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

// Run seeder
seedDatabase()
  .then(() => {
    logger.info('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seeding failed:', error);
    process.exit(1);
  });