const CustomErrorHandler = require("../error/error");
const CarSchema = require("../schema/car.schema");
const BrandSchema = require("../schema/brand.schema");

const getAllCars = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await CarSchema.countDocuments();
    const cars = await CarSchema.find()
      .populate("brand")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: cars,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCarsByBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    const brand = await BrandSchema.findById(brandId);
    if (!brand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const total = await CarSchema.countDocuments({ brand: brandId });
    const cars = await CarSchema.find({ brand: brandId })
      .populate("brand")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      brand,
      data: cars,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOneCar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await CarSchema.findById(id).populate("brand");

    if (!car) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

const searchCars = async (req, res, next) => {
  try {
    const { q, brand, min_price, max_price, color, year, gearbox } = req.query;

    const filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    if (brand) {
      filter.brand = brand;
    }

    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }

    if (color) {
      filter.color = { $regex: color, $options: "i" };
    }

    if (year) {
      filter.year = Number(year);
    }

    if (gearbox) {
      filter.gearbox = gearbox;
    }

    const cars = await CarSchema.find(filter).populate("brand");

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    next(error);
  }
};

const addCar = async (req, res, next) => {
  try {
    const {
      brand,
      name,
      registration,
      engine,
      year,
      color,
      mileage,
      gearbox,
      price,
      description,
    } = req.body;

    const brandExists = await BrandSchema.findById(brand);
    if (!brandExists) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    const files = req.files;

    if (!files || !files.exterior_image || !files.interior_image || !files.thumbnail) {
      throw CustomErrorHandler.BadRequest(
        "All images are required: exterior_image, interior_image, thumbnail"
      );
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:4001";

    const car = await CarSchema.create({
      brand,
      name,
      registration,
      engine: Number(engine),
      year: Number(year),
      color,
      mileage: Number(mileage),
      gearbox,
      price: Number(price),
      description,
      exterior_image: `${baseUrl}/uploads/${files.exterior_image[0].filename}`,
      interior_image: `${baseUrl}/uploads/${files.interior_image[0].filename}`,
      thumbnail: `${baseUrl}/uploads/${files.thumbnail[0].filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: car,
    });
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      brand,
      name,
      registration,
      engine,
      year,
      color,
      mileage,
      gearbox,
      price,
      description,
    } = req.body;

    const car = await CarSchema.findById(id);

    if (!car) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    if (brand) {
      const brandExists = await BrandSchema.findById(brand);
      if (!brandExists) {
        throw CustomErrorHandler.NotFound("Brand not found");
      }
    }

    const updateData = {
      brand,
      name,
      registration,
      engine: engine ? Number(engine) : car.engine,
      year: year ? Number(year) : car.year,
      color,
      mileage: mileage ? Number(mileage) : car.mileage,
      gearbox,
      price: price ? Number(price) : car.price,
      description,
    };

    const baseUrl = process.env.BASE_URL || "http://localhost:4001";
    const files = req.files;

    if (files) {
      if (files.exterior_image) {
        updateData.exterior_image = `${baseUrl}/uploads/${files.exterior_image[0].filename}`;
      }
      if (files.interior_image) {
        updateData.interior_image = `${baseUrl}/uploads/${files.interior_image[0].filename}`;
      }
      if (files.thumbnail) {
        updateData.thumbnail = `${baseUrl}/uploads/${files.thumbnail[0].filename}`;
      }
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    await CarSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const car = await CarSchema.findById(id);

    if (!car) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    await CarSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getCarsByBrand,
  getOneCar,
  searchCars,
  addCar,
  updateCar,
  deleteCar,
};
