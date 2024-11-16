const jwt = require("jsonwebtoken");
require("dotenv").config();

// Auth Middleware
exports.auth = async (req, res, next) => {
  try {
    // Extract token from various sources
    const token =
      req.body.token ||
      req.cookies.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

    // console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing. Authorization denied.",
      });
    }

    // Verify the token
    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decode; // Attach user info to the request object
      next(); // Proceed to the next middleware or route
    } catch (err) {
      // Invalid token
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while validating the token.",
    });
  }
};
