import createError from 'http-errors';

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(createError(400, errorMessage));
    }
    next();
  };
};

export default validate;
