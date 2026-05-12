import React, { useState, useEffect } from 'react';
import FinanceHub from './components/FinanceHub';
import MetalsPage from './components/MetalsHub/MetalsPage';
import VehiclePage from './components/VehicleHub/VehiclePage';
import EstatePage from './components/EstateHub/EstatePage';
import BottomNav from './components/BottomNav';
import HomePage from './components/HomePage';
import DownloadAppButton from './components/DownloadAppSection';
import AdminPanel from './components/AdminPanel';
import FeedbackSystem from './components/FeedbackSystem';
import { 
  Menu, User, Sun, Moon, Bell, Search, Settings, Shield, MessageSquare, X, WifiOff, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabId = 'home' | 'finance' | 'gold' | 'vehicle' | 'land' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const saved = localStorage.getItem('last_tab');
    return (saved as TabId) || 'home';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showUserMenu, setShowUserMenu] = useState(false);
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

  useEffect(() => {
    localStorage.setItem('last_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'finance':
        return <FinanceHub />;
      case 'gold':
        return <MetalsPage />;
      case 'vehicle':
        return <VehiclePage />;
      case 'land':
        return <EstatePage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-600 border border-gray-200 dark:border-gray-700 shadow-inner">
                <Search className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white capitalize tracking-tight">{activeTab} Section</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto font-medium">This module is currently being optimized for the best financial experience. Stay tuned!</p>
            </div>
            <button 
              onClick={() => setActiveTab('home')}
              className="h-11 px-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-transform active:scale-95"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 selection:bg-blue-500/30 font-sans ${isDarkMode ? 'dark bg-[#020617] text-gray-200' : 'bg-gray-100 text-gray-800'}`} id="main-container">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 h-20 bg-white/40 dark:bg-white/5 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 z-50 px-6 flex items-center justify-between" id="header">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('home')}
            className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group hover:rotate-6 transition-all duration-300 cursor-pointer"
          >
            {activeTab === 'home' ? (
              <Menu className="w-6 h-6 animate-in zoom-in duration-300" />
            ) : (
              <ArrowLeft className="w-6 h-6 animate-in slide-in-from-right-1 duration-300" />
            )}
          </div>
          <div className="flex flex-col -space-y-1">
             <h1 className="text-2xl font-black italic tracking-widest text-gray-900 dark:text-white">CALHUB</h1>
             <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] translate-x-0.5">PROTOCOL 01</span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="px-3 py-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all font-black text-[10px] hidden sm:flex items-center gap-2 uppercase tracking-widest mr-1"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>

          <DownloadAppButton />

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-white/10 transition hover:scale-110 active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10 cursor-pointer overflow-hidden group hover:ring-2 hover:ring-blue-500 transition-all ml-1"
            >
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#020617]/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 py-2 z-20"
                  >
                    <button 
                      onClick={() => { setActiveTab('admin'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <Shield className="w-4 h-4 text-gray-400" />
                      Admin Login
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Settings className="w-4 h-4 text-gray-400" />
                      Settings
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto" id="content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Resets components on switch
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Navigation */}
      <BottomNav activeTab={activeTab === 'admin' ? null : activeTab} onTabChange={(tab) => { setActiveTab(tab); setShowUserMenu(false); }} />

      {/* Offline Notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <WifiOff className="w-3 h-3" />
            You are offline – app still works
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Download Button (Mobile Only) */}
      <div className="fixed bottom-20 left-0 right-0 p-4 flex justify-center z-40 sm:hidden pointer-events-none">
        <div className="pointer-events-auto">
          <DownloadAppButton />
        </div>
      </div>

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
              className="relative w-full max-w-lg bg-white dark:bg-[#020617] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
            >
               <button 
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all z-20"
               >
                 <X className="w-5 h-5" />
               </button>
               <FeedbackSystem />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


