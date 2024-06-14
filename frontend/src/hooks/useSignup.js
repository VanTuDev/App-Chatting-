import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullname,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    // Kiểm tra các lỗi nhập liệu
    const success = handleInputErrors({
      fullname,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;

    setLoading(true);
    try {
      // Gửi yêu cầu đăng ký đến máy chủ
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Lưu thông tin người dùng vào localStorage và cập nhật trạng thái xác thực
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);

      // Hiển thị thông báo thành công
      toast.success("Đăng ký thành công!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};
export default useSignup;

function handleInputErrors({
  fullname,
  username,
  password,
  confirmPassword,
  gender,
}) {
  // Kiểm tra nếu các trường bị bỏ trống
  if (!fullname || !username || !password || !confirmPassword || !gender) {
    toast.error("Vui lòng điền đầy đủ tất cả các trường");
    return false;
  }

  // Kiểm tra nếu trường fullname là null
  if (fullname === null) {
    toast.error("Họ và tên không được để trống");
    console.log("fullname is null");
    return false;
  }

  // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
  if (password !== confirmPassword) {
    toast.error("Mật khẩu không khớp");
    return false;
  }

  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    toast.error("Mật khẩu phải có ít nhất 6 ký tự");
    return false;
  }

  return true;
}
