const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

exports.signup = async (req, res) => {
  try {
    const { Name, LastName, email, password,confirmPassword } = req.body;

    console.log(Name, LastName, email, password,confirmPassword)

    // Check if the user already exists

    if (
        !Name ||
        !LastName ||
        !email ||
        !password ||
        !confirmPassword 
        
    ) {
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
        });
    }


    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message:
                "Password and Confirm Password do not match. Please try again.",
        });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      Name,
      LastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ 
        success: true,
        newUser,
	    message: "User registered successfully",
     });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};




exports.login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all the required fields",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up to continue.",
      });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Save the token in the Session collection
    const session = new Session({
      userId: user._id,
      token,
    });
    await session.save();

    // Remove password from user object for response
    user.password = undefined;

    // Set cookie for token and return success response
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "User login successful",
      });
  } catch (error) {
    console.error("Login Error:", error);

    // Return 500 Internal Server Error for unexpected errors
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};


