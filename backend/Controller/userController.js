import User from "../Model/user.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import API from "../utils/API.js";
export const getAllusers = asyncHandler(async (req, res) => {
  const allUsers = await User.find().select("-password");
  res.status(200).json(allUsers);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(user);
});

export const deposit = asyncHandler(async (req, res) => {
  const targetId =
    req.params?.id ||
    req.body?._id ||
    req.body?.id ||
    req.body?.userId ||
    req.user?.id ||
    req.user?._id;
  const rawAmt = req.body?.depositAmt ?? req.body?.amount;
  const depositAmt = parseInt(rawAmt);

  if (!targetId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (isNaN(depositAmt) || depositAmt === 0) {
    return res
      .status(400)
      .json({ message: "Valid deposit amount is required" });
  }

  const user = await User.findOneAndUpdate(
    {
      _id: targetId,
      balance: { $gte: -depositAmt },
    },
    {
      $inc: {
        balance: depositAmt,
      },
    },
    { new: true },
  );

  if (!user) {
    const existing = await User.findById(targetId);
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(400).json({
      message:
        "Cannot make the transaction as the deducted amount is greater than user's balance",
    });
  }

  return res.status(200).json({
    message: "Deposited Successfully",
    data: { newBalance: user.balance },
  });
});

export const userRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // 1. Create user on the external game server
    await API.post(
      "/users/create",
      { user_token: username },
      {
        headers: {
          "X-API-Key": process.env.API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    // 2. Hash password and save to local MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(
      "External API registration failed:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: "External game server failed.",
      error: error.response?.data || error.message,
    });
  }
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User doesn't exist",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({
      message: "Invalid Credential",
    });
  }
  return res.status(200).json({
    message: "Login Succesfull",
    accessToken: jwt.sign(
      { id: user?._id, role: user?.role || "user", user_token: user?.username },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    ),
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { password, email, username } = req.body;
  const targetId =
    req.params?.id && req.user?.role === "admin"
      ? req.params.id
      : req.user?.id || req.user?._id;

  const updates = {};
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }
  if (email && req.user?.role === "admin") {
    updates.email = email;
  }
  if (username && req.user?.role === "admin") {
    updates.username = username;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update fields provided" });
  }

  const user = await User.findByIdAndUpdate(targetId, updates, {
    new: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const targetId =
    req.params?.id ||
    req.body?._id ||
    req.body?.id ||
    req.user?.id ||
    req.user?._id;

  if (!targetId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const requesterId = (req.user?.id || req.user?._id)?.toString();
  const isAdmin = req.user?.role === "admin";
  const isSelf = requesterId && requesterId === targetId.toString();

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      message: "Unauthorized: You can only delete your own account",
    });
  }

  const user = await User.findByIdAndDelete(targetId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User deleted successfully" });
});
