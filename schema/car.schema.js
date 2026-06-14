const { Schema, model } = require("mongoose");

const Car = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Car brand is required"],
    },
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
      uppercase: true,
      maxLength: [100, "Name must not exceed 100 characters"],
    },
    registration: {
      type: String,
      enum: {
        values: ["No", "Yes"],
        message: "{VALUE} is not valid. Use 'No' or 'Yes'",
      },
      default: "No",
    },
    engine: {
      type: Number,
      required: [true, "Engine volume is required"],
      min: [0.5, "Engine volume cannot be less than 0.5"],
      max: [10, "Engine volume cannot exceed 10"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1990, "Cars older than 1990 are not accepted"],
      max: [new Date().getFullYear() + 1, "Future year is not allowed"],
    },
    color: {
      type: String,
      required: [true, "Car color is required"],
      trim: true,
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
      min: [0, "Mileage cannot be negative"],
    },
    gearbox: {
      type: String,
      required: [true, "Gearbox type is required"],
      enum: {
        values: ["Automatic", "Manual", "CVT", "Semi-automatic"],
        message: "{VALUE} is not a valid gearbox type",
      },
      default: "Automatic",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [10, "Description must be at least 10 characters"],
    },
    exterior_image: {
      type: String,
      required: [true, "Exterior 360 image is required"],
    },
    interior_image: {
      type: String,
      required: [true, "Interior 360 image is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CarSchema = model("Car", Car);
module.exports = CarSchema;
