const userModel = require("../models/user.model");
const userServices = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userServices.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });

    // Generate the token
    const token = user.generateAuthToken();

    // Respond with the created user and token
    res.status(201).json({ user, token });
  } catch (error) {
    // Log the error (optional)
    console.error("Error in registerUser:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find the user by email and include the password field
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate authentication token
    const token = user.generateAuthToken();

    // Set the token as a cookie
    res.cookie("token", token);

    // Respond with the user and token
    res.status(200).json({ user, token });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in loginUser:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    // Send the user profile as a response
    res.status(200).json(req.user);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in getUserProfile:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Add the token to the blacklist
    await blacklistTokenModel.create({ token });

    // Clear the cookie containing the token
    res.clearCookie("token");

    // Send a success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in logoutUser:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};
