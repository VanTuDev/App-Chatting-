import Admin from "../models/admin.model.js";

export const createAdmin = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const newAdmin = new Admin({
      fullname,
      username,
      password,
    });
    await newAdmin.save();
    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
    });
  } catch (error) {
    console.log("Error createAdmin Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
