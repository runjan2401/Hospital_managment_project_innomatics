
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400); // ✅ Correctly assigning without redeclaring
  }
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(`Json Web Token is invalid, Try again!`, 400);
  }
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(`Json Web Token is expired, Try again!`, 400);
  }
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  // Extract error messages if `err.errors` exists
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
