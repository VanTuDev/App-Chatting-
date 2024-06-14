import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false); // Khai báo state 'loading' để theo dõi trạng thái đăng nhập
  const { setAuthUser } = useAuthContext(); // Lấy hàm 'setAuthUser' từ context để cập nhật thông tin người dùng sau khi đăng nhập thành công

  const login = async (username, password) => {
    const success = handleInputErrors(username, password); // Kiểm tra lỗi đầu vào (username và password)
    if (!success) return; // Nếu có lỗi, kết thúc hàm login
    setLoading(true); // Bắt đầu quá trình đăng nhập, cập nhật trạng thái loading
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Gửi yêu cầu đăng nhập với username và password
      });

      const data = await res.json(); // Chuyển đổi phản hồi từ JSON
      if (data.error) {
        throw new Error(data.error); // Nếu có lỗi từ phản hồi, ném lỗi
      }

      localStorage.setItem("chat-user", JSON.stringify(data)); // Lưu thông tin người dùng vào localStorage
      setAuthUser(data); // Cập nhật thông tin người dùng vào context
    } catch (error) {
      toast.error(error.message); // Hiển thị thông báo lỗi nếu có lỗi trong quá trình đăng nhập
    } finally {
      setLoading(false); // Kết thúc quá trình đăng nhập, cập nhật trạng thái loading
    }
  };

  return { loading, login }; // Trả về trạng thái loading và hàm login để sử dụng ở các thành phần khác
};
export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields"); // Hiển thị thông báo lỗi nếu thiếu username hoặc password
    return false; // Trả về false để báo lỗi
  }

  return true; // Trả về true nếu không có lỗi
}
