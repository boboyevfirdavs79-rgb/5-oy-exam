const CustomErrorHandler = require("../error/error");
const BrandSchema = require("../schema/brand.schema");

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await BrandSchema.find();

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

const getOneBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await BrandSchema.findById(id);

    if (!brand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const addBrand = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      throw CustomErrorHandler.BadRequest("Brand image is required");
    }

    const existing = await BrandSchema.findOne({ name: name.toUpperCase() });
    if (existing) {
      throw CustomErrorHandler.BadRequest("This brand already exists");
    }

    const brand = await BrandSchema.create({
      name,
      image: `${process.env.BASE_URL || "http://localhost:4001"}/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Brand added successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const brand = await BrandSchema.findById(id);

    if (!brand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    const updateData = { name };

    if (req.file) {
      updateData.image = `${process.env.BASE_URL || "http://localhost:4001"}/uploads/${req.file.filename}`;
    }

    await BrandSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await BrandSchema.findById(id);

    if (!brand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    await BrandSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBrands,
  getOneBrand,
  addBrand,
  updateBrand,
  deleteBrand,
};
