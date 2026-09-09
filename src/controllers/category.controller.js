const Category = require("../models/category.model");
const catchAsync = require("../utils/catchAsync");

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    created_by: req.user._id,
  });
  const savedCategory = await category.save();
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: savedCategory,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updated,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: deleted,
  });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};