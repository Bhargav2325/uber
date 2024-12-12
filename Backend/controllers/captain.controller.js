const captainModel = require("../models/captain.model");
const captainServices = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    // Check if the captain already exists
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    // Hash the password
    const hashedPassword = await captainModel.hashPassword(password);

    // Create the captain
    const captain = await captainServices.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    // Generate authentication token
    const token = captain.generateAuthToken();

    // Respond with the created captain and token
    res.status(201).json({ captain, token });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in registerCaptain:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find the captain by email and include the password field
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate authentication token
    const token = captain.generateAuthToken();

    // Set the token as a cookie
    res.cookie("token", token);

    // Respond with the captain and token
    res.status(200).json({ captain, token });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in loginCaptain:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    // Respond with the captain's profile
    res.status(200).json({ captain: req.captain });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in getCaptainProfile:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Add the token to the blacklist
    await blacklistTokenModel.create({ token });

    // Clear the cookie containing the token
    res.clearCookie("token");

    // Respond with a success message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in logoutCaptain:", error);

    // Send an error response
    res.status(500).json({ message: "Internal server error" });
  }
};
