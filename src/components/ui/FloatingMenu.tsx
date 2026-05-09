import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, MessageSquare, Plus, X } from "lucide-react";

interface FloatingMenuProps {
  setPage: (page: string) => void;
}

export default function FloatingMenu({ setPage }: FloatingMenuProps) {
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role");

  const items = [
    { 
      icon: <MessageSquare className="w-6 h-6" />, 
      page: "feedback", 
      color: "from-emerald-400 to-emerald-600",
      label: "Support",
      glow: "shadow-emerald-500/40"
    },
    ...(role === "admin"
      ? [{ 
          icon: <ShieldCheck className="w-6 h-6" />, 
          page: "admin", 
          color: "from-slate-700 to-slate-900",
          label: "Admin",
          glow: "shadow-slate-500/40"
        }]
      : []),
  ];

  return (
    <>
      {/* Backdrop Blur */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[50]"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 right-6 flex flex-col items-end gap-4 z-[60]">
        {/* MENU ITEMS */}
        <div className="relative flex flex-col items-end gap-3 mb-2">
          <AnimatePresence>
            {open &&
              items.map((item, i) => (
                <motion.div
                  key={item.page}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: (items.length - i - 1) * 0.05 
                  }}
                  className="flex items-center gap-3 group"
                >
                  <span className="bg-white/90 dark:bg-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-slate-200 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <button
                    onClick={() => {
                      setPage(item.page);
                      setOpen(false);
                    }}
                    className={`
                      w-14 h-14 rounded-full
                      bg-gradient-to-br ${item.color}
                      text-white shadow-2xl ${item.glow}
                      flex items-center justify-center
                      hover:scale-110 active:scale-95 transition-transform
                    `}
                  >
                    {item.icon}
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* MAIN BUTTON */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          animate={{ 
            rotate: open ? 90 : 0,
            y: open ? 0 : [0, -6, 0]
          }}
          transition={open ? { duration: 0.2 } : { 
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          onClick={() => setOpen(!open)}
          className="
            w-16 h-16 rounded-full
            bg-white/90 dark:bg-slate-900/90
            backdrop-blur-2xl
            border border-slate-200 dark:border-white/10
            shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            flex items-center justify-center
            text-brand-500 relative overflow-hidden
          "
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              >
                <Plus className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
