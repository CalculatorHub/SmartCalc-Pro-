import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, BarChart3, Camera, History, X } from "lucide-react";

interface FABMenuProps {
  onNavigate?: (tab: string) => void;
}

export default function FABMenu({ onNavigate }: FABMenuProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Finance", color: "bg-blue-500", tab: "finance" },
    { icon: <Camera className="w-5 h-5" />, label: "Scan", color: "bg-purple-500", tab: "scan" },
    { icon: <History className="w-5 h-5" />, label: "History", color: "bg-indigo-500", tab: "history" },
  ];

  const handleItemClick = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            className="mb-4 space-y-3 flex flex-col items-end"
          >
            {menuItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleItemClick(item.tab)}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 pr-4 rounded-xl shadow-xl border border-white/10"
                id={`fab-item-${item.label.toLowerCase()}`}
              >
                <span className="text-xs font-medium">{item.label}</span>
                <div className={`p-2 rounded-lg text-white ${item.color}`}>
                  {item.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center"
        id="main-fab"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
