import {
  getAllusers,
  getUserById,
  getProfile,
  userRegister,
  userLogin,
  updateUser,
  deleteUser,
  deposit,
} from "../Controller/userController.js";
import express from "express";
import { authMiddlware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Admin: get all users
router.get("/", authMiddlware(["admin"]), getAllusers);

// Auth: register & login
router.post("/register", userRegister);
router.post("/login", userLogin);

// Current user profile
router.get("/me", authMiddlware(["user", "admin"]), getProfile);
router.get("/profile", authMiddlware(["user", "admin"]), getProfile);

// Deposit funds
router.post("/deposit/:id", authMiddlware(["user", "admin"]), deposit);
router.post("/deposit", authMiddlware(["user", "admin"]), deposit);
router.post("/:id/deposit", authMiddlware(["user", "admin"]), deposit);

// Update user password / profile
router.put("/", authMiddlware(["user", "admin"]), updateUser);
router.put("/:id", authMiddlware(["user", "admin"]), updateUser);

// Delete user (admin or self)
router.delete("/", authMiddlware(["user", "admin"]), deleteUser);
router.delete("/:id", authMiddlware(["user", "admin"]), deleteUser);

// Get user by ID
router.get("/:id", authMiddlware(["user", "admin"]), getUserById);

export default router;
