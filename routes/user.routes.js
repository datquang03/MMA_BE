import express from "express";
import { login, register, getAllUsers,getUserById, addLikedBlog, update, getLikedBlogs, getLikedBlogDetail, updatePassword } from "../controllers/user.controllers.js";
import { protectRouter } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers )
router.get("/:id", getUserById);
router.put("/:id", protectRouter, update);
router.post("/update-password", protectRouter, updatePassword);
router.post("/:id/liked-blogs", protectRouter, addLikedBlog);
router.get("/:id/liked-blogs", protectRouter, getLikedBlogs);
router.get("/:id/liked-blogs/details", protectRouter, getLikedBlogDetail);

export default router;
