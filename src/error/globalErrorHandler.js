const mongoose = require('mongoose');
const ApiError = require('./handleApiError');

const globalErrorHandler = (err, req, res, next) => {
  console.error(' Global Error:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorMessages = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [{ path: '', message: err.message }];
  }

  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = Object.values(err.errors).map((el) => ({
      path: el.path,
      message: el.message,
    }));
  }

  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid ID format';
    errorMessages = [{ path: err.path, message: err.message }];
  }

  else {
    errorMessages = [{ path: '', message: err?.message || message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
};

module.exports = globalErrorHandler;
