import React, { useState } from 'react';
import { IndianRupee, RefreshCw, Archive } from 'lucide-react';

interface ValuationCardProps {
  rate: string;
  setRate: (val: string) => void;
  rateUnit: string;
  setRateUnit: (val: string) => void;
  onReset: () => void;
}

export default function ValuationCard({ rate, setRate, rateUnit, setRateUnit, onReset }: ValuationCardProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div className="premium-card rounded-[22px] p-6 space-y-8" id="estate-valuation-card">
      <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-blue-500" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic font-mono">Valuation Protocol</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Rate / Unit</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa3c7] font-bold">₹</span>
                    <input
                        type="number"
                        value={rate}
                        placeholder="0.00"
                        onBlur={() => setHasInteracted(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (parseFloat(val) < 0) return;
                          setRate(val);
                        }}
                        className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-10 pr-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                          hasInteracted && !rate ? 'border-red-500/50' : 'border-white/5'
                        }`}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Metric</label>
                <select 
                    value={rateUnit}
                    onChange={(e) => setRateUnit(e.target.value)}
                    className="w-full h-14 bg-white/5 text-white border border-white/5 rounded-2xl px-4 text-[10px] font-black appearance-none cursor-pointer focus:border-blue-500/50 font-mono"
                >
                    <option value="SQ.FT">SQ.FT</option>
                    <option value="SQ.M">SQ.M</option>
                </select>
            </div>
        </div>

        <div className="flex gap-4">
             <button 
                onClick={() => {
                  onReset();
                  setHasInteracted(false);
                }}
                className="flex-1 h-14 bg-white/5 text-[#8fa3c7] text-[10px] font-black rounded-[18px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-white/5 transition-all hover:bg-white/10 font-mono"
             >
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                Reset
             </button>
             <button className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black rounded-[18px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 font-mono">
                <Archive className="w-4 h-4" />
                Archive
             </button>
        </div>
      </div>
    </div>
  );
}
