import { CircleCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import DropdownTransation from "../Transations/DropdownTransation";


function SuccessToast({ message, onClose, btn }) {
  if (!message) return null;

  return (
    <DropdownTransation>
    <div className="success toast">

      <CircleCheck />

      <span className="flex-1">{message}</span>
      {btn &&
        <NavLink to={btn.url} onClick={onClose} >
          {btn.text}
        </NavLink>
      }
      <button
        onClick={onClose}
        aria-label="Close success message"
      >
        <X />
      </button>
    </div>
    </DropdownTransation>
  );
}

export default SuccessToast;