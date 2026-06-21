// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     const token = req.headers.token || req.cookies.token;

//     if (!token) {
//       return res.json({ success: false, message: "Not Authorized" });
//     }

//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//     if (tokenDecode && tokenDecode.id) {
//       req.userId = tokenDecode.id;
//       next();
//     } else {
//       return res.json({ success: false, message: "Not Authorized" });
//     }
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // Cookies se token nikalna (Ensure karein aapne server.js mein cookie-parser use kiya hai)
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Login Required",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    // Token valid hai, user ka ID request object mein set karein
    req.userId = tokenDecode.id;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Token Expired or Invalid" });
  }
};

export default authUser;
