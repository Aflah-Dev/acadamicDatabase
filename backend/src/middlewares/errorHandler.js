// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate entry. Record already exists.";
  } else if (err.code === "23503") {
    statusCode = 400;
    message =
      err.customMessage ||
      "Invalid reference. Referenced record does not exist.";
  } else if (err.code === "23514") {
    statusCode = 400;
    message = "Data validation failed. Please check your input values.";
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input format.";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    error: message,
    statusCode: statusCode,
  });
};

// Not found handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
