import React from 'react';
import { Wallet, TrendingUp, Car, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ToolsPage() {
  const navigate = useNavigate();
  
  const tools = [
    { title: "Finance", desc: "EMI, Loan tools", icon: Wallet, path: "/tools/finance", color: "from-blue-600 to-blue-500" },
    { title: "Metals", desc: "Gold & Silver", icon: TrendingUp, path: "/tools/gold", color: "from-amber-500 to-amber-600" },
    { title: "Vehicle", desc: "Fuel cost", icon: Car, path: "/tools/vehicle", color: "from-emerald-500 to-emerald-600" },
    { title: "Estate", desc: "Property", icon: Building, path: "/tools/land", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="px-5 pt-6 pb-32">
      <h1 className="text-2xl font-black italic tracking-tight mb-6">All Tools</h1>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(tool.path)}
              className={`bg-gradient-to-br ${tool.color} p-[1.5px] rounded-3xl cursor-pointer shadow-lg`}
            >
              <div className="bg-[#020617] h-full rounded-[calc(1.5rem-1.5px)] p-5 flex flex-col items-center text-center">
                <div className="bg-white/5 p-3 rounded-2xl mb-3 border border-white/10">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-sm uppercase tracking-tight mb-1">{tool.title}</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide leading-tight">{tool.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
