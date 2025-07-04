import Category from "../models/category.models.js";
import asyncHandler from "express-async-handler";

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name, description });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete all categories
const deleteAllCategories = asyncHandler(async (req, res) => {
  try {
    await Category.deleteMany({});
    res.status(200).json({ message: "All categories deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get category by id
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
  getAllCategories,
  getCategoryById
};