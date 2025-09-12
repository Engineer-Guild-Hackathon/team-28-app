"use client";

import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  duration?: number;
  onClose?: () => void;
};

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg max-w-md text-white ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      } animate-fade-in-down`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// キーフレームアニメーション用のCSSを追加するには、
// tailwind.config.jsに以下の設定を追加してください
//
// extend: {
//   keyframes: {
//     'fade-in-down': {
//       '0%': { opacity: '0', transform: 'translateY(-10px) translateX(-50%)' },
//       '100%': { opacity: '1', transform: 'translateY(0) translateX(-50%)' }
//     }
//   },
//   animation: {
//     'fade-in-down': 'fade-in-down 0.5s ease-out'
//   }
// }
