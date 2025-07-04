import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import Blog from "../models/blog.models.js";
import { generateToken } from "../middlewares/auth.js";


const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    if (user) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update password base on old password
const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id; // 👈 lấy từ req.user
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).populate('likedBlogs');
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate('likedBlogs');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const update = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      // If a new password is provided, hash it
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        phone: updatedUser.phone,
        // Do not send password or token back in update response for security
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Thêm blog vào danh sách yêu thích của user và cập nhật blog.likes
const addLikedBlog = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const { blogId } = req.body;

  const user = await User.findById(userId);
  const blog = await Blog.findById(blogId);

  if (!user || !blog) {
    return res.status(404).json({ message: "User or Blog not found" });
  }

  const blogIndex = user.likedBlogs.findIndex(
    (b) => b.toString() === blogId
  );

  let action = "";

  if (blogIndex > -1) {
    // Unlike: Remove from both user.likedBlogs and blog.likes
    user.likedBlogs.splice(blogIndex, 1);
    blog.likes = blog.likes.filter((u) => u.toString() !== userId);
    action = "removed";
  } else {
    // Like: Add to both user.likedBlogs and blog.likes
    user.likedBlogs.push(blogId);
    blog.likes.push(userId);
    action = "added";
  }

  await user.save();
  await blog.save();

  res.status(200).json({
    message: `Blog ${action === "added" ? "added to" : "removed from"} liked blogs`,
    likedBlogs: user.likedBlogs,
    action,
  });
});


// get liked blog by userId
const getLikedBlogDetail = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId).populate({
    path: 'likedBlogs',
    populate: [
      { path: 'author', select: 'name email' },
      { path: 'likes', select: 'name email' },  
    ],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user.likedBlogs);
});

const getLikedBlogs = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId).populate('likedBlogs');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user.likedBlogs);
});


export { register, login, getAllUsers, getUserById, update, addLikedBlog, getLikedBlogDetail, getLikedBlogs,updatePassword};
