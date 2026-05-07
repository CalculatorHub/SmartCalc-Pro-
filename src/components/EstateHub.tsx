import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Maximize, 
  IndianRupee, 
  BookOpen, 
  Archive, 
  MapPin, 
  Info,
  Ruler
} from "lucide-react";

type AreaUnit = "sqft" | "sqm";

export default function EstateHub() {
  const [unit, setUnit] = useState<AreaUnit>("sqft");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const lNum = parseFloat(length) || 0;
  const wNum = parseFloat(width) || 0;
  const rNum = parseFloat(rate) || 0;

  const area = lNum * wNum;
  const valuation = area * rNum;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 pb-32 max-w-md mx-auto space-y-6"
      id="estate-hub"
    >
      {/* HEADER */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="relative rounded-[2.5rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/20 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
          <div className="p-2.5 rounded-2xl text-white shadow-lg bg-gradient-to-br from-pink-500 to-purple-600">
            <Maximize className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Estate <span className="text-purple-500">Hub</span>
          </h1>
        </div>
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-none dark:text-white/60">
          Precision Spatial Valuation
        </p>

        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />
      </motion.div>

      {/* DIMENSIONS GRID */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-xl border border-white/20 space-y-6"
      >
        <div className="flex justify-between items-center text-slate-900 dark:text-white">
          <h2 className="font-black text-lg flex items-center gap-2">
            Spatial Matrix
          </h2>
          <Ruler className="w-4 h-4 opacity-40" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Length" 
            value={length} 
            onChange={setLength} 
            placeholder="0.00"
          />
          <Input 
            label="Width" 
            value={width} 
            onChange={setWidth} 
            placeholder="0.00"
          />
        </div>

        {/* UNIT SELECTOR */}
        <div className="flex p-1.5 bg-slate-900/5 dark:bg-white/5 rounded-2xl border border-slate-900/5 dark:border-white/5">
          <button
            onClick={() => setUnit("sqft")}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${
              unit === "sqft" 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" 
                : "opacity-50 text-slate-600 dark:text-white"
            }`}
          >
            SQUARE FEET
          </button>
          <button
            onClick={() => setUnit("sqm")}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${
              unit === "sqm" 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" 
                : "opacity-50 text-slate-600 dark:text-white"
            }`}
          >
            SQUARE METER
          </button>
        </div>
      </motion.div>

      {/* VALUATION INPUT */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-xl border border-white/20 space-y-6"
      >
        <h2 className="font-black text-lg text-slate-900 dark:text-white">Valuation Signal</h2>
        <Input 
          label={`Rate per ${unit === 'sqft' ? 'Sq.Ft' : 'Sq.M'} (₹)`}
          value={rate} 
          onChange={setRate} 
          placeholder="₹ 0.00"
          icon={<IndianRupee className="w-4 h-4" />}
        />

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Archive className="w-4 h-4" />
          ARCHIVE EVALUATION
        </motion.button>
      </motion.div>

      {/* RESULT DASHBOARD */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-700 text-white shadow-2xl space-y-6 overflow-hidden relative"
      >
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Valuation Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <span className="text-sm font-medium opacity-70">Coverage</span>
              <div className="text-right">
                <span className="text-2xl font-bold">{area.toLocaleString()}</span>
                <span className="text-xs font-bold opacity-50 ml-1">{unit === "sqft" ? "FT²" : "M²"}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-sm font-medium opacity-70 block mb-1">Estimated Value</span>
              <span className="text-4xl font-black tracking-tighter">
                ₹ {valuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Background icon */}
        <MapPin className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
      </motion.div>

      {/* LEXICON DATA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="rounded-[1.5rem] p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <h3 className="font-bold text-xs uppercase tracking-widest opacity-80">Unit Lexicon</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <LexiconItem label="Acre" value="43,560 SQ.FT" />
          <LexiconItem label="Hectare" value="10,000 SQ.M" />
          <LexiconItem label="Cent" value="435.6 SQ.FT" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function LexiconItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-500/5">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-xs font-black text-slate-800 dark:text-slate-200">{value}</span>
    </div>
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
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold text-slate-950 dark:text-white`}
        />
      </div>
    </div>
  );
}
