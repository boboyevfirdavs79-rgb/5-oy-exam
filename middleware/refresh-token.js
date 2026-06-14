const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken");
const { access_token, refresh_token } = require("../utils/token-generator");

module.exports = function refreshToken(req, res, next) {
  try {
    const token = req.headers.refreshtoken || req.cookies.refreshToken;

    if (!token) {
      throw CustomErrorHandler.BadRequest("Refresh token not found");
    }

    const decode = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

    const payload = {
      id: decode.id,
      email: decode.email,
      role: decode.role,
    };

    const newAccessToken = access_token(payload);
    const newRefreshToken = refresh_token(payload);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
