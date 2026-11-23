import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true, unique: true },

    username: { type: String, required: true },
    amount: { type: mongoose.Types.Decimal128, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },

    game: { type: String },
    // roundId: { type: String },
    // provider: { type: String },

    // rawPayload: { type: Object },
    receivedAt: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
