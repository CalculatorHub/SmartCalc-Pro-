import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ToolsPage() {
  const navigate = useNavigate();

  const tools = [
    { title: "Finance", icon: "💲", path: "/finance", glow: "shadow-blue-500/20" },
    { title: "Gold", icon: "🪙", path: "/gold", glow: "shadow-yellow-500/20" },
    { title: "Silver", icon: "🥈", path: "/silver", glow: "shadow-gray-400/20" },
    { title: "Vehicle", icon: "🚗", path: "/vehicle", glow: "shadow-green-500/20" },
    { title: "Estate", icon: "🏠", path: "/estate", glow: "shadow-purple-500/20" },
  ];

  return (
    <div className="px-5 pt-6 pb-28 text-white">
      <h1 className="text-xl font-semibold mb-6 flex items-center gap-3">
        All Protocols
      </h1>

      <div className="grid grid-cols-2 gap-5">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(tool.path)}
            className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 cursor-pointer backdrop-blur-xl transition-all duration-500 hover:from-blue-500/40 hover:to-purple-500/40 shadow-lg"
          >
            <div className={`bg-[#0B0F1A] rounded-2xl p-6 h-full flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-white/5 ${tool.glow}`}>
              {/* Emoji Icon Container */}
              <div className="text-3xl mb-4 bg-white/10 p-4 rounded-2xl shadow-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-sm tracking-tight text-gray-300 group-hover:text-white transition-colors">
                {tool.title}
              </h3>
              
              {/* Detail Accent */}
              <div className="mt-3 w-8 h-1 bg-white/10 rounded-full group-hover:w-12 group-hover:bg-blue-500 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
