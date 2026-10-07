function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || 'Something went wrong on the server.'

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found.'
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }
  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `An account or record with that ${field} already exists.`
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack traces are never sent to the client, even in development here,
    // to keep responses consistent and avoid leaking internals.
  })
}

module.exports = { notFound, errorHandler }
