import Blog from "../models/blog.models.js";
import asyncHandler from "express-async-handler";

// Create a new blog
const createBlogPost = asyncHandler(async (req, res) => {
  try {
    const { name, description, content, image, category } = req.body;
    // Check if blog post already exists
    const existingBlogPost = await Blog.findOne({ name });
    if (existingBlogPost) {
      return res.status(400).json({ message: "Blog post already exists" });
    }
    // Create new blog post
    const blogPost = await Blog.create({
      name,
      description,  
      content,
      image,
      category,
      user: req.user._id,
    });
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a blog post
const updateBlogPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, content, image, category } = req.body;
    // Check if blog post exists
    const existingBlogPost = await Blog.findById(id);
    if (!existingBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    // Update blog post
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      id,
      { name, description, content, image, category },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a blog post
const deleteBlogPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // Check if blog post exists
    const blogPost = await Blog.findByIdAndDelete(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete all blog posts
const deleteAllBlogPosts = asyncHandler(async (req, res) => {
  try {
    await Blog.deleteMany({});
    res.status(200).json({ message: "All blog posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all blog posts
const getAllBlogPosts = asyncHandler(async (req, res) => {
  try {
    const blogPosts = await Blog.find({})
      .populate("user", "name email")
      .populate("category", "name description")
      .sort({ createdAt: -1 });
    if (!blogPosts || blogPosts.length === 0) {
      return res.status(404).json({ message: "No blog posts found" });
    }
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getBlogPostById = asyncHandler(async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id)
      .populate("user", "name email")
      .populate("category", "name")
      .populate("likes", "name");

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  deleteAllBlogPosts,
};
