import createError from 'http-errors';

// Middleware to validate request body against a Joi schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(createError(400, errorMessage)); // Pass error to error handling middleware
    }
    next(); // Proceed to the next middleware or route handler
  };
};

export default validate;
