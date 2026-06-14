const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken");

module.exports = function adminChecker(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw CustomErrorHandler.BadRequest("Token not found");
    }

    const bearer = token.split(" ")[0];
    const partOfToken = token.split(" ")[1];

    if (bearer !== "Bearer" || !partOfToken) {
      throw CustomErrorHandler.BadRequest("Invalid Bearer token format");
    }

    const decode = jwt.verify(partOfToken, process.env.SECRET_KEY);
    req.user = decode;

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      throw CustomErrorHandler.Forbidden("Access denied: admin or superadmin role required");
    }

    next();
  } catch (error) {
    next(error);
  }
};
