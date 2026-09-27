import { CircleAlert, X } from "lucide-react";
import DropdownTransition from "../Transitions/DropdownTransition";

function ErrorToast({ message, onClose }) {
  if (!message) return null;

  return (
    <DropdownTransition>
      <div className="error toast">
        <CircleAlert />

        <span className="flex-1">{message}</span>

        <button onClick={onClose} aria-label="Close error">
          <X />
        </button>
      </div>
    </DropdownTransition>
  );
}

export default ErrorToast;
