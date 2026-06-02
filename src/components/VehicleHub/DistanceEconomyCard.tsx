import React, { useState } from 'react';
import { Route, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DistanceEconomyCardProps {
  distance: string;
  setDistance: (val: string) => void;
  mileage: string;
  setMileage: (val: string) => void;
}

export default function DistanceEconomyCard({ distance, setDistance, mileage, setMileage }: DistanceEconomyCardProps) {
  const [hasInteracted, setHasInteracted] = useState({ distance: false, mileage: false });

  return (
    <div className="premium-card rounded-[25px] p-6 space-y-6" id="distance-economy-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-xl">
          <Route className="w-5 h-5 text-emerald-500" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Logistics Hub</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Distance (KM)</label>
          <div className="relative">
             <Route className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa3c7]" />
             <input
                type="number"
                value={distance}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, distance: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setDistance(val);
                }}
                autoComplete="off"
                className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-12 pr-4 text-sm font-bold outline-none border transition-all font-mono ${
                  hasInteracted.distance && !distance ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-emerald-500/50'
                }`}
             />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Avg. Mileage (KMPL)</label>
          <div className="relative">
             <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa3c7]" />
             <input
                type="number"
                value={mileage}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, mileage: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setMileage(val);
                }}
                autoComplete="off"
                className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-12 pr-4 text-sm font-bold outline-none border transition-all font-mono ${
                  hasInteracted.mileage && (parseFloat(mileage) <= 0 || !mileage) ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-emerald-500/50'
                }`}
             />
             <AnimatePresence mode="wait">
               {hasInteracted.mileage && (parseFloat(mileage) <= 0 || !mileage) && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="absolute -top-6 right-0 bg-red-500 text-white px-2 py-0.5 rounded shadow-lg z-10"
                 >
                   <span className="text-[8px] font-black uppercase tracking-tighter">
                     {!mileage ? "Required" : parseFloat(mileage) === 0 ? "Zero Error" : "Invalid"}
                   </span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
