import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Maximize, 
  IndianRupee, 
  BookOpen, 
  MapPin, 
  Ruler,
  Home
} from "lucide-react";
import Card from "../../components/ui/MotionCard";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import InputUI from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { num } from "../../utils/helpers";

type AreaUnit = "sqft" | "sqm";

export default function EstateHub() {
  const [unit, setUnit] = useState<AreaUnit>("sqft");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const area = num(length) * num(width);
  const valuation = area * num(rate);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card3D className="relative overflow-hidden">
        <div className="flex items-center gap-4">
          <Icon3D icon={<Home className="w-6 h-6" />} color="from-pink-500 to-purple-600" />
          <div>
            <h1 className="text-xl font-bold dark:text-white italic tracking-tighter">
              Estate Hub
            </h1>
            <p className="text-sm dark:text-slate-400 font-medium opacity-60">
              Spatial Valuation Matrix
            </p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />
      </Card3D>

      {/* DIMENSIONS */}
      <Card3D className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            Spatial Matrix
          </h2>
          <Ruler className="w-4 h-4 opacity-40" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Length</label>
            <InputUI value={length} setValue={setLength} placeholder="0.00" type="number" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Width</label>
            <InputUI value={width} setValue={setWidth} placeholder="0.00" type="number" />
          </div>
        </div>

        {/* UNIT SELECTOR */}
        <div className="flex p-1 bg-slate-900/5 dark:bg-white/5 rounded-2xl border border-white/5">
          <button
            onClick={() => setUnit("sqft")}
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              unit === "sqft" 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" 
                : "opacity-50"
            }`}
          >
            SQ. FEET
          </button>
          <button
            onClick={() => setUnit("sqm")}
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
              unit === "sqm" 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg" 
                : "opacity-50"
            }`}
          >
            SQ. METER
          </button>
        </div>
      </Card3D>

      {/* VALUATION INPUT */}
      <Card3D className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
            Rate per {unit === 'sqft' ? 'Sq.Ft' : 'Sq.M'} (₹)
          </label>
          <InputUI value={rate} setValue={setRate} type="number" placeholder="₹ 0.00" />
        </div>

        <Button onClick={() => {}}>
           <span className="text-[10px]">EXECUTE EVALUATION</span>
        </Button>
      </Card3D>

      {/* RESULT DASHBOARD */}
      <div className="rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-purple-700 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Valuation Summary</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <span className="text-xs font-black uppercase tracking-widest opacity-70">Coverage</span>
              <div className="text-right">
                <span className="text-3xl font-black">{area.toLocaleString()}</span>
                <span className="text-xs font-bold opacity-50 ml-2 uppercase">{unit === "sqft" ? "FT²" : "M²"}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-black uppercase tracking-widest opacity-70 block mb-2">Estimated Value</span>
              <span className="text-5xl font-black tracking-tighter">
                ₹ {valuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <MapPin className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
      </div>

      {/* LEXICON DATA */}
      <Card3D className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-80">Unit Lexicon</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-500/5 border border-white/5">
            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Acre</span>
            <span className="text-xs font-black">43,560 SQ.FT</span>
          </div>
          <div className="flex justify-between items-center p-4 rounded-xl bg-slate-500/5 border border-white/5">
            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">Hectare</span>
            <span className="text-xs font-black">10,000 SQ.M</span>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
