import { useState } from "react";
import ToastContext from "./toast-context";
import ErrorToast from "../components/common/ErrorToast";
import SuccessToast from "../components/common/SuccessToast";

function ToastProvider({ children }) {
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

export default ToastProvider;