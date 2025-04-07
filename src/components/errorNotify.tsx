"use client";
import { useEffect, useState } from "react";

type Props = {
  message: string;
  onClose: () => void;
};

export default function ErrorNotify({ message, onClose }: Props) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(100 - (currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        onClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center z-50">
      <div className="bg-red-500 text-white px-6 py-3 rounded-b-xl shadow-lg w-72 max-w-xl text-center">
        <span>{message}</span>
        <div className="h-1 bg-white mt-2 rounded overflow-hidden">
          <div
            className="h-full bg-red-700 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
