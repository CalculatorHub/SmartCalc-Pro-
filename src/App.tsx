import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
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

  const customNavStyles = {
    navWrap: {
      position: "fixed" as const,
      bottom: "10px",
      width: "100%",
      left: 0,
      display: "flex",
      justifyContent: "center",
      zIndex: 1000
    },
    navBar: {
      width: "92%",
      maxWidth: "448px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "14px",
      borderRadius: "30px",
      backdropFilter: "blur(25px)",
      WebkitBackdropFilter: "blur(25px)",
      background: "rgba(15,23,42,0.6)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
      transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease"
    },
    navItem: {
      color: "#cbd5f5",
      fontSize: "22px",
      textDecoration: "none",
      opacity: 0.8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  };

  const getNavColorConfig = () => {
    const path = location.pathname;
    
    // Finance pages: soft blue tint
    if (path === '/finance' || path === '/finance-expert' || path === '/emi' || path === '/simple' || path === '/discount') {
      return {
        background: "rgba(17, 34, 64, 0.75)",
        borderColor: "rgba(59, 130, 246, 0.25)",
        boxShadow: "0 0 25px rgba(59, 130, 246, 0.15), 0 15px 40px rgba(0,0,0,0.6)"
      };
    }
    
    // Metal pages (gold, silver): warm gold/amber tint
    if (path === '/gold' || path === '/silver') {
      return {
        background: "rgba(50, 39, 12, 0.75)",
        borderColor: "rgba(245, 158, 11, 0.25)",
        boxShadow: "0 0 25px rgba(245, 158, 11, 0.15), 0 15px 40px rgba(0,0,0,0.6)"
      };
    }

    // Vehicle pages: soft cyan/teal tint
    if (path === '/vehicle') {
      return {
        background: "rgba(11, 41, 44, 0.75)",
        borderColor: "rgba(6, 182, 212, 0.25)",
        boxShadow: "0 0 25px rgba(6, 182, 212, 0.15), 0 15px 40px rgba(0,0,0,0.6)"
      };
    }

    // Estate pages: soft purple/indigo tint
    if (path === '/estate') {
      return {
        background: "rgba(35, 23, 56, 0.75)",
        borderColor: "rgba(168, 85, 247, 0.25)",
        boxShadow: "0 0 25px rgba(168, 85, 247, 0.15), 0 15px 40px rgba(0,0,0,0.6)"
      };
    }
    
    // Default style
    return {
      background: "rgba(15, 23, 42, 0.6)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 15px 40px rgba(0,0,0,0.6)"
    };
  };

  const getNavItemStyle = (path: string) => {
    const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return {
      ...customNavStyles.navItem,
      color: active ? '#60a5fa' : '#cbd5f5',
      opacity: active ? 1 : 0.7,
      filter: active ? 'drop-shadow(0 0 6px rgba(96,165,250,0.4))' : 'none',
    };
  };

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

      {/* Bottom Navigation wrap & custom styled layout bar */}
      <div style={customNavStyles.navWrap}>
        <div style={{ ...customNavStyles.navBar, ...getNavColorConfig() }}>
          <Link to="/" style={getNavItemStyle('/')}>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              🏠
            </motion.div>
          </Link>

          <Link to="/tools" style={getNavItemStyle('/tools')}>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              🧩
            </motion.div>
          </Link>

          <Link to="/history" style={getNavItemStyle('/history')}>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              🕘
            </motion.div>
          </Link>

          <Link to="/profile" style={getNavItemStyle('/profile')}>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              👤
            </motion.div>
          </Link>
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


