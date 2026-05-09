import React from "react";

interface InputProps {
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function Input({ value, setValue, placeholder, type = "text", className = "", autoFocus }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`input ${className}`}
    />
  );
}
