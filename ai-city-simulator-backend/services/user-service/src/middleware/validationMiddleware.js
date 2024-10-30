// eslint-disable-next-line no-unused-vars
import Joi from 'joi';  // Importing Joi for schema validation
import createError from 'http-errors';  // Importing createError for error handling

// Middleware to validate request body against a given schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);  // Validate the request body
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(createError(400, errorMessage));  // Pass a 400 error to the next middleware
    }
    next();  // Proceed if validation passes
  };
};

export default validate;
