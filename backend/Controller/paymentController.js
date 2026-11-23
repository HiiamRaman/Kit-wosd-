import Payment from "../Model/payment.js";
import User from "../Model/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import stripe from "../utils/stripe.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// API to submit payment QR code & user _id
export const createPayment = asyncHandler(async (req, res) => {
  const userId =
    req.body?._id ||
    req.body?.userId ||
    req.body?.user_id ||
    req.body?.user ||
    req.body?.id ||
    req.user?.id ||
    req.user?._id;

  if (!userId) {
    return res.status(400).json({
      message: "User _id is required",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  let qrCodeUrl = null;

  if (req.file && req.file.buffer) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "payment_qrcodes",
    );
    qrCodeUrl = uploadResult?.secure_url || uploadResult?.url;
  } else {
    const rawQr =
      req.body?.qrcode ||
      req.body?.qr_code ||
      req.body?.image_url ||
      req.body?.image ||
      req.body?.link;

    if (!rawQr) {
      return res.status(400).json({
        message:
          "Payment QR code is required (as a file upload or QR code URL link)",
      });
    }

    if (typeof rawQr === "string" && rawQr.startsWith("data:image/")) {
      const uploadResult = await uploadToCloudinary(rawQr, "payment_qrcodes");
      qrCodeUrl = uploadResult?.secure_url || uploadResult?.url;
    } else {
      qrCodeUrl = rawQr;
    }
  }

  const amount = req.body?.amount ? Number(req.body.amount) : 0;

  const payment = await Payment.create({
    qrcode: qrCodeUrl,
    image_url: qrCodeUrl,
    user: user._id,
    amount: isNaN(amount) ? 0 : amount,
    status: "pending",
  });

  await payment.populate("user", "-password");

  return res.status(201).json({
    message: "Payment QR code submitted successfully and is pending approval",
    payment,
  });
});

// Alias for createPayment
export const submitPayment = createPayment;

// API to fetch all pending payment users
export const getPendingPayments = asyncHandler(async (req, res) => {
  const pendingPayments = await Payment.find({ status: "pending" })
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  const pendingUsers = pendingPayments
    .filter((p) => p.user)
    .map((p) => p.user);

  return res.status(200).json({
    success: true,
    count: pendingPayments.length,
    payments: pendingPayments,
    users: pendingUsers,
  });
});

// Alias for getPendingPayments
export const getPendingPaymentUsers = getPendingPayments;

// API to fetch all payments with optional filtering
export const getAllPayments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query?.status) {
    filter.status = req.query.status;
  }
  if (req.query?.user || req.query?.userId) {
    filter.user = req.query.user || req.query.userId;
  }

  const payments = await Payment.find(filter)
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

// API to fetch payment by ID
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate(
    "user",
    "-password",
  );
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  return res.status(200).json(payment);
});

// API to fetch payments for a specific user
export const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.params?.userId || req.params?.id;
  const payments = await Payment.find({ user: userId })
    .populate("user", "-password")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

// API to update payment status (e.g. approve / reject)
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, amount } = req.body;
  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status must be either 'pending', 'approved', or 'rejected'",
    });
  }

  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  const prevStatus = payment.status;
  payment.status = status;
  if (amount !== undefined && !isNaN(Number(amount))) {
    payment.amount = Number(amount);
  }

  // Credit user balance when payment is approved
  if (
    status === "approved" &&
    prevStatus !== "approved" &&
    payment.amount > 0
  ) {
    await User.findByIdAndUpdate(payment.user, {
      $inc: { balance: payment.amount },
    });
  }

  await payment.save();
  await payment.populate("user", "-password");

  return res.status(200).json({
    message: `Payment marked as ${status}`,
    payment,
  });
});

// Legacy stripe pay link generator (preserved)
export const generatePayLink = asyncHandler(async (req, res) => {
  const { successUrl, cancelUrl, price } = req.body;
  const amount = parseInt(price);
  if (amount < 500 || amount > 10000)
    return res
      .status(401)
      .json({ message: "Please choose prices between 500 & 10,000" });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "npr",
          product_data: { name: "Purchase top-up" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl || "http://localhost:5000/api/hello",
    cancel_url: cancelUrl || "http://localhost:5000/",
  });
  const payment = await Payment.create({
    sessioin_id: session.id,
    user: req.user.id || req.user._id,
  });
  return res.status(200).json({
    message: "Payment url ready",
    url: session.url,
  });
});
