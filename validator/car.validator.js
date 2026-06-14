const { body, validationResult } = require("express-validator");

const carValidator = [
  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isMongoId()
    .withMessage("Invalid brand ID"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Car name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("registration")
    .optional()
    .isIn(["No", "Yes"])
    .withMessage("Registration must be 'No' or 'Yes'"),

  body("engine")
    .notEmpty()
    .withMessage("Engine volume is required")
    .isFloat({ min: 0.5, max: 10 })
    .withMessage("Engine volume must be between 0.5 and 10"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1990 and ${new Date().getFullYear() + 1}`),

  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required"),

  body("mileage")
    .notEmpty()
    .withMessage("Mileage is required")
    .isInt({ min: 0 })
    .withMessage("Mileage must be a positive number"),

  body("gearbox")
    .notEmpty()
    .withMessage("Gearbox type is required")
    .isIn(["Automatic", "Manual", "CVT", "Semi-automatic"])
    .withMessage("Invalid gearbox type"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isInt({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
];

const brandValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  carValidator,
  brandValidator,
  validate,
};
