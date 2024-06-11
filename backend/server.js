// express: Module Express để tạo và cấu hình máy chủ web.
import express from "express";
// dotenv: Module để đọc các biến môi trường từ file .env.
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);
// Connect to MongoDB
connectToMongoDB()
  .then(() => {
    // Sau khi kết nối thành công, bắt đầu lắng nghe yêu cầu trên cổng đã chọn
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
