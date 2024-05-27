const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    err: err.stack,
  });
};
const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //dont leak error information to clints
    res.status(500).json({
      status: "error",
      message: "something went wrong in server",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProduction(err, res);
  }
};

module.exports = globalErrorHandler;
