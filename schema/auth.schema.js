const { Schema, model } = require("mongoose");

const User = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    otp: {
      type: String,
      required: true,
    },
    otpTime: {
      type: BigInt,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      default: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AuthSchema = model("User", User);
module.exports = AuthSchema;
