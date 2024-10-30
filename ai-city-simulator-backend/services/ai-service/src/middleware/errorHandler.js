import createError from 'http-errors';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res) => {
  logger.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!createError.isHttpError(err)) {
    err = createError(500, 'Internal Server Error');
  }

  const response = {
    error: {
      message: err.message,
      status: err.status || 500
    }
  };

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(response.error.status).json(response);
};

export default errorHandler;
