import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Percent,
  TrendingUp,
  Flame,
  Coins,
  Sparkles,
  Home,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  Bell,
  ChevronRight,
  Calculator,
  BarChart2,
  BookmarkCheck,
  Building,
  HelpCircle,
  Globe,
  Shield,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTab, CalculatorType, HistoryItem, NotificationItem, UserPreferences } from './types';
import { cn } from './utils';
import { appendSecurityLog } from './utils/security';

// Calculator components
import InterestCalc from './components/InterestCalc';
import FuelCalc from './components/FuelCalc';
import MetalCalc from './components/MetalCalc';
import EstateCalc from './components/EstateCalc';
import HistoryTab from './components/HistoryTab';
import ProfileTab from './components/ProfileTab';
import NotificationsPanel from './components/NotificationsPanel';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Market Surge',
    message: 'Gold price index has gained +1.24% today. Live rates reach a peak of $75.50/g.',
    time: '4 mins ago',
    unread: true,
    type: 'success',
  },
  {
    id: 'n2',
    title: 'Compound Interest Secret',
    message: 'Compounding daily instead of annually yields up to 0.35% higher APY on large deposits.',
    time: '2 hours ago',
    unread: true,
    type: 'info',
  },
  {
    id: 'n3',
    title: 'Real Estate Tax Note',
    message: 'State stamp duty rates average 5.0%. Added closing fees can add up to 6% of property value.',
    time: '1 day ago',
    unread: true,
    type: 'warning',
  },
];

export default function App() {
  // Shell tabs selection
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCalc, setSelectedCalc] = useState<CalculatorType>('interest');

  // Stored state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    userName: 'Smart Finance Owner',
    currency: '₹',
    themeColor: 'indigo',
    weeklyGoal: 5,
    theme: 'light',
    locationPermission: true,
    vegMode: false,
    hapticFeedback: true,
    inputSanitization: true,
    transitEncryption: true,
    screenshotProtection: true,
    inactiveSessionAutoLogout: 'off'
  });

  // Cybersecurity Suite active states
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [securityBlockUntil, setSecurityBlockUntil] = useState<number | null>(null);
  const [securityPINInput, setSecurityPINInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [unlockAttempts, setUnlockAttempts] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  // User activity listeners
  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    // Track window focus (screenshot protection/blur simulation)
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Poll for inactivity or lockouts
  useEffect(() => {
    const interval = setInterval(() => {
      // Check session lock block time cooldown
      if (securityBlockUntil && Date.now() > securityBlockUntil) {
        setSecurityBlockUntil(null);
        setUnlockAttempts(0);
        setPinError("");
      }

      // Check inactive session auto-logout config
      const setting = preferences.inactiveSessionAutoLogout || 'off';
      if (setting !== 'off' && !isSessionLocked) {
        let thresholdMs = 0;
        if (setting === '1m') thresholdMs = 60000;
        else if (setting === '5m') thresholdMs = 300000;
        else if (setting === '15m') thresholdMs = 900000;

        if (thresholdMs > 0 && Date.now() - lastActivityTime > thresholdMs) {
          setIsSessionLocked(true);
          appendSecurityLog(`Inactivity threshold (${setting}) exceeded. Inactive logout lock triggered.`, "high");
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastActivityTime, preferences.inactiveSessionAutoLogout, isSessionLocked, securityBlockUntil]);

  // Dynamic theme effect matching provided mobile/web guidelines
  useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme = preferences.theme || 'system';
    
    const applyTheme = (themeMode: 'light' | 'dark') => {
      if (themeMode === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (currentTheme === 'dark') {
      applyTheme('dark');
    } else if (currentTheme === 'light') {
      applyTheme('light');
    } else {
      // System mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  // Load state from local storage on mount
  useEffect(() => {
    const savedHist = localStorage.getItem('finance_history_v1');
    if (savedHist) {
      try {
        setHistory(JSON.parse(savedHist));
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }

    const savedNotifs = localStorage.getItem('finance_notif_v1');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
    }

    const savedPref = localStorage.getItem('finance_pref_v1');
    if (savedPref) {
      try {
        const parsed = JSON.parse(savedPref);
        parsed.currency = '₹';
        // Ensure defaults are backfilled on existing older stored JSON
        if (parsed.theme === undefined) parsed.theme = 'light';
        if (parsed.locationPermission === undefined) parsed.locationPermission = true;
        if (parsed.vegMode === undefined) parsed.vegMode = false;
        if (parsed.hapticFeedback === undefined) parsed.hapticFeedback = true;
        setPreferences(parsed);
      } catch (e) {
        console.error('Failed to load preferences', e);
      }
    }
  }, []);

  // Sync states to local storage
  const saveToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: new Date().toISOString(),
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    localStorage.setItem('finance_history_v1', JSON.stringify(updated));
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('finance_history_v1', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('finance_history_v1');
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    localStorage.setItem('finance_notif_v1', JSON.stringify(updated));
  };

  const dismissAllNotifications = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    localStorage.setItem('finance_notif_v1', JSON.stringify(updated));
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    const nextPref = { ...preferences, ...updated };
    setPreferences(nextPref);
    localStorage.setItem('finance_pref_v1', JSON.stringify(nextPref));
  };

  // Restore history values back into a functional calculator
  const handleRestore = (item: HistoryItem) => {
    setSelectedCalc(item.type);
    setActiveTab('calculate');
  };

  // Switch to specific calculator
  const handleLaunchCalc = (type: CalculatorType) => {
    setSelectedCalc(type);
    setActiveTab('calculate');
  };

  const handleUnlockSession = () => {
    if (securityBlockUntil && Date.now() < securityBlockUntil) {
      setPinError(`Device Bruteforce Protection engaged. Please wait.`);
      return;
    }

    const cleanedPin = securityPINInput.trim();
    // Unlock matches default PIN "1234" or the current username
    const matchesUser = cleanedPin.toLowerCase() === preferences.userName.toLowerCase();
    const matchesPIN = cleanedPin === "1234";

    if (matchesUser || matchesPIN) {
      setIsSessionLocked(false);
      setSecurityPINInput("");
      setUnlockAttempts(0);
      setPinError("");
      appendSecurityLog(`Session unlocked successfully using authorized passcode.`, "low");
    } else {
      const nextCount = unlockAttempts + 1;
      setUnlockAttempts(nextCount);
      if (nextCount >= 4) {
        const until = Date.now() + 15000; // 15 seconds lockout inside simulation
        setSecurityBlockUntil(until);
        setPinError(`Too many incorrect inputs. Cyber defense lockout active for 15s.`);
        appendSecurityLog(`Local passcode brute force block engaged (4 failures). Lockout.`, "high");
      } else {
        setPinError(`Incorrect secure key! Attempt ${nextCount}/4`);
      }
    }
  };

  // Active unread indicator count
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-app-bg font-sans text-app-text pb-20 md:pb-6 flex flex-col selection:bg-app-accent/20 selection:text-app-text transition-colors duration-255">
      
      {/* 📸 Screenshot & Privacy Blur Overlay */}
      {preferences.screenshotProtection && !isWindowFocused && (
        <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-xl z-100 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#4F46E5]/10 dark:bg-[#FACC15]/10 flex items-center justify-center text-[#4F46E5] dark:text-[#FACC15] border border-indigo-500/20 mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Sensitive Canvas Shield Active</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Content blurred to prevent screenshot grabs, spywares, or shoulder-sniffing when window focus is lost. Click back inside this tab to resume securely.
          </p>
        </div>
      )}

      {/* 🛡️ Secure Session Lock Screen */}
      {isSessionLocked && (
        <div className="fixed inset-0 bg-[#0F172A]/95 dark:bg-[#090D1A]/98 z-90 flex flex-col items-center justify-center p-6 font-sans select-none animate-in fade-in duration-250">
          <div className="max-w-md w-full bg-[#1E293B] border border-[#334155] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm animate-pulse">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">Cyber Session Securely Locked</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  Your inactivity logout timer triggered. Please enter your secure credentials or passcode to restore access parameters.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Passcode (Use "1234" or profile name):</label>
                <input
                  type="password"
                  value={securityPINInput}
                  disabled={!!securityBlockUntil}
                  onChange={(e) => setSecurityPINInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUnlockSession();
                  }}
                  className="w-full px-4 py-3 bg-[#0F172A]/80 border border-[#334155] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-lg font-mono tracking-widest placeholder-slate-600 disabled:opacity-50"
                  placeholder="••••"
                />
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-semibold text-center mt-1 animate-pulse">
                  {pinError}
                </p>
              )}

              <button
                type="button"
                disabled={!!securityBlockUntil || !securityPINInput}
                onClick={handleUnlockSession}
                className="w-full bg-[#4F46E5] hover:opacity-90 disabled:opacity-50 transition-all font-bold text-sm py-3 text-white rounded-xl cursor-pointer active:scale-95"
              >
                {securityBlockUntil ? "Cooling down..." : "Unlock Session Securely"}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-[#334155]/50 flex items-center justify-between text-[10px] text-slate-500">
              <span>Smart Finance Security</span>
              <span>256-Bit Emulation</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 🔹 MAIN WRAPPER CONTAINER */}
      <div className="max-w-5xl w-full mx-auto p-4 md:p-6 flex-1 flex flex-col gap-6">
        
        {/* 🔹 STEP 1: TOP NAVIGATION HEADER BAR */}
        <header className="flex items-center justify-between bg-app-card px-6 py-4 md:px-8 md:py-5 rounded-3xl border border-app-border shadow-xs relative transition-colors duration-255">
          
          {/* Welcome Text, matching Vibrant Palette header design */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-app-card rounded-2xl overflow-hidden flex items-center justify-center shadow-xs border border-app-border shrink-0">
              <img
                src="/src/assets/images/smart_finance_logo_1780875300350.png"
                alt="Smart Finance Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-app-accent tracking-widest leading-none mb-1">Smart Finance</p>
              <h2 className="text-sm font-bold text-app-text leading-tight md:text-base font-display">
                {preferences.userName} 👋
              </h2>
            </div>
          </div>

          {/* Controls Profile and Notifications, mirroring Vibrant Palette buttons */}
          <div className="flex items-center gap-3 relative">

            <div className="relative">
              {/* Bell with Badge */}
              <button
                id="bell-button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "p-2.5 rounded-full text-app-text-secondary hover:text-app-text bg-app-card shadow-xs border border-app-border transition-all cursor-pointer relative",
                  showNotifications ? "bg-app-accent/10 border-app-accent/40 text-app-accent" : ""
                )}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification overlay */}
              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPanel
                    notifications={notifications}
                    onMarkAsRead={markNotificationRead}
                    onDismissAll={dismissAllNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "p-2.5 rounded-full text-app-text-secondary hover:text-app-text bg-app-card shadow-xs border border-app-border transition-all cursor-pointer flex items-center justify-center",
                activeTab === 'profile' ? "bg-app-accent/10 border-app-accent/40 text-app-accent" : ""
              )}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 🔹 STEP 2: ACTIVE TAB RENDER VIEWS */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              
              {/* ----------------- HOME TAB ----------------- */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  
                  {/* Banner: "Plan smart. Calculate better." */}
                  <div className="relative overflow-hidden text-white bg-gradient-to-br from-[#4F46E5] via-[#3730A3] to-[#1E1B4B] dark:from-[#1E1B4B] dark:via-[#111827] dark:to-[#030712] p-8 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between group min-h-48 transition-all duration-300">
                    {/* Abstract circles design elements decoration */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full translate-x-16 translate-y-16 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 dark:bg-white/5 rounded-full blur-xl"></div>
                    <svg className="absolute bottom-[-15%] right-[-5%] w-60 h-60 text-white/15 dark:text-white/5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                    
                    <div className="space-y-2 z-10">
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display text-white">
                        Plan Smart. Calculate Better.
                      </h2>
                      <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xl font-normal">
                        All your financial and asset calculators unified in one powerful, highly responsive client dashboard.
                      </p>
                    </div>

                    <div className="z-10 pt-2 align-self-start">
                      <button
                        onClick={() => setActiveTab('tools')}
                        className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        Explore Tools →
                      </button>
                    </div>
                  </div>

                  {/* TITLE BLOCKS SECTION */}
                  <div className="flex items-center justify-between select-none">
                    <h3 className="text-xl font-bold text-app-text font-display">
                      Popular Tools
                    </h3>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="text-app-accent font-semibold hover:underline cursor-pointer text-sm"
                    >
                      View All
                    </button>
                  </div>

                  {/* GRID OF 3 CARDS Matching Popular Tools grid from Design HTML */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* 1. Interest Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('interest')}
                      className="group bg-app-card p-6 rounded-3xl shadow-xs hover:shadow-md border border-app-border hover:border-app-accent/40 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-app-accent/10 text-app-accent rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-app-accent group-hover:text-white dark:group-hover:text-zinc-950">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-app-text font-display text-sm">Interest Calculator</p>
                        <p className="text-xs text-app-text-secondary">Simple & Compound modes</p>
                      </div>
                    </div>

                    {/* 2. Fuel Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('fuel')}
                      className="group bg-app-card p-6 rounded-3xl shadow-xs hover:shadow-md border border-app-border hover:border-app-accent/40 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-app-accent/10 text-app-accent rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-app-accent group-hover:text-white dark:group-hover:text-zinc-950">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-app-text font-display text-sm">Fuel Efficiency</p>
                        <p className="text-xs text-app-text-secondary">Trip & mileage costs</p>
                      </div>
                    </div>

                    {/* 3. Precious Metals Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('gold')}
                      className="group bg-app-card p-6 rounded-3xl shadow-xs hover:shadow-md border border-app-border hover:border-app-accent/40 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-app-accent/10 text-app-accent rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-app-accent group-hover:text-white dark:group-hover:text-zinc-950">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-app-text font-display text-sm">Precious Metals</p>
                        <p className="text-xs text-app-text-secondary">Gold & Silver live price benchmark</p>
                      </div>
                    </div>

                  </div>

                  {/* ESTATE CARD SECTION matching Real Estate Calculator from Design HTML */}
                  <div
                    onClick={() => handleLaunchCalc('estate')}
                    className="bg-app-card rounded-3xl p-6 shadow-xs border border-app-border flex items-center gap-6 cursor-pointer hover:shadow-md hover:border-app-accent/40 transition-all group"
                  >
                    <div className="w-14 h-14 bg-app-accent/10 text-app-accent rounded-2xl flex items-center justify-center shrink-0 shadow-3xs transition-all duration-300 group-hover:bg-app-accent group-hover:text-white dark:group-hover:text-zinc-950">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-app-text text-lg font-display">Real Estate Calculator</p>
                      <p className="text-app-text-secondary text-sm">Mortgage EMI, local stamp duty taxes, and property affordability planner</p>
                    </div>
                    <svg className="w-6 h-6 text-app-text-secondary transition-colors group-hover:text-app-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* QUICK LOG RECORD BANNER */}
                  {history.length > 0 && (
                    <div className="bg-app-accent/10 border border-app-accent/20 p-5 rounded-3xl flex items-center justify-between text-xs font-semibold shadow-xs">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-app-accent shrink-0 animate-pulse" />
                        <span className="text-app-text text-sm">You have {history.length} calculated scenarios stored.</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('history')}
                        className="text-app-accent hover:text-app-accent/80 text-sm font-black transition-all hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Check Logs →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- TOOLS TAB CATALOG ----------------- */}
              {activeTab === 'tools' && (
                <div className="space-y-4">
                  <h3 className="font-black text-lg text-app-text select-none">Financial Catalogs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { type: 'interest', name: 'Interest Calculator', sub: 'Calculate standard linear (Simple) and exponential (Compound) periods.', ic: <Percent className="w-5 h-5" /> },
                      { type: 'fuel', name: 'Fuel & Commuting', sub: 'Log mileage, travel parameters, fuel prices boundaries, CO2 impact.', ic: <Flame className="w-5 h-5" /> },
                      { type: 'gold', name: 'Precious Metals Tracker', sub: 'Locate baseline 24K, 22K, 18K Gold & Silver rates extra GST 3% MCX references in India.', ic: <Sparkles className="w-5 h-5" /> },
                      { type: 'estate', name: 'Real Estate Master', sub: 'Plan mortgage EMIs, stamp duty taxation, and housing affordability thresholds.', ic: <Building className="w-5 h-5" /> },
                    ].map((t) => (
                      <div
                        key={t.type}
                        onClick={() => {
                          setSelectedCalc(t.type as CalculatorType);
                          setActiveTab('calculate');
                        }}
                        className="bg-app-card border border-app-border rounded-2xl p-5 hover:scale-101 hover:shadow-xs hover:border-app-accent/40 transition-all cursor-pointer flex flex-col justify-between text-xs h-44"
                      >
                        <div className="space-y-3.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-app-accent/10 text-app-accent shadow-3xs">
                            {t.ic}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-sm text-app-text">{t.name}</h4>
                            <p className="text-app-text-secondary font-semibold leading-relaxed text-[11px]">{t.sub}</p>
                          </div>
                        </div>
                        <span className="text-app-accent font-extrabold flex items-center gap-1 hover:underline select-none">
                          Open Tool <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------- CALCULATE TAB ----------------- */}
              {activeTab === 'calculate' && (
                <div className="space-y-6">
                  {/* Selector Header Bar */}
                  <div className="bg-app-card p-3.5 rounded-2xl border border-app-border flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
                    <span className="text-xs font-black text-[#475569] dark:text-[#D1D5DB] uppercase tracking-widest hidden sm:inline select-none font-sans">Active Workspace:</span>
                    <div className="flex bg-app-bg p-0.5 rounded-xl border border-app-border font-bold text-xs scrollbar-none overflow-x-auto">
                      {[
                        { id: 'interest', label: 'Interest' },
                        { id: 'fuel', label: 'Fuel' },
                        { id: 'gold', label: 'Precious Metals' },
                        { id: 'estate', label: 'Estate' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedCalc(tab.id as CalculatorType)}
                          className={cn(
                            "px-4 py-2 rounded-lg transition-all cursor-pointer text-center font-bold text-xs",
                            selectedCalc === tab.id
                              ? "bg-[#4F46E5] text-white dark:bg-[#FACC15] dark:text-[#000000] shadow-xs"
                              : "text-[#475569] dark:text-[#D1D5DB] hover:text-[#4F46E5] dark:hover:text-[#FACC15]"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculator view viewport */}
                  <div className="min-h-96">
                    {(selectedCalc === 'interest' || selectedCalc === 'simple' || selectedCalc === 'compound') && (
                      <InterestCalc 
                        initialMode={selectedCalc === 'compound' ? 'compound' : 'simple'} 
                        currency={preferences.currency} 
                        onSaveHistory={saveToHistory} 
                      />
                    )}
                    {selectedCalc === 'fuel' && (
                      <FuelCalc currency={preferences.currency} onSaveHistory={saveToHistory} />
                    )}
                    {(selectedCalc === 'gold' || selectedCalc === 'silver') && (
                      <MetalCalc initialType={selectedCalc} currency={preferences.currency} onSaveHistory={saveToHistory} />
                    )}
                    {selectedCalc === 'estate' && (
                      <EstateCalc currency={preferences.currency} onSaveHistory={saveToHistory} />
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- HISTORY TAB ----------------- */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="font-black text-lg text-gray-850">Calculation Logs</h3>
                  <HistoryTab
                    history={history}
                    currency={preferences.currency}
                    onClearAll={clearHistory}
                    onDeleteItem={deleteHistoryItem}
                    onRestore={handleRestore}
                  />
                </div>
              )}

              {/* ----------------- PROFILE TAB ----------------- */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h3 className="font-black text-lg text-gray-850">User Preferences</h3>
                  <ProfileTab
                    preferences={preferences}
                    onUpdatePreferences={updatePreferences}
                    savedCalculationsCount={history.length}
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 🔹 STEP 3: FIXED BOTTOM NAVIGATION BAR */}
      {/* Dynamic theme bar conforming to the Elegant Vibrant Palette bottom bar configuration */}
      <footer className="fixed bottom-0 left-0 right-0 bg-app-card border-t border-app-border py-2 px-6 flex justify-between items-center select-none z-45 md:relative md:max-w-5xl md:mx-auto md:bg-app-card md:border md:rounded-3xl md:py-4 md:-mt-2 md:shadow-sm md:mb-6 transition-colors duration-255">
        
        {/* Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            setShowNotifications(false);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer",
            activeTab === 'home' ? "text-[#4F46E5] dark:text-[#FACC15] font-bold scale-102" : "text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#FACC15]"
          )}
        >
          <Home className="w-6 h-6 animate-none" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Home</span>
        </button>

        {/* Tools */}
        <button
          onClick={() => {
            setActiveTab('tools');
            setShowNotifications(false);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer",
            activeTab === 'tools' ? "text-[#4F46E5] dark:text-[#FACC15] font-bold scale-102" : "text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#FACC15]"
          )}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Tools</span>
        </button>

        {/* Calculate - Central Elevated Floating Button */}
        <button
          onClick={() => {
            setActiveTab('calculate');
            setShowNotifications(false);
          }}
          className="flex flex-col items-center justify-center cursor-pointer select-none group relative"
        >
          <div className={cn(
            "-mt-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 bg-app-card border-app-card ring-2 ring-app-border/20 transition-all duration-300",
            activeTab === 'calculate'
              ? "bg-[#4F46E5] text-white dark:bg-[#FACC15] dark:text-[#000000] scale-105"
              : "bg-[#64748B] dark:bg-[#A1A1AA] text-white dark:text-[#000000] hover:bg-[#4F46E5] hover:text-white dark:hover:bg-[#FACC15] dark:hover:text-[#000000] group-hover:scale-105"
          )}>
            <Calculator className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-wider mt-1 transition-colors duration-200",
            activeTab === 'calculate' ? "text-[#4F46E5] dark:text-[#FACC15]" : "text-[#64748B] dark:text-[#A1A1AA] group-hover:text-app-text"
          )}>
            Calc
          </span>
         </button>

        {/* History */}
        <button
          onClick={() => {
            setActiveTab('history');
            setShowNotifications(false);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer relative",
            activeTab === 'history' ? "text-[#4F46E5] dark:text-[#FACC15] font-bold scale-102" : "text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#FACC15]"
          )}
        >
          <Clock className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">History</span>
          {history.length > 0 && (
            <span className="absolute top-1.5 right-2 bg-red-500 w-2 h-2 rounded-full border border-app-card"></span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => {
            setActiveTab('profile');
            setShowNotifications(false);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer",
            activeTab === 'profile' ? "text-[#4F46E5] dark:text-[#FACC15] font-bold scale-102" : "text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#FACC15]"
          )}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Profile</span>
        </button>

      </footer>

    </div>
  );
}
