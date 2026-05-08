import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import BottomNav from "./components/BottomNav";
import GoldSilverHub from "./components/GoldSilverHub";
import VehicleHub from "./components/VehicleHub";
import EstateHub from "./components/EstateHub";
import { motion, AnimatePresence } from "motion/react";
import FABMenu from "./components/FABMenu";

import FinanceHub from "./components/FinanceHub";
import FinanceHistory from "./components/FinanceHistory";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard toggleDark={() => setDark(!dark)} isDark={dark} onNavigate={(tab) => setActiveTab(tab)} />
          </motion.div>
        );
      case "finance":
        return (
          <motion.div key="finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FinanceHub />
          </motion.div>
        );
      case "gold":
        return (
          <motion.div key="gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GoldSilverHub />
          </motion.div>
        );
      case "vehicle":
        return (
          <motion.div key="vehicle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VehicleHub />
          </motion.div>
        );
      case "land":
        return (
          <motion.div key="land" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EstateHub />
          </motion.div>
        );
      case "history":
        return (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FinanceHistory />
          </motion.div>
        );
      case "admin":
        return (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminPanel setIsAdmin={setIsAdmin} />
          </motion.div>
        );
      default:
        return (
          <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">Coming Soon</h2>
            <p className="text-sm opacity-60">This specialized hub is currently being calibrated by our AI systems.</p>
            <button 
              onClick={() => setActiveTab("home")}
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm"
            >
              Back Home
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
      <FABMenu onNavigate={setActiveTab} toggleDark={() => setDark(!dark)} isDark={dark} />
    </div>
  );
}
