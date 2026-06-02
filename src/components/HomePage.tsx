import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'motion/react';
import { 
  Wallet, 
  Coins, 
  Fuel, 
  Home, 
  ArrowRight, 
  Sparkle, 
  Activity, 
  Layers, 
  ClipboardList, 
  History, 
  Info 
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Financial Hub",
      subtitle: "EMI, Loan & Rates",
      badge: "Popular",
      icon: Wallet,
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      path: "/finance"
    },
    {
      title: "Metal Calculators",
      subtitle: "Gold & Silver Tools",
      badge: null,
      icon: Coins,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400",
      path: "/gold"
    },
    {
      title: "Fuel & Vehicle",
      subtitle: "Trip & Fuel Estimation",
      badge: null,
      icon: Fuel,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      path: "/vehicle"
    },
    {
      title: "Estate & Property",
      subtitle: "Valuation & Insights",
      badge: "New",
      icon: Home,
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      path: "/estate"
    }
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      
      {/* CORE BRANDING & HERO */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.35em] text-blue-500 uppercase font-mono italic">
              Financial Protocol
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter italic uppercase text-white">
            CALHUB
          </h1>
        </div>

        {/* GREETING & TAGLINE BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="premium-card p-6 rounded-[28px] border-blue-500/20 overflow-hidden relative"
        >
          <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Hello, User 👋
            </div>
            <p className="text-xs font-semibold text-[#8fa3c7] leading-relaxed">
              Smart tools for smarter financial decisions.
            </p>
          </div>
        </motion.div>
      </div>

      {/* STATS RHYTHM COMPARTMENT */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { icon: "🛠️", value: "12+", label: "Tools" },
          { icon: "🧮", value: "4", label: "Calculators" },
          { icon: "🕐", value: "0", label: "History" }
        ].map((stat, idx) => (
          <div 
            key={idx}
            className="premium-card p-4 rounded-2xl flex flex-col items-center justify-center text-center border-white/5 font-mono group hover:border-blue-500/20 transition-all"
          >
            <span className="text-base mb-1.5">{stat.icon}</span>
            <span className="text-lg font-black tracking-tighter text-white italic group-hover:scale-105 transition-transform">
              {stat.value}
            </span>
            <span className="text-[9px] font-bold text-[#8fa3c7] uppercase tracking-wider mt-0.5">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ABOUT TEXT AREA */}
      <div className="premium-card p-5 rounded-2xl border-white/5 space-y-2.5">
        <div className="flex items-center gap-2 text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.2em] italic font-mono">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          About CalHub
        </div>
        <p className="text-[11px] font-bold text-gray-400 leading-relaxed font-mono">
          CalHub is your all-in-one financial calculator platform — simple, accurate and reliable tools for everyday decisions.
        </p>
      </div>

      {/* KEY FEATURES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkle className="w-4 h-4 text-blue-500 animate-spin duration-3000" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] font-mono text-[#8fa3c7]">
            Core Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.path)}
                className={`premium-card p-5 rounded-[24px] bg-gradient-to-br ${item.color} flex items-center justify-between cursor-pointer group transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#020617]/40 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:bg-blue-500/20 transition-all">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
