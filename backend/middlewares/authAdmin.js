import jwt from "jsonwebtoken";

// admin auth middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    // Your original logic assumes atoken is inside headers — so we treat authorization as the token directly
    const atoken = authHeader;

    const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;


