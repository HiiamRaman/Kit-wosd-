import express from "express";
import betRoutes from "./betRoutes.js";
import userRoutes from "./userRoutes.js";
import walletRoutes from "./walletRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import stripe from "../utils/stripe.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use("/bet", betRoutes);
router.use("/user", userRoutes);
router.use("/wallet", walletRoutes);
router.use("/payment", paymentRoutes);
router.use("/payments", paymentRoutes);
// router.post(
//   "/create-checkout-session",
//   asyncHandler(async (req, res) => {
//     const { successUrl, cancelUrl, price } = req.body;
//     const amount = parseInt(price);
//     if (amount < 500 || amount > 10000)
//       return res
//         .status(401)
//         .json({ message: "Please choose prices between 500 & 10,000" });
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "npr",
//             product_data: { name: "Purchase top-up" },
//             unit_amount: amount * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: successUrl || "http://localhost:5000/api/hello",
//       cancel_url: cancelUrl || "http://localhost:5000/",
//     });

//     return res.status(200).json({
//       message: "Payment url ready",
//       url: session.url,
//     });
//   }),
// );

export default router;
