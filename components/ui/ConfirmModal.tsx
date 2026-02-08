"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: { message: "" },
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve?.(true);
    setState({ open: false, options: { message: "" }, resolve: null });
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState({ open: false, options: { message: "" }, resolve: null });
  };

  const { open, options } = state;
  const isDanger = options.variant === "danger";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

          {/* Modal */}
          <div
            className="relative bg-ramadan-navy border border-ramadan-gold/20 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center pt-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isDanger ? "bg-error/15" : "bg-yellow-500/15"
              }`}>
                {isDanger ? (
                  <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-4 pb-2 text-center">
              {options.title && (
                <h3 className="text-lg font-bold text-white mb-2">{options.title}</h3>
              )}
              <p className="text-white/70 text-sm leading-relaxed">{options.message}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-5">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
              >
                {options.cancelText || "إلغاء"}
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isDanger
                    ? "bg-error text-white hover:bg-red-500"
                    : "bg-ramadan-gold text-ramadan-dark hover:bg-ramadan-gold-light"
                }`}
              >
                {options.confirmText || "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
