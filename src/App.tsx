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
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTab, CalculatorType, HistoryItem, NotificationItem, UserPreferences } from './types';
import { cn } from './utils';

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
  });

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

  // Active unread indicator count
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans text-gray-900 pb-20 md:pb-6 flex flex-col selection:bg-blue-100 selection:text-brand-primary">
      
      {/* 🔹 MAIN WRAPPER CONTAINER */}
      <div className="max-w-5xl w-full mx-auto p-4 md:p-6 flex-1 flex flex-col gap-6">
        
        {/* 🔹 STEP 1: TOP NAVIGATION HEADER BAR */}
        <header className="flex items-center justify-between bg-white px-6 py-4 md:px-8 md:py-5 rounded-3xl border border-gray-100 shadow-sm relative">
          
          {/* Welcome Text, matching Vibrant Palette header design */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-xs border border-gray-100 shrink-0">
              <img
                src="/src/assets/images/smart_finance_logo_1780875300350.png"
                alt="Smart Finance Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-indigo-650 tracking-widest leading-none mb-1">Smart Finance</p>
              <h2 className="text-sm font-bold text-gray-900 leading-tight md:text-base font-display">
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
                  "p-2.5 rounded-full text-gray-400 hover:text-gray-600 bg-white shadow-sm border border-gray-100 transition-all cursor-pointer relative",
                  showNotifications ? "bg-blue-50 border-blue-200 text-brand-primary" : ""
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
                "p-2.5 rounded-full text-gray-400 hover:text-gray-600 bg-white shadow-sm border border-gray-100 transition-all cursor-pointer flex items-center justify-center",
                activeTab === 'profile' ? "bg-blue-50 border-blue-200 text-brand-primary" : ""
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
                  <div className="relative overflow-hidden text-white bg-gradient-to-br from-brand-primary to-brand-secondary p-8 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between group min-h-48 transition-all duration-300">
                    {/* Abstract circles design elements decoration */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full translate-x-16 translate-y-16 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
                    <svg className="absolute bottom-[-15%] right-[-5%] w-60 h-60 text-white/15 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                    
                    <div className="space-y-2 z-10">
                      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
                        Plan Smart. Calculate Better.
                      </h2>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl font-normal">
                        All your financial and asset calculators unified in one powerful, highly responsive client dashboard.
                      </p>
                    </div>

                    <div className="z-10 pt-2 align-self-start">
                      <button
                        onClick={() => setActiveTab('tools')}
                        className="bg-white text-brand-primary font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        Explore Tools →
                      </button>
                    </div>
                  </div>

                  {/* TITLE BLOCKS SECTION */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 font-display">
                      Popular Tools
                    </h3>
                    <button
                      onClick={() => setActiveTab('tools')}
                      className="text-brand-primary font-semibold hover:underline cursor-pointer text-sm"
                    >
                      View All
                    </button>
                  </div>

                  {/* GRID OF 4 CARDS Matching Popular Tools grid from Design HTML */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* 1. Interest Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('interest')}
                      className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-transparent hover:border-indigo-100 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-650 group-hover:text-white">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 font-display text-sm">Interest Calculator</p>
                        <p className="text-xs text-gray-400">Simple & Compound modes</p>
                      </div>
                    </div>

                    {/* 2. Fuel Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('fuel')}
                      className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-transparent hover:border-orange-100 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 font-display text-sm">Fuel Efficiency</p>
                        <p className="text-xs text-gray-400">Trip & mileage costs</p>
                      </div>
                    </div>

                    {/* 3. Silver Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('silver')}
                      className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-slate-500 group-hover:text-white">
                        <Coins className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 font-display text-sm">Silver Purity</p>
                        <p className="text-xs text-gray-400">Simulate market rate</p>
                      </div>
                    </div>

                    {/* 4. Gold Calculator */}
                    <div
                      onClick={() => handleLaunchCalc('gold')}
                      className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-transparent hover:border-amber-100 flex flex-col justify-between h-40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 font-display text-sm">Gold Calculator</p>
                        <p className="text-xs text-gray-400">Simulate gold ratios</p>
                      </div>
                    </div>

                  </div>

                  {/* ESTATE CARD SECTION matching Real Estate Calculator from Design HTML */}
                  <div
                    onClick={() => handleLaunchCalc('estate')}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all group"
                  >
                    <div className="w-14 h-14 bg-blue-50 text-brand-primary rounded-2xl flex items-center justify-center shrink-0 shadow-3xs transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg font-display">Real Estate Calculator</p>
                      <p className="text-gray-500 text-sm">Mortgage EMI, local stamp duty taxes, and property affordability planner</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-300 transition-colors group-hover:text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* QUICK LOG RECORD BANNER */}
                  {history.length > 0 && (
                    <div className="bg-blue-50/40 border border-blue-100 p-5 rounded-3xl flex items-center justify-between text-xs font-semibold shadow-sm">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brand-primary shrink-0 animate-pulse" />
                        <span className="text-gray-600 text-sm">You have {history.length} calculated scenarios stored.</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('history')}
                        className="text-brand-primary hover:text-brand-secondary text-sm font-bold transition-all hover:underline cursor-pointer flex items-center gap-0.5"
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
                  <h3 className="font-black text-lg text-gray-800">Financial Catalogs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { type: 'interest', name: 'Interest Calculator', sub: 'Calculate standard linear (Simple) and exponential (Compound) periods.', col: 'indigo', ic: <Percent className="w-5 h-5" /> },
                      { type: 'fuel', name: 'Fuel & Commuting', sub: 'Log mileage, travel parameters, fuel prices boundaries, CO2 impact.', col: 'orange', ic: <Flame className="w-5 h-5" /> },
                      { type: 'gold', name: 'Gold Index Tracker', sub: 'Calculate real gold value by purities karats (24K, 22K) with making fee.', col: 'amber', ic: <Sparkles className="w-5 h-5" /> },
                      { type: 'silver', name: 'Silver Purity Tracker', sub: 'Calculate silver value matching fine, sterling or coin ratios.', col: 'slate', ic: <Coins className="w-5 h-5" /> },
                      { type: 'estate', name: 'Real Estate Master', sub: 'Plan mortgage EMIs, stamp duty taxation, and housing affordability thresholds.', col: 'indigo', ic: <Building className="w-5 h-5" /> },
                    ].map((t) => (
                      <div
                        key={t.type}
                        onClick={() => {
                          setSelectedCalc(t.type as CalculatorType);
                          setActiveTab('calculate');
                        }}
                        className="bg-white border border-gray-150/40 rounded-2xl p-5 hover:scale-101 hover:shadow-xs hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between text-xs h-44"
                      >
                        <div className="space-y-3.5">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-3xs",
                            t.col === 'emerald' && 'bg-emerald-50 text-emerald-600',
                            t.col === 'purple' && 'bg-purple-50 text-purple-600',
                            t.col === 'orange' && 'bg-orange-50 text-orange-600',
                            t.col === 'amber' && 'bg-amber-50 text-amber-600',
                            t.col === 'slate' && 'bg-slate-50 text-slate-550',
                            t.col === 'indigo' && 'bg-indigo-50 text-indigo-650'
                          )}>
                            {t.ic}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-sm text-gray-800">{t.name}</h4>
                            <p className="text-gray-400 font-semibold leading-relaxed text-[11px]">{t.sub}</p>
                          </div>
                        </div>
                        <span className="text-indigo-600 font-extrabold flex items-center gap-1 hover:underline">
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
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-150/45 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
                    <span className="text-xs font-black text-gray-450 uppercase tracking-widest hidden sm:inline">Active Workspace:</span>
                    <div className="flex bg-gray-50/80 p-0.5 rounded-xl border border-gray-100/50 font-bold text-xs scrollbar-none overflow-x-auto">
                      {[
                        { id: 'interest', label: 'Interest' },
                        { id: 'fuel', label: 'Fuel' },
                        { id: 'gold', label: 'Gold' },
                        { id: 'silver', label: 'Silver' },
                        { id: 'estate', label: 'Estate' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedCalc(tab.id as CalculatorType)}
                          className={cn(
                            "px-3.5 py-2 rounded-lg transition-all cursor-pointer text-center",
                            selectedCalc === tab.id
                              ? "bg-white text-indigo-750 shadow-3xs"
                              : "text-gray-500 hover:text-gray-800"
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center select-none z-45 md:relative md:max-w-5xl md:mx-auto md:bg-white md:border md:rounded-3xl md:py-4 md:-mt-2 md:shadow-md md:mb-6">
        
        {/* Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            setShowNotifications(false);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer",
            activeTab === 'home' ? "text-brand-primary font-bold scale-102" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <Home className="w-6 h-6" />
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
            activeTab === 'tools' ? "text-brand-primary font-bold scale-102" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Tools</span>
        </button>

        {/* Calculate - Central High-Affordability elevated floating-style button */}
        <button
          onClick={() => {
            setActiveTab('calculate');
            setShowNotifications(false);
          }}
          className="flex flex-col items-center justify-center cursor-pointer select-none group relative"
        >
          <div className={cn(
            "-mt-10 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white ring-2 ring-gray-100/40 transition-all duration-300",
            activeTab === 'calculate'
              ? "bg-brand-primary scale-105"
              : "bg-gray-400 hover:bg-brand-primary group-hover:scale-105"
          )}>
            <Calculator className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-wider mt-1 transition-colors duration-200",
            activeTab === 'calculate' ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-700"
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
            activeTab === 'history' ? "text-brand-primary font-bold scale-102" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <Clock className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">History</span>
          {history.length > 0 && (
            <span className="absolute top-1.5 right-2 bg-brand-primary w-2 h-2 rounded-full border border-white"></span>
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
            activeTab === 'profile' ? "text-brand-primary font-bold scale-102" : "text-gray-400 hover:text-gray-700"
          )}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">Profile</span>
        </button>

      </footer>

    </div>
  );
}
