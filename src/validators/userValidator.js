const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must have at least 2 characters',
      'string.max': 'Name must have at most 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must have a valid format',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .max(50)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must have at least 6 characters',
      'string.max': 'Password must have at most 50 characters',
      'string.pattern.base': 'Password must contain at least: 1 lowercase letter, 1 uppercase letter and 1 number',
      'any.required': 'Password is required'
    })
});

const validateUser = (userData) => {
  return userSchema.validate(userData, { abortEarly: false });
};

module.exports = {
  validateUser,
  userSchema
};
