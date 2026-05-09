import React from "react";
import { motion } from "motion/react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, onClick, className = "", disabled }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      disabled={disabled}
      className={`btn disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  );
}
