import Joi from 'joi';

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),

    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.empty': 'Password is required'
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Password confirmation is required'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),

    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required'
      })
  }),

  updateProfile: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      })
  }).min(1),

  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'string.empty': 'Current password is required'
      }),

    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.empty': 'New password is required'
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Password confirmation is required'
      })
  })
};

// Address validation schemas
export const addressSchemas = {
  create: Joi.object({
    houseNumber: Joi.string()
      .trim()
      .max(20)
      .required()
      .messages({
        'string.empty': 'House number is required',
        'string.max': 'House number cannot exceed 20 characters'
      }),

    street: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Street is required',
        'string.min': 'Street must be at least 3 characters long',
        'string.max': 'Street cannot exceed 100 characters'
      }),

    state: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'State is required',
        'string.min': 'State must be at least 2 characters long',
        'string.max': 'State cannot exceed 50 characters'
      }),

    country: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Country is required',
        'string.min': 'Country must be at least 2 characters long',
        'string.max': 'Country cannot exceed 50 characters'
      })
  }),

  update: Joi.object({
    houseNumber: Joi.string()
      .trim()
      .max(20)
      .messages({
        'string.max': 'House number cannot exceed 20 characters'
      }),

    street: Joi.string()
      .trim()
      .min(3)
      .max(100)
      .messages({
        'string.min': 'Street must be at least 3 characters long',
        'string.max': 'Street cannot exceed 100 characters'
      }),

    state: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'State must be at least 2 characters long',
        'string.max': 'State cannot exceed 50 characters'
      }),

    country: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Country must be at least 2 characters long',
        'string.max': 'Country cannot exceed 50 characters'
      })
  }).min(1)
};

// Payment validation schemas
export const paymentSchemas = {
  createMock: Joi.object({
    month: Joi.number()
      .integer()
      .min(1)
      .max(12)
      .required()
      .messages({
        'number.base': 'Month must be a number',
        'number.min': 'Month must be between 1 and 12',
        'number.max': 'Month must be between 1 and 12',
        'any.required': 'Month is required'
      }),

    year: Joi.number()
      .integer()
      .min(2020)
      .max(2030)
      .required()
      .messages({
        'number.base': 'Year must be a number',
        'number.min': 'Year must be between 2020 and 2030',
        'number.max': 'Year must be between 2020 and 2030',
        'any.required': 'Year is required'
      })
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid('paid', 'unpaid', 'pending', 'overdue')
      .required()
      .messages({
        'any.only': 'Status must be one of: paid, unpaid, pending, overdue',
        'any.required': 'Status is required'
      }),

    notes: Joi.string()
      .max(500)
      .allow('')
      .messages({
        'string.max': 'Notes cannot exceed 500 characters'
      })
  })
};

// Message validation schemas
export const messageSchemas = {
  create: Joi.object({
    toUserId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.hex': 'Invalid recipient ID format',
        'string.length': 'Invalid recipient ID format',
        'any.required': 'Recipient is required'
      }),

    subject: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Subject is required',
        'string.min': 'Subject cannot be empty',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),

    body: Joi.string()
      .trim()
      .min(1)
      .max(5000)
      .required()
      .messages({
        'string.empty': 'Message body is required',
        'string.min': 'Message body cannot be empty',
        'string.max': 'Message body cannot exceed 5000 characters',
        'any.required': 'Message body is required'
      }),

    priority: Joi.string()
      .valid('low', 'normal', 'high', 'urgent')
      .default('normal')
      .messages({
        'any.only': 'Priority must be one of: low, normal, high, urgent'
      }),

    category: Joi.string()
      .valid('general', 'payment', 'support', 'notification', 'admin')
      .default('general')
      .messages({
        'any.only': 'Category must be one of: general, payment, support, notification, admin'
      })
  }),

  markAsRead: Joi.object({
    messageId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.hex': 'Invalid message ID format',
        'string.length': 'Invalid message ID format',
        'any.required': 'Message ID is required'
      })
  })
};

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};