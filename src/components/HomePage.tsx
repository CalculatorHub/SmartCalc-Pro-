import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp,
  Info,
  AlertTriangle,
  Lightbulb,
  Calendar
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// 📊 SAMPLE REAL-TIME TEMPORAL TRANSACTION TRAFFIC
const trafficData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 4780 },
  { month: "May", value: 5890 },
];

export default function HomePage() {
  // Selected Interactive recommendation index state
  const [activeRecIndex, setActiveRecIndex] = useState(0);

  const aiRecommendations = [
    {
      title: "Fuel Expense Reduction Protocol",
      desc: "You can save ₹5,000 this month by adjusting delivery logistics and vehicle idle parameters.",
      badge: "Logistics",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400"
    },
    {
      title: "Metal Portfolio Diversification",
      desc: "Gold valuation metrics indicate active strength. Reallocating 5% cash to physical reserve is advised.",
      badge: "Hedging",
      color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-[#eab308]"
    },
    {
      title: "Interest Overhead Warning Check",
      desc: "Amortization records reveal opportunity: refinancing active high-interest property holdings saves up to 1.8% compounding.",
      badge: "Mortgages",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400"
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

      {/* 📊 REAL TIME USER ANALYTICS LINE CHART */}
      <div className="premium-card p-5 rounded-[24px] border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#8fa3c7] font-mono">Monthly Overview</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Asset & transaction index trajectory</p>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
            Active Feed
          </span>
        </div>

        <div className="w-full h-[180px] pt-2 font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                tickLine={false} 
                axisLine={false}
                dy={8}
                style={{ fontSize: '9px', fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#3b82f630', 
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#1e3a8a', stroke: '#60a5fa', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#60a5fa' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATS RHYTHM COMPARTMENT */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { icon: "🛠️", value: "5", label: "Tools" },
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

      {/* 💡 AI DYNAMIC RECOMMENDATIONS CONTAINER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.25em] font-mono text-[#8fa3c7]">
              AI Insight Stream
            </h2>
          </div>
          <div className="flex gap-1">
            {aiRecommendations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveRecIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeRecIndex === idx ? 'bg-yellow-400 w-4' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={activeRecIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`premium-card p-5 rounded-[22px] bg-gradient-to-r ${aiRecommendations[activeRecIndex].color} space-y-2.5 relative overflow-hidden`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/5 font-mono">
              {aiRecommendations[activeRecIndex].badge}
            </span>
            <span className="text-[9px] font-black text-yellow-400/80 font-mono tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping mr-1" />
              Dynamic Recommendation
            </span>
          </div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            {aiRecommendations[activeRecIndex].title}
          </h4>
          <p className="text-[11px] font-bold text-gray-300 leading-relaxed font-sans">
            {aiRecommendations[activeRecIndex].desc}
          </p>
        </motion.div>
      </div>

      {/* 📅 MONTHLY REPORT BREAKDOWN CARD */}
      <div className="premium-card p-5 rounded-[22px] border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#8fa3c7] uppercase tracking-widest font-mono">Monthly Report Summary</h3>
            <p className="text-[10px] text-gray-400 font-medium">Core system aggregates</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
            <span className="text-[8px] font-bold text-[#8fa3c7] uppercase tracking-widest">Total Savings</span>
            <p className="text-lg font-black text-emerald-400 mt-1 italic">₹80,000</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono">
            <span className="text-[8px] font-bold text-[#8fa3c7] uppercase tracking-widest">Total Expenses</span>
            <p className="text-lg font-black text-red-400 mt-1 italic">₹25,000</p>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[8px] font-black text-[#8fa3c7] uppercase tracking-widest font-mono">
            <span>Utilization Ratio</span>
            <span className="text-indigo-400">31.2%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '31.2%' }} />
          </div>
        </div>
      </div>

      {/* 🔔 SMART LOGISTIC ALERT CARD */}
      <div className="premium-card p-4 rounded-2xl border-red-500/20 bg-red-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-red-500/25 pointer-events-none">
          <AlertTriangle className="w-16 h-16 transform translate-x-3 translate-y-2 rotate-12" />
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/20 text-red-400 rounded-xl shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1 pr-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">Smart Operational Alert</div>
            <p className="text-[11px] font-bold text-[#e2e8f0] leading-relaxed">
              Your fuel expenses increased by <span className="text-red-400 font-black">12%</span> this week. CalHub dynamic analytics logs recommend checking routing parameters.
            </p>
          </div>
        </div>
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



    </div>
  );
}
