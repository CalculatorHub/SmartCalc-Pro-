import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import FinanceHub from './components/FinanceHub';
import MetalsPage from './components/MetalsHub/MetalsPage';
import VehiclePage from './components/VehicleHub/VehiclePage';
import EstatePage from './components/EstateHub/EstatePage';
import HomePage from './components/HomePage';
import ToolsPage from './components/ToolsPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import FeedbackSystem from './components/FeedbackSystem';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import EMI from './pages/EMI';
import Simple from './pages/Simple';
import Discount from './pages/Discount';
import { 
  Menu, User, Bell, Search, Settings, Shield, MessageSquare, X, WifiOff, ArrowLeft,
  Home as HomeIcon, Grid, Clock, TrendingUp, CreditCard, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Logo from './components/ui/Logo';

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { name: "Home", emoji: "🏠", path: "/" },
    { name: "Tools", emoji: "🧩", path: "/tools" },
    { name: "History", emoji: "🕘", path: "/history" },
    { name: "Profile", emoji: "👤", path: "/profile" },
  ];

  const onHome = location.pathname === '/';
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <div className="min-h-screen transition-all duration-500 selection:bg-blue-500/30 font-sans text-white bg-[#020617] relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 h-16 bg-[#020617]/50 backdrop-blur-2xl border-b border-white/5 z-50 px-6 flex items-center justify-between shadow-glow-sm">
        <div className="flex items-center gap-5">
          {!onHome && (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-[#8fa3c7] hover:text-white border border-white/5 transition-all cursor-pointer active:scale-90"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          
          <button onClick={() => navigate('/')} className="cursor-pointer group">
            <span className="font-black text-[15px] tracking-tighter italic uppercase group-hover:text-blue-500 transition-colors">CALHUB</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Feedback Button */}
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-[#8fa3c7] hover:text-blue-500 transition-all active:scale-95"
            title="Feedback"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          
          {/* Notifications Button 🔔 */}
          <button 
            onClick={() => {
              setShowNotificationToast(true);
              setTimeout(() => setShowNotificationToast(false), 4000);
            }}
            className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-[#8fa3c7] hover:text-yellow-500 transition-all active:scale-95"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-yellow-400 rounded-full" />
          </button>

          {/* Security / Admin Button 🛡️ */}
          <button 
            onClick={() => navigate('/admin')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 text-[#8fa3c7] hover:text-emerald-500 transition-all active:scale-95"
            title="Security / Admin Portal"
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Dynamic Toast Notification Container */}
      <AnimatePresence>
        {showNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm p-4 bg-blue-950/80 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-glow text-[#e6ecff]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-yellow-400">All Systems Active</div>
                <div className="text-xs font-bold text-gray-300 mt-0.5">Calculators, feeds and secure nodes are fully optimized. No issue was detected.</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="p-4 md:p-8 max-w-lg mx-auto min-h-[calc(100vh-64px)] pb-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md flex justify-around py-3 px-2 rounded-[20px] backdrop-blur-[16px] bg-[#0f172a]/70 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[1000] transition-all duration-300">
        {navItems.map((item, i) => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center text-[12px] text-white no-underline transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none"
              style={{ transition: "0.3s" }}
            >
              <span className="text-xl mb-0.5" role="img" aria-label={item.name}>{item.emoji}</span>
              <span className={`text-[10px] font-medium tracking-wide transition-colors ${active ? "text-blue-400 font-bold" : "text-gray-300 opacity-80"}`}>
                {item.name}
              </span>
              {active && (
                <motion.div 
                  layoutId="nav-dot" 
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-0.5 shadow-[0_0_8px_rgba(96,165,250,0.8)]" 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Feedback Modal Overlay */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#020617] rounded-[30px] shadow-glow border border-blue-500/20 overflow-hidden"
            >
               <button 
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-[#8fa3c7] hover:text-white transition-all z-20 border border-white/5 active:scale-90"
               >
                 <X className="w-5 h-5" />
               </button>
               <FeedbackSystem />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offline Notification */}
      {!isOnline && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
          <WifiOff className="w-3 h-3" />
          You are offline – app still works
        </div>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/discount" element={<Discount />} />
          <Route path="/emi" element={<EMI />} />
          <Route path="/simple" element={<Simple />} />
          <Route path="/finance-expert" element={<FinanceHub />} />
          <Route path="/hub" element={<HomePage />} />
          <Route path="/gold" element={<MetalsPage mode="gold" />} />
          <Route path="/silver" element={<MetalsPage mode="silver" />} />
          <Route path="/vehicle" element={<VehiclePage />} />
          <Route path="/estate" element={<EstatePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


