/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useRef } from "react";

export const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++toastId;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      timers.current[id] = setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  success: {
    border: "border-l-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "✓",
  },
  error: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    icon: "✕",
  },
  info: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "ℹ",
  },
};

const ToastItem = ({ toast, onClose }) => {
  const s = styles[toast.type] || styles.info;

  return (
    <div
      className={`toast-in flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${s.border} ${s.bg} pointer-events-auto`}
      role="alert"
    >
      <span className={`${s.text} font-bold text-lg leading-none mt-0.5`}>
        {s.icon}
      </span>
      <p className="flex-1 text-sm text-gray-700 break-words">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};
