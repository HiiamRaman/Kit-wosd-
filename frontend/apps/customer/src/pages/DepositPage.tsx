import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { apiClient } from "../services/api.client";
import { useAuthStore } from "../store/auth.store";

// Correctly importing from your global components folder
import { DepositQR } from "../components/deposit/DepositQR";
import { DepositForm } from "../components/deposit/DepositForm";
import { DepositNotice } from "../components/deposit/DepositNotice";

export function DepositPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !file) {
      setError("Please enter an amount and upload a payment screenshot.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("screenshot", file);

     // Grab the ID whether your store saves it as _id or id
      const currentUserId = user?._id || user?.id;

      if (currentUserId) {
        formData.append("userId", currentUserId);
        formData.append("_id", currentUserId); // Sending this too since your backend specifically asked for "_id"
      } else {
        setError("User authentication error. Please log out and log back in.");
        setLoading(false);
        return;
      }

      await apiClient.post("/payments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      console.error("Deposit submission failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit deposit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Success State View
  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
          Deposit Submitted
        </h2>
        <p className="text-zinc-400 text-center text-sm">
          Your payment proof has been sent to the admins. Your balance will
          update once approved.
        </p>
      </div>
    );
  }

  // Default Form View
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <DepositQR />

        <DepositForm
          amount={amount}
          setAmount={setAmount}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <DepositNotice />
      </div>
    </div>
  );
}
