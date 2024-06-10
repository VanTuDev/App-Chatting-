import jwt from "jsonwebtoken";

const protectRouter = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;
    if (!token) {
      return res.status(401).json({ error: "Invalid No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "Unauthorized -Invalid Token" });
    }

    const user = await User.findById(decode, userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRouter controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRouter;
