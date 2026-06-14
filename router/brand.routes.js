const { Router } = require("express");
const {
  getAllBrands,
  getOneBrand,
  addBrand,
  updateBrand,
  deleteBrand,
} = require("../controller/brand.controller");
const adminChecker = require("../middleware/admin.checker");
const multer = require("../config/multer");
const { brandValidator, validate } = require("../validator/car.validator");

const brandRouter = Router();

brandRouter.get("/brands", getAllBrands);
brandRouter.get("/brands/:id", getOneBrand);
brandRouter.post("/brands", adminChecker, multer.single("image"), brandValidator, validate, addBrand);
brandRouter.put("/brands/:id", adminChecker, multer.single("image"), updateBrand);
brandRouter.delete("/brands/:id", adminChecker, deleteBrand);

module.exports = brandRouter;
