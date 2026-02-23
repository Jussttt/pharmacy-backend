const AppError = require("../utils/AppError");

module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized access", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: You do not have permission", 403)
      );
    }

    next();
  };
};