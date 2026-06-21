// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.json({ success: false, message: "Missing Details" });
//     }

//     const exists = await User.findOne({ email });

//     if (exists) {
//       return res.json({ success: false, message: "User already exists" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//     });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       token,
//     });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       token,
//     });
//   } catch (err) {
//     res.json({ success: false, message: err.message });
//   }
// };

// export const isAuth = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");

//     if (!user) {
//       return res.json({ success: false });
//     }

//     res.json({ success: true, user });
//   } catch (err) {
//     res.json({ success: false });
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   });

//   res.json({ success: true, message: "Logged out" });
// };
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true, // Vercel/Production ke liye true
  sameSite: "none", // Cross-origin ke liye "none"
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOptions);
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.json({ success: false });
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ success: true, message: "Logged out" });
};
