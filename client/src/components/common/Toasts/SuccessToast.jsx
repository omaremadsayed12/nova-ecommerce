import { CircleCheck, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import DropdownTransition from "../Transitions/DropdownTransition";
import { useTranslation } from "react-i18next";


function SuccessToast({ message, onClose, btn }) {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <DropdownTransition>
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
        aria-label={t("common.closeSuccess")}
      >
        <X />
      </button>
    </div>
    </DropdownTransition>
  );
}

export default SuccessToast;
