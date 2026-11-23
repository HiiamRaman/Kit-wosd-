import express from "express";
import {
  createPayment,
  getPendingPayments,
  getAllPayments,
  getPaymentById,
  getUserPayments,
  updatePaymentStatus,
} from "../Controller/paymentController.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Middleware that handles multipart file upload (any field name like qrcode, image, etc.) or json bodies
const handleUpload = (req, res, next) => {
  const uploadMiddleware = upload.any();
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

// API where user sends their payment QR code & their _id
router.post("/", handleUpload, createPayment);
router.post("/submit", handleUpload, createPayment);
router.post("/upload", handleUpload, createPayment);

// API to fetch all pending payment users
router.get("/pending", getPendingPayments);
router.get("/pending-users", getPendingPayments);

// Fetch all payments (supports ?status=pending or ?userId=...)
router.get("/", getAllPayments);

// Fetch payments by specific user
router.get("/user/:userId", getUserPayments);

// Fetch specific payment by ID
router.get("/:id", getPaymentById);

// Update payment status (approve / reject)
router.patch("/:id/status", updatePaymentStatus);
router.put("/:id/status", updatePaymentStatus);
router.post("/:id/approve", (req, res, next) => {
  req.body.status = "approved";
  updatePaymentStatus(req, res, next);
});
router.post("/:id/reject", (req, res, next) => {
  req.body.status = "rejected";
  updatePaymentStatus(req, res, next);
});

export default router;
