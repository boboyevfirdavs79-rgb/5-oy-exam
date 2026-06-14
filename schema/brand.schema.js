const { Schema, model } = require("mongoose");

const Brand = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [50, "Name must not exceed 50 characters"],
    },
    image: {
      type: String,
      required: [true, "Brand image is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BrandSchema = model("Brand", Brand);
module.exports = BrandSchema;
