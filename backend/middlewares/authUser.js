import jwt from "jsonwebtoken";

// user auth middleware
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const token = authHeader;
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use req.user instead of req.body for GET requests
    req.user = { userId: token_decoded.id };
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;