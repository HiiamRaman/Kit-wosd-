export function DepositQR() {
  return (
    <div className="text-center">
      <h1 className="text-xl font-black uppercase text-white tracking-wider mb-1">
        Scan & Deposit
      </h1>
      <p className="text-xs text-zinc-400 mb-6">
        Scan the QR code below using Khalti, eSewa, or Mobile Banking to
        transfer funds.
      </p>

      <div className="bg-white p-3 rounded-2xl inline-block mx-auto mb-6 shadow-inner border-4 border-zinc-800">
        <img
          src="/payment/images.png"
          alt="Admin Deposit QR Code"
          className="w-48 h-48 object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
