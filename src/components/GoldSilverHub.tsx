import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coins, 
  TrendingUp, 
  ChevronRight, 
  Calculator, 
  Share2, 
  Info,
  Layers,
  Sparkles
} from "lucide-react";

type AssetType = "gold" | "silver";

export default function GoldSilverHub() {
  const [type, setType] = useState<AssetType>("gold");
  const [weight, setWeight] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [makingCharge, setMakingCharge] = useState<string>("");

  const calculateValue = () => {
    const w = parseFloat(weight) || 0;
    const r = parseFloat(rate) || 0;
    const mc = parseFloat(makingCharge) || 0;
    
    if (type === "gold") {
      return w * r + (w * r * (mc / 100));
    }
    return w * r;
  };

  const estimatedValue = calculateValue();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 pb-32 max-w-md mx-auto space-y-6"
      id="gold-silver-hub"
    >
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
          <div className={`p-2 rounded-xl text-white shadow-lg ${type === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
            {type === 'gold' ? <Coins className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Gold & Silver <span className="text-blue-500">Hub</span>
          </h1>
        </div>
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-none dark:text-white/60">
          Real-time Precise Valuation
        </p>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-xl shadow-orange-500/20 font-bold flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          View Market Rates
        </motion.button>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 blur-3xl pointer-events-none" />
      </motion.div>

      {/* ASSET TYPE TOGGLE */}
      <div className="flex bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-1.5 shadow-inner border border-white/10">
        <button
          onClick={() => setType("gold")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
            type === "gold"
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
              : "opacity-60 text-slate-600 dark:text-white"
          }`}
        >
          <Coins className="w-4 h-4" />
          GOLD
        </button>
        <button
          onClick={() => setType("silver")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
            type === "silver"
              ? "bg-gradient-to-r from-slate-400 to-slate-600 text-white shadow-lg"
              : "opacity-60 text-slate-600 dark:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          SILVER
        </button>
      </div>

      {/* VALUATION ENGINE */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-xl border border-white/20 space-y-6"
      >
        <div className="flex justify-between items-center text-slate-900 dark:text-white">
          <h2 className="font-black text-lg flex items-center gap-2">
            {type === "gold" ? "Gold Engine" : "Silver Engine"}
          </h2>
          <Info className="w-4 h-4 opacity-40" />
        </div>

        {/* INPUTS GRID */}
        <div className="grid gap-5">
          <Input 
            label="Weight (grams)" 
            value={weight} 
            onChange={setWeight} 
            placeholder="0.00"
            icon={<Layers className="w-4 h-4" />}
          />
          <Input 
            label="Current Rate (per gram)" 
            value={rate} 
            onChange={setRate} 
            placeholder="₹ 0.00"
            icon={<Coins className="w-4 h-4" />}
          />

          <AnimatePresence mode="popLayout">
            {type === "gold" && (
              <motion.div
                key="making-charge"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input 
                  label="Making Charge %" 
                  value={makingCharge} 
                  onChange={setMakingCharge} 
                  placeholder="0 %"
                  icon={<Sparkles className="w-4 h-4" />}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RESULT PANEL */}
        <motion.div 
          layout
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-2xl relative overflow-hidden"
        >
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 block">Estimated Value</span>
          <div className="text-3xl font-black">
            ₹ {estimatedValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-20 rotate-12">
            <Calculator className="w-24 h-24" />
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 text-white font-bold text-sm shadow-lg border border-white/5"
          >
            <Share2 className="w-4 h-4" />
            EXPORT
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm shadow-lg text-white ${type === 'gold' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-slate-600 to-slate-800'}`}
          >
            CALCULATE
          </motion.button>
        </div>
      </motion.div>

      {/* AI INTELLIGENCE FEED */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[1.5rem] p-5 bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-xl shadow-lg border border-blue-500/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <h3 className="font-bold text-xs uppercase tracking-widest text-blue-500">AI Market Feed</h3>
        </div>
        <p className="text-sm opacity-80 leading-relaxed font-medium text-slate-800 dark:text-slate-200">
          <span className="text-orange-500 font-bold">Gold:</span> 24k Bullish indicators detected. Resistance at 7,200/g. 
          <br />
          <span className="text-slate-400 font-bold">Silver:</span> Industrial demand surging. Periodic growth expected.
        </p>
      </motion.div>
    </motion.div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

function Input({ label, value, onChange, placeholder, icon }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-400 transition-colors">
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-semibold text-lg text-slate-950 dark:text-white"
        />
      </div>
    </div>
  );
}
