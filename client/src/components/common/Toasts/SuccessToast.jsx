import { CircleCheck, X } from "lucide-react";

function SuccessToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-xl border border-green-500/70 bg-green-500/10 px-5 py-4 text-sm font-semibold text-green-700 shadow-lg backdrop-blur-xl">
      
      <CircleCheck className="h-5 w-5 shrink-0 text-green-500" />

      <span className="flex-1">{message}</span>

      <button
        onClick={onClose}
        className="rounded-md p-1 text-green-600 transition hover:bg-green-500/10"
        aria-label="Close success message"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default SuccessToast;