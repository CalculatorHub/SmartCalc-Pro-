import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ToolsPage() {
  const navigate = useNavigate();

  const tools = [
    { title: "Finance", icon: "💲", path: "/finance", glow: "shadow-blue-500/20" },
    { title: "Discount", icon: "🏷️", path: "/discount", glow: "shadow-rose-500/20" },
    { title: "Gold", icon: "🪙", path: "/gold", glow: "shadow-yellow-500/20" },
    { title: "Silver", icon: "🥈", path: "/silver", glow: "shadow-gray-400/20" },
    { title: "Vehicle", icon: "🚗", path: "/vehicle", glow: "shadow-green-500/20" },
    { title: "Estate", icon: "🏠", path: "/estate", glow: "shadow-purple-500/20" },
  ];

  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Control Matrix</h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">Select operational protocol</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(tool.path)}
            className="premium-card p-6 py-8 rounded-[30px] flex flex-col items-center justify-center text-center cursor-pointer group active:bg-white/5 transition-all"
          >
            <div className="text-4xl mb-5 bg-white/5 w-20 h-20 flex items-center justify-center rounded-3xl shadow-glow-sm border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
              {tool.icon}
            </div>

            <h3 className="font-black text-xs uppercase tracking-[0.2em] italic text-white group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h3>
            
            <div className="mt-4 w-4 h-1 bg-white/10 rounded-full group-hover:w-16 group-hover:bg-blue-500 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
