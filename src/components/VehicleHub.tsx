import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Fuel, 
  Navigation, 
  Zap, 
  Download, 
  Share2, 
  MapPin, 
  ShieldCheck,
  RefreshCw,
  Gauge
} from "lucide-react";

type FuelType = "petrol" | "diesel";

export default function VehicleHub() {
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [distance, setDistance] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [fuelPrice, setFuelPrice] = useState<number>(109.04);
  const [syncing, setSyncing] = useState(false);

  const dNum = parseFloat(distance) || 0;
  const mNum = parseFloat(mileage) || 0;

  const litersNeeded = mNum > 0 ? dNum / mNum : 0;
  const totalCost = litersNeeded * fuelPrice;
  const costPerKm = dNum > 0 ? totalCost / dNum : 0;

  const handleSyncPrice = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setFuelPrice(109.04 + (Math.random() * 2 - 1));
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 pb-32 max-w-md mx-auto space-y-6"
      id="vehicle-hub"
    >
      {/* HEADER */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="relative rounded-[2.5rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/20 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
          <div className="p-2.5 rounded-2xl text-white shadow-lg bg-gradient-to-br from-teal-400 to-cyan-600">
            <Navigation className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Logistics <span className="text-cyan-500">Terminal</span>
          </h1>
        </div>
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-none dark:text-white/60">
          Fuel Efficiency Matrix
        </p>

        {/* Status Indicator */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Operational</span>
          </div>
          <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest">System Ready</div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />
      </motion.div>

      {/* FUEL MATRIX CONFIG */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-xl border border-white/20 space-y-6"
      >
        <div className="flex justify-between items-center text-slate-900 dark:text-white">
          <h2 className="font-black text-lg flex items-center gap-2 text-cyan-500">
            Fuel Synthesis
          </h2>
          <Fuel className="w-4 h-4 opacity-40" />
        </div>

        <Input 
          label="Location" 
          type="text"
          placeholder="ENTER CITY" 
          icon={<MapPin className="w-4 h-4" />}
        />

        {/* FUEL TYPE TOGGLE */}
        <div className="flex p-1.5 bg-slate-900/5 dark:bg-white/5 rounded-2xl border border-slate-900/5 dark:border-white/5 shadow-inner">
          <button
            onClick={() => setFuelType("petrol")}
            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-300 ${
              fuelType === "petrol" 
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "opacity-40 text-slate-600 dark:text-white"
            }`}
          >
            PETROL
          </button>
          <button
            onClick={() => setFuelType("diesel")}
            className={`flex-1 py-3 rounded-xl font-black text-xs transition-all duration-300 ${
              fuelType === "diesel" 
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "opacity-40 text-slate-600 dark:text-white"
            }`}
          >
            DIESEL
          </button>
        </div>

        {/* PRICE LOCK */}
        <div className="flex gap-3 items-end">
          <Input 
            label="Rate per Liter (₹)" 
            value={fuelPrice.toString()} 
            onChange={(v) => setFuelPrice(parseFloat(v) || 0)}
            placeholder="0.00"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSyncPrice}
            disabled={syncing}
            className={`h-[52px] px-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center transition-all ${syncing ? 'animate-pulse opacity-50' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* PERFORMANCE METRICS */}
      <motion.div 
        layout
        className="rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-xl border border-white/20 space-y-6"
      >
        <h2 className="font-black text-lg text-slate-900 dark:text-white">Spatial Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Distance (km)" 
            value={distance} 
            onChange={setDistance} 
            placeholder="0.00"
            icon={<Navigation className="w-4 h-4" />}
          />
          <Input 
            label="Avg Mileage" 
            value={mileage} 
            onChange={setMileage} 
            placeholder="Km/L"
            icon={<Gauge className="w-4 h-4" />}
          />
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          ARCHIVE LOGISTICS DATA
        </motion.button>
      </motion.div>

      {/* EXPENDITURE ANALYSIS */}
      <motion.div 
        layout
        className="rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-blue-700 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 space-y-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">Total Expenditure</span>
            <div className="text-5xl font-black tracking-tighter">
              ₹ {totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs font-bold opacity-60 mt-2 flex items-center gap-2">
              <Fuel className="w-3 h-3" />
              {litersNeeded.toFixed(2)} LITERS REQUIRED
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Cost / KM" value={`₹ ${costPerKm.toFixed(2)}`} />
            <StatCard label="Efficiency" value={`${mileage || 0} km/L`} />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button whileTap={{ scale: 0.9 }} className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all">
              <Download className="w-4 h-4" />
              DOWNLOAD
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all">
              <Share2 className="w-4 h-4" />
              TELEPORT
            </motion.button>
          </div>
        </div>

        {/* Decor */}
        <Gauge className="absolute top-1/2 -right-8 -translate-y-1/2 w-48 h-48 opacity-10 rotate-12" />
      </motion.div>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}

interface InputProps {
  label: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
}

function Input({ label, value, onChange, placeholder, icon, type = "number" }: InputProps) {
  return (
    <div className="space-y-1.5 flex-1 w-full">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
          {icon || <span className="text-[10px] font-black">₹</span>}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold text-slate-950 dark:text-white"
        />
      </div>
    </div>
  );
}
