import jwt from "jsonwebtoken";

// doctor auth middleware
const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const dToken = authHeader;
    const dToken_decoded = jwt.verify(dToken, process.env.JWT_SECRET);
    
    // Use req.user instead of req.body for GET requests
    req.user = { userId: dToken_decoded.id };
    
    next();   
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;