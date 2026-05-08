import React from "react";
import { motion } from "motion/react";
import { Moon, Sun, TrendingUp, TrendingDown, IndianRupee, Coins, Car, Home, ShieldCheck } from "lucide-react";
import PremiumCard from "./PremiumCard";
import InstallPWA from "./InstallPWA";

interface DashboardProps {
  toggleDark: () => void;
  isDark: boolean;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ toggleDark, isDark, onNavigate }: DashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 pb-32 max-w-md mx-auto min-h-screen">
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] p-6 mb-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/5"
        id="dashboard-hero"
      >
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Smartcalpro+
            </h1>
            <p className="text-xs font-medium opacity-60 dark:opacity-40 uppercase tracking-widest mt-1">
              Financial Intelligence
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate("admin")}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-white/10 rounded-2xl transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 group"
              id="admin-access"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDark}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-white/10 rounded-2xl transition-all hover:bg-orange-50 dark:hover:bg-yellow-900/20 group"
              id="theme-toggle"
              title="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform" />
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-sm opacity-70 mt-6 leading-relaxed max-w-[80%]">
          Your integrated dashboard for precision financial tracking and AI-driven market predictions.
        </p>

        {/* Decorative Glows */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 opacity-20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500 opacity-20 blur-[80px] pointer-events-none" />
      </motion.div>

      {/* QUICK ACTIONS / CARDS */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        <motion.div variants={item}>
          <PremiumCard 
            title="Finance" 
            icon={<IndianRupee />} 
            color="from-blue-500 to-indigo-600" 
            onClick={() => onNavigate("finance")}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <PremiumCard 
            title="Metals" 
            icon={<Coins />} 
            color="from-yellow-400 to-orange-500" 
            onClick={() => onNavigate("gold")}
          />
        </motion.div>

        <motion.div variants={item}>
          <PremiumCard 
            title="Vehicle" 
            icon={<Car />} 
            color="from-teal-400 to-cyan-600" 
            onClick={() => onNavigate("vehicle")}
          />
        </motion.div>

        <motion.div variants={item}>
          <PremiumCard 
            title="Estate" 
            icon={<Home />} 
            color="from-pink-500 to-purple-600" 
            onClick={() => onNavigate("land")}
          />
        </motion.div>
      </motion.div>

      {/* AI INSIGHTS SECTION */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 p-5 rounded-3xl bg-white/40 dark:bg-slate-900/30 backdrop-blur-xl shadow-xl border border-white/10"
        id="ai-insights-panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <h2 className="font-bold text-sm uppercase tracking-widest opacity-80">AI Market Insights</h2>
        </div>
        
        <p className="text-xs opacity-60 mb-6 italic">Neural network analysis of current market trends</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-500/5 border border-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Gold Trend</span>
              <span className="text-[10px] opacity-50 uppercase">Global Market</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>BULLISH</span>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-500/5 border border-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Fuel Cost</span>
              <span className="text-[10px] opacity-50 uppercase">Inflationary Index</span>
            </div>
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>RISING</span>
            </div>
          </div>
        </div>
      </motion.div>

      <InstallPWA />
    </div>
  );
}
