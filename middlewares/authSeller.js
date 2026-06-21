import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const token = req.headers.token || req.cookies.sellerToken;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authSeller;
