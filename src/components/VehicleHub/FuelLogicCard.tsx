import React, { useState } from 'react';
import { Fuel, Zap } from 'lucide-react';

interface FuelLogicCardProps {
  fuelPrice: string;
  setFuelPrice: (val: string) => void;
}

export default function FuelLogicCard({ fuelPrice, setFuelPrice }: FuelLogicCardProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div className="premium-card rounded-[25px] p-6 space-y-6" id="fuel-logic-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <Fuel className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Fuel Protocol</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Fuel Price (₹/L)</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa3c7] font-bold">₹</span>
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
              className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-10 pr-4 text-sm font-bold outline-none border transition-all font-mono ${
                hasInteracted && !fuelPrice ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-blue-500/50'
              }`}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start gap-3">
            <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-wider leading-relaxed">
                Rates are indexed to regional averages. Delta influences trip projections.
            </p>
        </div>
      </div>
    </div>
  );
}
