function errorHandler(err, req, res, next) {
  console.error(err.message);
  const status = err.statusCode || (err.name === 'CastError' ? 404 : 500);
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({
    success: false,
    message,
    errorCode: err.errorCode || (status === 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR')
  });
}

module.exports = errorHandler;
