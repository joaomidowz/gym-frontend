"use client";

import { useEffect, useState } from "react";

type EditableTimeProps = {
  value: number;
  onChange: (val: number) => void;
};

export default function EditableTime({ value, onChange }: EditableTimeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString().padStart(2, "0"));

  useEffect(() => {
    setInputValue(value.toString().padStart(2, "0"));
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue);
    if (!isNaN(parsed)) onChange(parsed);
  };

  return isEditing ? (
    <input
      type="number"
      className="w-8 text-center outline-none bg-transparent border-none"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      autoFocus
    />
  ) : (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-pointer select-none hover:underline"
    >
      {value.toString().padStart(2, "0")}
    </span>
  );
}
