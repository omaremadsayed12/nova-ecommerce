import { createContext, useState } from "react";
import ErrorToast from "../components/common/Toasts/ErrorToast";
import SuccessToast from "../components/common/Toasts/SuccessToast";
import { AnimatePresence } from "framer-motion";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [button, setButton] = useState({});

  const showError = (message) => {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 7000);
  };

  const showSuccess = (message, button) => {
    setSuccess(message);
    setButton(button);
    setTimeout(() => {
      setSuccess("");
    }, 7000);
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      <AnimatePresence mode="wait">
        <ErrorToast key="error" message={error} onClose={() => setError("")} />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <SuccessToast
          key="success"
          message={success}
          onClose={() => setSuccess("")}
          btn={button}
        />
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
