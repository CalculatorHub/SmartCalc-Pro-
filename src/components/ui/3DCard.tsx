import React from "react";
import { motion } from "motion/react";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card3D({ children, className = "" }: Card3DProps) {
  return (
    <motion.div
      whileHover={{
        rotateX: 5,
        rotateY: -5,
        y: -8,
      }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`
        rounded-3xl p-5
        bg-white/80 dark:bg-[#0f172a]/80
        backdrop-blur-xl
        border border-slate-200 dark:border-white/10
        shadow-xl
        hover:shadow-2xl hover:shadow-blue-500/10
        transition
        ${className}
      `}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
}
