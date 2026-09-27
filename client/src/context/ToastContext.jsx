import { createContext, useContext, useState } from "react";
import ErrorToast from "../components/common/Toasts/ErrorToast";
import SuccessToast from "../components/common/Toasts/SuccessToast";
import { AnimatePresence } from "framer-motion";

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const MAX_TOASTS = 4;

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const addToast = (type, message, button = null) => {
    const id = crypto.randomUUID();

    setToasts((current) => [
      ...current.slice(-(MAX_TOASTS - 1)),
      {
        id,
        type,
        message,
        button,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 7000);
  };

  const showError = (message) => {
    addToast("error", message);
  };

  const showSuccess = (message, button = null) => {
    addToast("success", message, button);
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}

      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) =>
            toast.type === "error" ? (
              <ErrorToast
                key={toast.id}
                message={toast.message}
                onClose={() => removeToast(toast.id)}
              />
            ) : (
              <SuccessToast
                key={toast.id}
                message={toast.message}
                onClose={() => removeToast(toast.id)}
                btn={toast.button}
              />
            ),
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
