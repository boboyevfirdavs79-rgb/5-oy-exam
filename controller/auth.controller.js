const bcrypt = require("bcryptjs");
const CustomErrorHandler = require("../error/error");
const AuthSchema = require("../schema/auth.schema");
const sendEmail = require("../utils/email-sender");
const { access_token, refresh_token } = require("../utils/token-generator");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await AuthSchema.findOne({ email });
    if (existingEmail) {
      throw CustomErrorHandler.BadRequest("This email is already registered");
    }

    const existingUsername = await AuthSchema.findOne({ username });
    if (existingUsername) {
      throw CustomErrorHandler.BadRequest("This username is already taken");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTime = BigInt(Date.now() + 3 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await AuthSchema.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpTime,
    });

    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. A verification code has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await AuthSchema.findOne({ email });

    if (!user) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    if (user.otp !== otp) {
      throw CustomErrorHandler.BadRequest("Invalid verification code");
    }

    const now = BigInt(Date.now());
    if (now > user.otpTime) {
      throw CustomErrorHandler.BadRequest("Verification code has expired");
    }

    await AuthSchema.updateOne({ email }, { otp: "", otpTime: BigInt(0) });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await AuthSchema.findOne({ email });

    if (!user) {
      throw CustomErrorHandler.NotFound("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw CustomErrorHandler.BadRequest("Invalid email or password");
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = access_token(payload);
    const refreshToken = refresh_token(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  logout,
};
