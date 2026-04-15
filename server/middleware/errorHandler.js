export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}