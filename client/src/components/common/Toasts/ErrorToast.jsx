import { CircleAlert, X } from "lucide-react";
import DropdownTransition from "../Transitions/DropdownTransition";
import { useTranslation } from "react-i18next";

function ErrorToast({ message, onClose }) {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <DropdownTransition>
      <div className="error toast">
        <CircleAlert />

        <span className="flex-1">{message}</span>

        <button onClick={onClose} aria-label={t("common.closeError")}>
          <X />
        </button>
      </div>
    </DropdownTransition>
  );
}

export default ErrorToast;
