import { UploadCloud, Loader2 } from "lucide-react";

interface DepositFormProps {
  amount: string;
  setAmount: (val: string) => void;
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export function DepositForm({
  amount,
  setAmount,
  previewUrl,
  handleFileChange,
  handleSubmit,
  loading,
  error,
}: DepositFormProps) {
  return (
    <form onSubmit={handleSubmit} className="text-left space-y-4 mb-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-xs text-left">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Amount Sent (Rs)
        </label>
        <input
          type="number"
          min="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 500"
          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Upload Screenshot
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-800/50 hover:border-red-500/50 transition-all overflow-hidden relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500">
              <UploadCloud className="w-6 h-6 mb-2" />
              <p className="text-xs font-bold">Tap to upload receipt</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit Deposit Proof"
        )}
      </button>
    </form>
  );
}
