// Import model User từ file user.model.js để tương tác với cơ sở dữ liệu MongoDB
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../ultils/generateToken.js";

// Hàm signup để xử lý việc đăng ký người dùng mới
export const signup = async (req, res) => {
  try {
    // Lấy dữ liệu người dùng từ yêu cầu (request) gửi lên
    const { fullname, username, password, confirmPassword, gender } = req.body;

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Mật khẩu và xác nhận mật khẩu không khớp" }); // Nếu không khớp, trả về lỗi
    }

    // Kiểm tra xem người dùng với username đã tồn tại trong cơ sở dữ liệu chưa
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Người dùng đã tồn tại" }); // Nếu tồn tại, trả về lỗi
    }

    // HASH PASSWORD
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Tạo URL ảnh đại diện dựa trên giới tính người dùng
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Tạo đối tượng người dùng mới với dữ liệu từ yêu cầu
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic, // Chọn ảnh đại diện dựa trên giới tính
    });

    if (newUser) {
      // Tạo JWT token tại đây
      // Lưu người dùng mới vào cơ sở dữ liệu
      await generateTokenAndSetCookie(newUser.id, res);
      await newUser.save();
      // Trả về phản hồi thành công với thông tin người dùng mới
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
      console.log("Đăng ký thành công");
    } else {
      res.status(400).json({ error: "Dữ liệu người dùng không hợp lệ" });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình đăng ký, ghi log lỗi và trả về lỗi server
    console.log("Lỗi trong quá trình đăng ký", error.message);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Hàm login để xử lý việc đăng nhập người dùng
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Người dùng không tồn tại" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Mật khẩu không chính xác" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Lỗi trong quá trình đăng nhập", error.message);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};

// Hàm logout để xử lý việc đăng xuất người dùng
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.log("Lỗi trong quá trình đăng xuất", error.message);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
