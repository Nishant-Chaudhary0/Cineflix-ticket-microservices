import logger from "../utils/logger.js";
import  { userSchemaValidation,loginValidation } from "../utils/validation.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  logger.info("Signup endpoint hit...");

  const parsed = userSchemaValidation.safeParse(req.body);
  if (!parsed.success) {
    logger.error("validation error while signup");
    return res.status(400).json({
      success: false,
      message: "Please provide valid credentials!",
      error: parsed.error,
    });
  }

  try {
    const { username, email, password } = req.body;
    const doesUserExist = await User.findOne({ email });
    if (doesUserExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists, please login...",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json(newlyCreatedUser);
  } catch (error) {
    logger.error("error in signup controller", error);
    return res.status(500).json({
      success: false,
      message: "error while signing up...",
    });
  }
};

export const login = async (req, res) => {
  logger.info("Login endpoint hit...");
  const parsed = loginValidation.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Please enter valid credentials...",
      error: parsed.error,
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist, please signup...",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Please enter valid password...",
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Login Successful!",
      accessToken,
      user: userObj,
    });
  } catch (error) {
    logger.error("error in login route...", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refresh = (req, res) => {
  logger.info("refresh token endpoint hit...");

  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    const accessToken = jwt.sign({ id: payload.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ accessToken });
  });
};

export const logout = (req, res) => {
  logger.info("Logout endpoint hit...");

  try {
    res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout Successful!",
  });
  } catch (error) {
    logger.info("Logout failed!",error)
  }
};