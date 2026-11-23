interface ReceiptPreviewProps {
  imageUrl?: string;
}

export function ReceiptPreview({ imageUrl }: ReceiptPreviewProps) {
  if (!imageUrl) return null;

  return (
    <div className="space-y-2">
      <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider">
        Verification Proof
      </span>
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/40 p-2 flex justify-center">
        <img
          src={imageUrl}
          alt="Payment Receipt"
          className="max-h-40 object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
