import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.cookies.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode && tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
