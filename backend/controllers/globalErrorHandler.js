const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server message";
  res.status(err.statusCode).json({ message: err.message });
};

module.exports = globalErrorHandler;
