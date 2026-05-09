import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coins, 
  TrendingUp, 
  Calculator, 
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import InputUI from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { num } from "../../utils/helpers";

type AssetType = "gold" | "silver";

export default function GoldSilverHub() {
  const [type, setType] = useState<AssetType>("gold");
  const [weight, setWeight] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [makingCharge, setMakingCharge] = useState<string>("");

  const calculateValue = () => {
    const w = num(weight);
    const r = num(rate);
    const mc = num(makingCharge);
    
    if (type === "gold") {
      return w * r + (w * r * (mc / 100));
    }
    return w * r;
  };

  const estimatedValue = calculateValue();

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <Card3D className="relative overflow-hidden">
        <div className="flex items-center gap-4">
          <Icon3D icon={type === "gold" ? <Coins className="w-6 h-6" /> : <Layers className="w-6 h-6" />} color={type === 'gold' ? 'from-yellow-400 to-orange-500' : 'from-slate-400 to-slate-600'} />
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white italic tracking-tighter">
              Gold & Silver Hub
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium opacity-60">
              Precise Metal Valuation
            </p>
          </div>
        </div>
      </Card3D>

      {/* ASSET TYPE TOGGLE */}
      <div className="flex bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-1.5 shadow-inner border border-white/10">
        <button
          onClick={() => setType("gold")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
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
      <Card3D className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            {type === "gold" ? "Gold Engine" : "Silver Engine"}
          </h2>
          <Info className="w-4 h-4 opacity-40" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Weight (grams)</label>
            <InputUI value={weight} setValue={setWeight} type="number" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Current Rate (per gram)</label>
            <InputUI value={rate} setValue={setRate} type="number" placeholder="₹ 0.00" />
          </div>

          <AnimatePresence mode="popLayout">
            {type === "gold" && (
              <motion.div
                key="making-charge"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Making Charge %</label>
                <InputUI value={makingCharge} setValue={setMakingCharge} type="number" placeholder="0 %" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl relative overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 block">Estimated Value</span>
          <div className="text-3xl font-black">
            ₹ {estimatedValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-20 rotate-12">
            <Calculator className="w-24 h-24" />
          </div>
        </div>

        <Button onClick={() => {}}>
          <span className="text-[10px]">EXECUTE VALUATION</span>
        </Button>
      </Card3D>

      {/* AI INTELLIGENCE FEED */}
      <div className="rounded-[1.5rem] p-5 bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-xl border border-blue-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-blue-500">AI Market Feed</h3>
        </div>
        <p className="text-sm opacity-80 font-medium text-slate-800 dark:text-slate-200">
          <span className="text-orange-500 font-bold">Gold:</span> 24k Bullish indicators detected. 
          <br />
          <span className="text-slate-400 font-bold">Silver:</span> Industrial demand surging.
        </p>
      </div>
    </div>
  );
}
