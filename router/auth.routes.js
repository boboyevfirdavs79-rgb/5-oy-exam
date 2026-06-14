const { Router } = require("express");
const { register, verify, login, logout } = require("../controller/auth.controller");
const {
  registerValidator,
  loginValidator,
  verifyValidator,
  validate,
} = require("../validator/auth.validator");
const refreshToken = require("../middleware/refresh-token");

const authRouter = Router();

authRouter.post("/auth/register", registerValidator, validate, register);
authRouter.post("/auth/verify", verifyValidator, validate, verify);
authRouter.post("/auth/login", loginValidator, validate, login);
authRouter.get("/auth/refresh", refreshToken);
authRouter.post("/auth/logout", logout);

module.exports = authRouter;
