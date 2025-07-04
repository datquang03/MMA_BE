import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectBD } from "./config/connectBD.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);
app.get("/", (req, res) => {
    res.send("API is running...");
});




const PORT = process.env.PORT;
connectBD();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});