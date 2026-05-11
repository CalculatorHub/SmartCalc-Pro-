import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";

interface FloatingMenuProps {
  setPage: (page: string) => void;
}

export default function FloatingMenu({ setPage }: FloatingMenuProps) {
  const [open, setOpen] = useState(false);

  // 🔥 COMMON ITEM COMPONENT
  const Item = ({ icon, label, onClick, color }: { icon: string, label: string, onClick: () => void, color: string }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3"
    >
      {/* LABEL */}
      <span className="
        px-3 py-1.5 rounded-full
        bg-white/80 dark:bg-white/10
        backdrop-blur-[10px]
        text-xs font-medium
        shadow-lg dark:text-white
      ">
        {label}
      </span>

      {/* ICON BUTTON (FAB) */}
      <button
        onClick={onClick}
        className={`
          w-[52px] h-[52px] rounded-full
          flex items-center justify-center
          text-white text-lg
          shadow-[0_10px_20px_rgba(0,0,0,0.2)]
          transition hover:scale-110 active:scale-95
          ${color}
        `}
      >
        {icon}
      </button>
    </motion.div>
  );

  return (
    <div className="fixed bottom-20 right-4 flex flex-col items-end gap-3 z-[60]">
      {/* ADD NEW ITEMS HERE IF NEEDED IN THE FUTURE */}
      
      {/* ➕ MAIN BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
        onClick={() => setOpen(!open)}
        className="
          w-[52px] h-[52px] rounded-full
          bg-white dark:bg-slate-900 
          text-slate-900 dark:text-white
          shadow-[0_10px_20px_rgba(0,0,0,0.2)]
          flex items-center justify-center
          text-2xl font-light
        "
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
