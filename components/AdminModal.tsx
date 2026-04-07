"use client";
import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ModalType = "confirm" | "alert" | "prompt" | "success" | "error";

interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

interface AdminModalProps {
  config: ModalConfig | null;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
}

const iconMap: Record<ModalType, { icon: React.ReactNode; gradient: string; shadow: string }> = {
  confirm: {
    icon: <AlertTriangle size={28} strokeWidth={2} className="text-amber-500" />,
    gradient: "linear-gradient(135deg, #FFF8E1, #FFF3CD)",
    shadow: "0 8px 32px rgba(255, 193, 7, 0.25)",
  },
  alert: {
    icon: <Info size={28} strokeWidth={2} className="text-blue-500" />,
    gradient: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
    shadow: "0 8px 32px rgba(33, 150, 243, 0.25)",
  },
  prompt: {
    icon: <AlertTriangle size={28} strokeWidth={2} className="text-orange-500" />,
    gradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
    shadow: "0 8px 32px rgba(255, 152, 0, 0.25)",
  },
  success: {
    icon: <CheckCircle size={28} strokeWidth={2} className="text-green-500" />,
    gradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
    shadow: "0 8px 32px rgba(76, 175, 80, 0.25)",
  },
  error: {
    icon: <XCircle size={28} strokeWidth={2} className="text-red-500" />,
    gradient: "linear-gradient(135deg, #FFEBEE, #FFCDD2)",
    shadow: "0 8px 32px rgba(244, 67, 54, 0.25)",
  },
};

const buttonStyles: Record<ModalType, { confirm: string; cancel: string }> = {
  confirm: {
    confirm:
      "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-200",
    cancel: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
  alert: {
    confirm:
      "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-200",
    cancel: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
  prompt: {
    confirm:
      "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-200",
    cancel: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
  success: {
    confirm:
      "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg shadow-green-200",
    cancel: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
  error: {
    confirm:
      "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-200",
    cancel: "bg-gray-100 hover:bg-gray-200 text-gray-600",
  },
};

export default function AdminModal({ config, onConfirm, onCancel }: AdminModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config) {
      setInputValue("");
      setIsClosing(false);
      // Small delay for mount animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      // Focus input if prompt
      if (config.type === "prompt") {
        setTimeout(() => inputRef.current?.focus(), 200);
      }
    } else {
      setIsVisible(false);
    }
  }, [config]);

  if (!config) return null;

  const { type, title, message, confirmText, cancelText, placeholder } = config;
  const visual = iconMap[type];
  const buttons = buttonStyles[type];
  const showCancel = type === "confirm" || type === "prompt";

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
      setIsClosing(false);
    }, 250);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onConfirm(type === "prompt" ? inputValue : undefined);
      setIsClosing(false);
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        opacity: isVisible && !isClosing ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: isVisible || isClosing ? "auto" : "none",
      }}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden glass-card shadow-2xl"
        style={{
          transform: isVisible && !isClosing ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all z-10"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: visual.gradient,
              boxShadow: visual.shadow,
            }}
          >
            {config.icon || visual.icon}
          </div>

          {/* Title */}
          <h3
            className="text-xl font-black text-gray-800 mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5 max-w-xs">
            {message}
          </p>

          {/* Input for prompt type */}
          {type === "prompt" && (
              <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Ketik di sini..."}
              className="w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all mb-5 text-gray-800 glass-input focus:ring-2 focus:ring-orange-400 outline-none"
            />
          )}
        </div>

        {/* Actions */}
        <div
          className="px-6 pb-6 flex gap-3"
          style={{ flexDirection: showCancel ? "row" : "column" }}
        >
          {showCancel && (
            <button
              onClick={handleClose}
              className={`flex-1 font-bold py-3 rounded-2xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${buttons.cancel}`}
            >
              {cancelText || "Batal"}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 font-bold py-3 rounded-2xl text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${buttons.confirm}`}
          >
            {confirmText || "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easy usage
export function useAdminModal() {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const resolveRef = useRef<((value: string | boolean | null) => void) | null>(null);

  const showModal = (config: ModalConfig): Promise<string | boolean | null> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalConfig(config);
    });
  };

  const handleConfirm = (inputValue?: string) => {
    setModalConfig(null);
    if (resolveRef.current) {
      if (modalConfig?.type === "prompt") {
        resolveRef.current(inputValue ?? "");
      } else {
        resolveRef.current(true);
      }
      resolveRef.current = null;
    }
  };

  const handleCancel = () => {
    setModalConfig(null);
    if (resolveRef.current) {
      resolveRef.current(null);
      resolveRef.current = null;
    }
  };

  const confirm = (title: string, message: string, confirmText?: string) =>
    showModal({ type: "confirm", title, message, confirmText, cancelText: "Batal" });

  const alert = (title: string, message: string, type: "success" | "error" | "alert" = "alert") =>
    showModal({ type, title, message, confirmText: "OK" });

  const prompt = (title: string, message: string, placeholder?: string) =>
    showModal({ type: "prompt", title, message, placeholder, confirmText: "Kirim", cancelText: "Batal" });

  return {
    modalConfig,
    handleConfirm,
    handleCancel,
    confirm,
    alert,
    prompt,
  };
}
