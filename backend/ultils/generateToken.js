// Import thư viện jsonwebtoken để tạo mã thông báo JWT
import jwt from "jsonwebtoken";

// Hàm generateTokenAndSetCookie để tạo mã thông báo và thiết lập cookie
const generateTokenAndSetCookie = (userId, res) => {
  // Tạo mã thông báo JWT với userId làm payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Thời hạn hiệu lực của mã thông báo là 15 ngày
  });

  // Thiết lập cookie với tên 'jwt' và giá trị là mã thông báo vừa tạo
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // Thời hạn hiệu lực của cookie là 15 ngày (tính bằng millisecond)
    httpOnly: true, // Ngăn chặn các cuộc tấn công XSS bằng cách không cho phép truy cập cookie từ JavaScript phía client
    sameSite: "strict", // Chỉ cho phép cookie được gửi cùng với các yêu cầu từ cùng một trang web
  });
};

export default generateTokenAndSetCookie;
