import express from "express";
import { createCategory, deleteAllCategories, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controllers.js";
import { admin, protectRouter } from "../middlewares/auth.js";


const router = express.Router();
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/",protectRouter, createCategory)
router.put("/:id", protectRouter, updateCategory);
router.delete("/:id", protectRouter, deleteCategory);
router.delete("/", protectRouter,admin, deleteAllCategories);



export default router;