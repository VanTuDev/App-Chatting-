// express: Module Express để tạo và cấu hình máy chủ web.
import express from "express";
// dotenv: Module để đọc các biến môi trường từ file .env.
import dotenv from "dotenv";
//import authRoutes from "./routes/auth.routes.js";
import authRoutes from "./routes/auth.routes.js";
//connectToMongoDB: Hàm để kết nối đến cơ sở dữ liệu MongoDB.
import connectToMongoDB from "./db/connectToMongoDB.js";
import adminRoutes from "./routes/admin.routes.js"; // Thêm dòng này

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // Thêm dòng này

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
