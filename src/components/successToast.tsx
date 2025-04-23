"use client";

import { useEffect, useState } from "react";

type Props = {
  message: string;
};

export function SuccessToast({ message }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white-txt px-4 py-2 rounded-xl shadow-lg text-sm z-[9999] animate-fade-in"
      onClick={() => setVisible(false)}>
      {message}
    </div>
  );
}
