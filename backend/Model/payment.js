import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    qrcode: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

PaymentSchema.pre("validate", function () {
  if (!this.qrcode && this.image_url) {
    this.qrcode = this.image_url;
  }
  if (!this.image_url && this.qrcode) {
    this.image_url = this.qrcode;
  }
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
