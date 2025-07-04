import express from "express";
import {
  createBlogPost,
  deleteAllBlogPosts,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
} from "../controllers/blog.controllers.js";
import { admin, protectRouter } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", getAllBlogPosts);
router.get("/:id", getBlogPostById);
router.post("/", protectRouter, createBlogPost);
router.put("/:id", protectRouter, updateBlogPost);
router.delete("/:id", protectRouter, deleteBlogPost);
router.delete("/", protectRouter, admin, deleteAllBlogPosts);
export default router;
