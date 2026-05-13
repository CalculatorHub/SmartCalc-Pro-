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
import { 
  Menu, User, Bell, Search, Settings, Shield, MessageSquare, X, WifiOff, ArrowLeft,
  Home as HomeIcon, Grid, Clock
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
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Tools", icon: Grid, path: "/tools" },
    { name: "History", icon: Clock, path: "/history" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  const onHome = location.pathname === '/';

  return (
    <div className="min-h-screen transition-all duration-500 selection:bg-blue-500/30 font-sans dark bg-[#020617] text-gray-200">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 h-20 bg-white/5 backdrop-blur-xl border-b border-white/10 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {!onHome && (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <button onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all font-black text-[10px] hidden sm:flex items-center gap-2 uppercase tracking-widest"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden group hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <Shield className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="p-4 md:p-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around py-3 z-50">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                active ? "text-blue-500 scale-110" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 3 : 2} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">{item.name}</span>
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
              className="relative w-full max-w-lg bg-[#020617] rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
            >
               <button 
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-all z-20"
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
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/finance" element={<FinanceHub />} />
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


