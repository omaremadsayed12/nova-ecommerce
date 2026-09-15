import { createContext, useState } from "react";
import ErrorToast from "../components/common/Toasts/ErrorToast";
import SuccessToast from "../components/common/Toasts/SuccessToast";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showError = (message) => {
    setError(message);

    setTimeout(() => {
      setError("");
    }, 7000);
  };

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 7000);
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}

      <ErrorToast
        message={error}
        onClose={() => setError("")}
      />

      <SuccessToast
        message={success}
        onClose={() => setSuccess("")}
      />
    </ToastContext.Provider>
  );
}
