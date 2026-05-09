import React from "react";
import { motion } from "motion/react";

interface Icon3DProps {
  icon: React.ReactNode;
  color: string;
}

export default function Icon3D({ icon, color }: Icon3DProps) {
  return (
    <motion.div
      whileHover={{
        rotateX: 10,
        rotateY: -10,
        scale: 1.1,
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        w-14 h-14 flex items-center justify-center
        rounded-2xl text-xl text-white font-bold
        bg-gradient-to-br ${color}
        shadow-xl relative
      `}
    >
      {/* Glow */}
      <div className={`absolute inset-0 blur-xl opacity-30 rounded-2xl bg-gradient-to-br ${color}`} />

      {/* Icon */}
      <span className="relative z-10 drop-shadow-md">
        {icon}
      </span>
    </motion.div>
  );
}
