import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Card from '../components/Card';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp, HandCoins } from 'lucide-react';
import { triggerHaptic } from '../lib/haptic';

export default function Dashboard() {
  const [historyItems, setHistoryItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("history") || "[]");
      setHistoryItems(items);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const recentItems = [...historyItems].slice(0, 5).reverse();
  const chartData = recentItems.length > 0 
    ? recentItems.map((item, index) => {
        const val = parseFloat(item.value);
        return {
          name: `${item.type.split(' ')[0]} #${recentItems.length - index}`,
          value: isNaN(val) ? 0 : Number(val.toFixed(2))
        };
      })
    : [
        { name: 'Jan', value: 10 },
        { name: 'Feb', value: 25 },
        { name: 'Mar', value: 20 },
        { name: 'Apr', value: 40 },
        { name: 'May', value: 60 }
      ];

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      
      {/* 🔥 HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="glass p-6 relative overflow-hidden rounded-[22px] border border-white/8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            💎 Pro Active
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1.5">Hello 👋</h2>
          <p className="text-sm text-gray-300 font-medium">Welcome to SmartCalc Pro</p>
        </div>
      </motion.div>

      {/* 📊 CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Monthly Growth
            </h3>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-lg border border-indigo-500/10">
              🚀 +20% Inc
            </span>
          </div>

          <div className="h-44 w-full pr-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  dy={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 600
                  }} 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* 📈 KPI ROW */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          onClick={() => triggerHaptic('light')}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-2xl flex flex-col justify-between border border-white/5 bg-white/3 cursor-pointer"
        >
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" /> Growth
          </span>
          <h3 className="text-xl font-black text-indigo-400 mt-2">+20%</h3>
        </motion.div>

        <motion.div 
          onClick={() => triggerHaptic('light')}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="glass p-4 rounded-2xl flex flex-col justify-between border border-white/5 bg-white/3 cursor-pointer"
        >
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1">
            <HandCoins className="w-3 h-3 text-emerald-400" /> Savings
          </span>
          <h3 className="text-xl font-black text-emerald-400 mt-2">₹80K</h3>
        </motion.div>
      </div>

      {/* 🚀 QUICK */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="w-full"
      >
        <Link 
          to="/tools" 
          onClick={() => triggerHaptic('light')}
          className="glass flex items-center justify-between p-5 border border-white/6 hover:border-blue-500/20 bg-gradient-to-r from-slate-900/40 to-blue-950/20 group cursor-pointer transition-all duration-300 block"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🚀</div>
              <div className="text-left">
                <h3 className="font-extrabold text-[#e6ecff] group-hover:text-blue-400 transition-colors text-sm">Open Tools</h3>
                <p className="text-xs text-gray-400">Launch operational calculators</p>
              </div>
            </div>
            <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 🧠 INSIGHT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass p-4 rounded-2xl border border-blue-500/10 bg-blue-500/5 flex items-start gap-3"
      >
        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10 flex-shrink-0 animate-pulse">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-[10px] text-blue-400 uppercase font-black tracking-wider">AI Insight</span>
          <h4 className="text-xs font-bold text-[#e6ecff] mt-0.5">Save ₹5,000 this month 💡</h4>
        </div>
      </motion.div>

    </div>
  );
}
