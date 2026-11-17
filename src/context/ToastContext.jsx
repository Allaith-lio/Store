import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext } from "./ToastContextValue";

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const timer = useRef();

  const showToast = useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      >
        {message && (
          <div className="rounded-control bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-raised">
            {message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}