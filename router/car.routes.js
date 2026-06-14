const { Router } = require("express");
const {
  getAllCars,
  getCarsByBrand,
  getOneCar,
  searchCars,
  addCar,
  updateCar,
  deleteCar,
} = require("../controller/car.controller");
const adminChecker = require("../middleware/admin.checker");
const multer = require("../config/multer");
const { carValidator, validate } = require("../validator/car.validator");

const carRouter = Router();

carRouter.get("/cars", getAllCars);
carRouter.get("/cars/search", searchCars);
carRouter.get("/cars/brand/:brandId", getCarsByBrand);
carRouter.get("/cars/:id", getOneCar);

carRouter.post(
  "/cars",
  adminChecker,
  multer.fields([
    { name: "exterior_image", maxCount: 1 },
    { name: "interior_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  carValidator,
  validate,
  addCar
);

carRouter.put(
  "/cars/:id",
  adminChecker,
  multer.fields([
    { name: "exterior_image", maxCount: 1 },
    { name: "interior_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateCar
);

carRouter.delete("/cars/:id", adminChecker, deleteCar);

module.exports = carRouter;
