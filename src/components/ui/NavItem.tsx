import React from "react";
import { motion } from "motion/react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center cursor-pointer group"
    >
      {/* ICON BOX */}
      <motion.div
        animate={{
          scale: active ? 1.15 : 1,
          y: active ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`
          w-10 h-10 flex items-center justify-center
          rounded-xl text-lg font-bold
          shadow-lg transition-colors
          ${
            active
              ? "bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-brand-500/30"
              : "bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/5"
          }
        `}
      >
        <span className="drop-shadow-md">
          {icon}
        </span>
      </motion.div>

      {/* LABEL */}
      <span
        className={`text-[9px] mt-1 font-black uppercase tracking-widest transition-opacity ${
          active
            ? "text-brand-500 dark:text-brand-400 opacity-100"
            : "text-slate-500 opacity-40 group-hover:opacity-70"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
