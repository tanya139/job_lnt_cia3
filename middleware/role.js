function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('You do not have permission for this action');
      error.statusCode = 403;
      error.errorCode = 'FORBIDDEN';
      return next(error);
    }
    next();
  };
}

module.exports = allowRoles;
