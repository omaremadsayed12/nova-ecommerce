import { CircleAlert, X } from "lucide-react";
import DropdownTransation from "../Transations/DropdownTransation";

function ErrorToast({ message, onClose }) {
  if (!message) return null;

  return (
    <DropdownTransation>
      <div className="error toast">
        <CircleAlert />

        <span className="flex-1">{message}</span>

        <button onClick={onClose} aria-label="Close error">
          <X />
        </button>
      </div>
    </DropdownTransation>
  );
}

export default ErrorToast;
