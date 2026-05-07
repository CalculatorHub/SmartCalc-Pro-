import React from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface PremiumCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

export default function PremiumCard({ title, icon, color, onClick }: PremiumCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-4 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-lg border border-white/20 overflow-hidden cursor-pointer"
      id={`premium-card-${title.toLowerCase()}`}
    >
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 bg-gradient-to-r ${color}`} 
      />

      <div className="flex items-center gap-4 relative z-10">
        {/* ICON */}
        <div 
          className={`w-14 h-14 flex items-center justify-center text-2xl text-white rounded-xl bg-gradient-to-br ${color} shadow-xl transform group-hover:rotate-6 transition-transform`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-70 flex items-center gap-1">
            Open tools <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
