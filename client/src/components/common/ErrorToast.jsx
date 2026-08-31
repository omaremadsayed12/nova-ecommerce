import { CircleAlert, X } from "lucide-react";

function ErrorToast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-xl border border-red-500/70 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-600 shadow-lg backdrop-blur-xl">
      
      <CircleAlert className="h-5 w-5 shrink-0 text-red-500" />

      <span className="flex-1">{message}</span>

      <button
        onClick={onClose}
        className="rounded-md p-1 text-red-500 transition hover:bg-red-500/10"
        aria-label="Close error"
      >
        <X className="h-4 w-4" />
      </button>

    </div>
  );
}

export default ErrorToast;