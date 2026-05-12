import React from 'react';
import { 
  ArrowUp, Lock, Wallet, Coins, Car, Landmark, Shield, TrendingUp, Home, Download, Clock, Fuel, Rocket, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import DownloadAppButton from './DownloadAppSection';

interface HomePageProps {
  onNavigate: (tab: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const cards = [
    {
      title: "Finance",
      desc: "EMI, SIP, Interest tools",
      icon: Wallet,
      tab: 'finance',
      color: 'from-blue-600 to-blue-500'
    },
    {
      title: "Metals",
      desc: "Gold & Silver rates",
      icon: TrendingUp,
      tab: 'gold',
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: "Vehicle",
      desc: "Fuel & maintenance",
      icon: Car,
      tab: 'vehicle',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: "Estate",
      desc: "Property calculations",
      icon: Home,
      tab: 'land',
      color: 'from-purple-500 to-purple-600'
    },
  ];

  const stats = [
    { label: "EMI", value: "₹12,450", sub: "This Month", icon: Wallet, color: "text-blue-500" },
    { label: "Gold", value: "₹6,245/g", sub: "+0.65%", icon: TrendingUp, color: "text-amber-500" },
    { label: "Fuel", value: "₹3,200", sub: "This Week", icon: Fuel, color: "text-emerald-500" },
  ];

  const recentActivity = [
    { label: "EMI Calculator", value: "₹12,450/month", icon: Wallet },
    { label: "Gold Calculator", value: "₹62,000", icon: Coins },
    { label: "Fuel Cost", value: "₹3,200", icon: Fuel },
  ];

  return (
    <div className="pb-32 pt-2 text-white" id="home-matrix">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight italic">Hello User 👋</h1>
          <p className="text-sm font-semibold text-gray-400 mt-0.5">
            Smart tools for smarter financial decisions.
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('admin')}
          className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl"
        >
          <Shield className="w-5 h-5 text-blue-400" />
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={14} className={item.color} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-xs font-black tracking-tight">{item.value}</p>
              <p className="text-[9px] font-bold text-emerald-400 mt-1">{item.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quote Section */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <p className="text-base font-bold leading-relaxed italic">
            “Small calculations today build big wealth tomorrow.”
          </p>
          <p className="text-[11px] font-semibold text-gray-400 mt-2 uppercase tracking-wide">
            Precision tools for your financial growth.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 mb-2">About CALHUB</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-start shadow-xl">
          <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/20">
            <Wallet size={18} className="text-blue-400" />
          </div>
          <p className="text-[11px] leading-relaxed text-gray-400 font-medium tracking-wide">
            CALHUB is your all-in-one financial calculator platform. 
            Easily calculate EMI, gold value, fuel costs, and property 
            estimates with speed, accuracy, and absolute privacy.
          </p>
        </div>
      </div>

      {/* Start Calculating CTA */}
      <div className="mb-8">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('finance')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Start Calculating
          </div>
          <ArrowRight size={18} />
        </motion.button>
      </div>

      {/* Quick Tools */}
      <div className="space-y-4 mb-8">
        <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Tool Matrix</h2>
        <div className="grid gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(card.tab)}
                className={`bg-gradient-to-r ${card.color} p-[1.5px] rounded-3xl cursor-pointer shadow-lg shadow-black/20`}
              >
                <div className="bg-[#020617] rounded-[calc(1.5rem-1.5px)] p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">{card.title}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="w-3 h-3" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Recent Activity</h2>
          </div>
          <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest">View All</button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
          {recentActivity.map((act, i) => {
            const ActIcon = act.icon;
            return (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <ActIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight">{act.label}</span>
                </div>
                <span className="text-[10px] font-black text-blue-400">
                  {act.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Install CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl border border-blue-600/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Install CALHUB App</h4>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Faster, smoother & works offline</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <DownloadAppButton />
        </div>
      </motion.section>

      {/* Footer Branding */}
      <div className="text-center pt-16 pb-8 space-y-2 opacity-30">
        <p className="text-[8px] font-black tracking-[0.5em] text-gray-500 uppercase italic">AES-256 Matrix Protocol v3.0</p>
      </div>
    </div>
  );
}


