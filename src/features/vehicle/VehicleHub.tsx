import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Fuel, 
  Navigation, 
  Zap, 
  MapPin, 
  ShieldCheck,
  RefreshCw,
  Gauge,
  Car
} from "lucide-react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import InputUI from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { num } from "../../utils/helpers";

type FuelType = "petrol" | "diesel";

export default function VehicleHub() {
  const [fuelType, setFuelType] = useState<FuelType>("petrol");
  const [distance, setDistance] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [fuelPrice, setFuelPrice] = useState<string>("109.04");
  const [syncing, setSyncing] = useState(false);

  const dNum = num(distance);
  const mNum = num(mileage);
  const pNum = num(fuelPrice);

  const litersNeeded = mNum > 0 ? dNum / mNum : 0;
  const totalCost = litersNeeded * pNum;
  const costPerKm = dNum > 0 ? totalCost / dNum : 0;

  const handleSyncPrice = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setFuelPrice((109.04 + (Math.random() * 2 - 1)).toFixed(2));
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card3D className="relative overflow-hidden">
        <div className="flex items-center gap-4">
          <Icon3D icon={<Car className="w-6 h-6" />} color="from-teal-400 to-cyan-600" />
          <div>
            <h1 className="text-xl font-bold dark:text-white italic tracking-tighter">
              Logistics Terminal
            </h1>
            <p className="text-sm dark:text-slate-400 font-medium opacity-60">
              AI Efficiency Tracking
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Operational</span>
          </div>
          <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest leading-none">System Ready</div>
        </div>
      </Card3D>

      {/* FUEL MATRIX CONFIG */}
      <Card3D className="space-y-6">
        <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-cyan-500">
          Fuel Synthesis
        </h2>

        {/* FUEL TYPE TOGGLE */}
        <div className="flex p-1 bg-slate-900/5 dark:bg-white/5 rounded-2xl shadow-inner border border-white/5">
          <button
            onClick={() => setFuelType("petrol")}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              fuelType === "petrol" 
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "opacity-40"
            }`}
          >
            PETROL
          </button>
          <button
            onClick={() => setFuelType("diesel")}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              fuelType === "diesel" 
                ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg" 
                : "opacity-40"
            }`}
          >
            DIESEL
          </button>
        </div>

        {/* PRICE LOCK */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Rate (₹/L)</label>
             <InputUI value={fuelPrice} setValue={setFuelPrice} type="number" />
          </div>
          <button 
            onClick={handleSyncPrice}
            disabled={syncing}
            className={`w-14 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center transition-all ${syncing ? 'animate-pulse opacity-50' : ''}`}
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </Card3D>

      {/* PERFORMANCE METRICS */}
      <Card3D className="space-y-6">
        <h2 className="font-black text-sm uppercase tracking-widest dark:text-white">Spatial Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white">Distance (km)</label>
            <InputUI value={distance} setValue={setDistance} type="number" placeholder="0" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white">Avg Mileage</label>
            <InputUI value={mileage} setValue={setMileage} type="number" placeholder="KM/L" />
          </div>
        </div>

        <Button onClick={() => {}}>
           <span className="flex items-center justify-center gap-2 text-[10px]">
            <Zap className="w-4 h-4" /> ARCHIVE LOGISTICS DATA
          </span>
        </Button>
      </Card3D>

      {/* EXPENDITURE ANALYSIS */}
      <div className="rounded-[2.5rem] p-8 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-blue-700 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 block">Total Expenditure</span>
            <div className="text-5xl font-black tracking-tighter">
              ₹ {totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] font-black opacity-60 mt-3 flex items-center gap-2 uppercase tracking-widest">
              <Fuel className="w-3 h-3" />
              {litersNeeded.toFixed(2)} Liters Required
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Cost / KM</div>
              <div className="text-xl font-bold">₹ {costPerKm.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Efficiency</div>
              <div className="text-xl font-bold">{mileage || 0} km/L</div>
            </div>
          </div>
        </div>

        <Gauge className="absolute top-1/2 -right-8 -translate-y-1/2 w-48 h-48 opacity-10 rotate-12" />
      </div>
    </div>
  );
}
