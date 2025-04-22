"use client";

import { useEffect, useState } from "react";
import EditableTime from "@/components/editableTime";

interface TimerProps {
  initialSeconds?: number;
  onChange?: (s: number) => void;
}

export default function TimerEditable({ initialSeconds = 0, onChange }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (onChange) onChange(seconds);
  }, [seconds, onChange]);

  const handleChange = (unit: "hours" | "minutes" | "seconds", value: number) => {
    const safe = Math.max(0, value);
    const total =
      (unit === "hours" ? safe : h) * 3600 +
      (unit === "minutes" ? safe : m) * 60 +
      (unit === "seconds" ? safe : s);

    setRunning(false);
    setSeconds(total);
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div className="flex items-center gap-1 text-xl font-mono text-primary">
        <span className="text-sm text-gray-600 font-medium">Tempo:</span>
        <EditableTime value={h} onChange={(v) => handleChange("hours", v)} />
        <span>:</span>
        <EditableTime value={m} onChange={(v) => handleChange("minutes", v)} />
        <span>:</span>
        <EditableTime value={s} onChange={(v) => handleChange("seconds", v)} />
      </div>

      <div className="flex gap-3 text-sm">
        {running ? (
          <button
            onClick={() => setRunning(false)}
            className="px-3 py-1 rounded bg-yellow-500 text-white"
          >
            ⏸ Pausar
          </button>
        ) : (
          <button
            onClick={() => setRunning(true)}
            className="px-3 py-1 rounded bg-green-600 text-white"
          >
            🔁 Continuar
          </button>
        )}
      </div>
    </div>
  );
}
