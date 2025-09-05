export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  const error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  }

  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}