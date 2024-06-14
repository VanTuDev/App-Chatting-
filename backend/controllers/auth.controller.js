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
      return res.status(400).json({ errors: "Passwords don't match" }); // Nếu không khớp, trả về lỗi
    }

    // Kiểm tra xem người dùng với username đã tồn tại trong cơ sở dữ liệu chưa
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" }); // Nếu tồn tại, trả về lỗi
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
      //General JWT token here
      // Lưu người dùng mới vào cơ sở dữ liệu
      await generateTokenAndSetCookie(newUser.id, res);
      await newUser.save();
      // Trả về phản hồi thành công với thông tin người dùng mới
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
      console.log("success signup");
    } else {
      res.status(201).json({ error: "Invalid user data" });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình đăng ký, ghi log lỗi và trả về lỗi server
    console.log("Error signup Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm login để xử lý việc đăng nhập người dùng

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error:
          "Invalid user or password" +
          console.log("Ban da sai o muc nao do trong password hoac user"),
      });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
      gender: user.gender,
    });
    console.log("success login");
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình đăng nhập, ghi log lỗi và trả về lỗi server
    console.log("Error in login Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Hàm logout để xử lý việc đăng xuất người dùng
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
