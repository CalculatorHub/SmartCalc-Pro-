import React, { useState } from 'react';
import { Fuel, IndianRupee, Zap } from 'lucide-react';

interface FuelLogicCardProps {
  fuelPrice: string;
  setFuelPrice: (val: string) => void;
}

export default function FuelLogicCard({ fuelPrice, setFuelPrice }: FuelLogicCardProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-4" id="fuel-logic-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <Fuel className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">Fuel Logic</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Current Fuel Price (₹)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
            <input
              type="number"
              value={fuelPrice}
              onBlur={() => setHasInteracted(true)}
              onChange={(e) => {
                const val = e.target.value;
                if (parseFloat(val) < 0) return;
                setFuelPrice(val);
              }}
              autoComplete="off"
              className={`w-full h-12 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border transition-all ${
                hasInteracted && !fuelPrice ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
              }`}
              placeholder="Enter fuel price"
            />
          </div>
          {hasInteracted && !fuelPrice && (
            <p className="text-[10px] font-bold text-red-500">Please enter fuel price</p>
          )}
        </div>

        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
            <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider leading-relaxed">
                Fuel rates are indexed locally. This value affects total trip estimation cost.
            </p>
        </div>
      </div>
    </div>
  );
}
