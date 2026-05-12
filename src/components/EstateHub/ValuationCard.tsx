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
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-6" id="estate-valuation-card">
      <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600">
              <IndianRupee className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">Valuation Logic</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate (Price)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input
                        type="number"
                        value={rate}
                        placeholder="Enter rate per unit"
                        onBlur={() => setHasInteracted(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (parseFloat(val) < 0) return;
                          setRate(val);
                        }}
                        autoComplete="off"
                        className={`w-full h-11 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border transition-all ${
                          hasInteracted && !rate ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                        }`}
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Per Unit</label>
                <select 
                    value={rateUnit}
                    onChange={(e) => setRateUnit(e.target.value)}
                    className="w-full h-11 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border border-transparent dark:border-white/10 rounded-xl px-2 text-[10px] font-black appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                    <option value="SQ.FT">SQ.FT</option>
                    <option value="SQ.M">SQ.M</option>
                </select>
            </div>
        </div>

        {hasInteracted && !rate && (
          <div className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center">
            Please enter all required values
          </div>
        )}

        <div className="flex gap-3">
             <button 
                onClick={() => {
                  onReset();
                  setHasInteracted(false);
                }}
                className="flex-1 h-11 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] font-black rounded-xl uppercase flex items-center justify-center gap-2 transition-colors hover:bg-gray-200 dark:hover:bg-white/20"
             >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
             </button>
             <button className="flex-1 h-11 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                <Archive className="w-3.5 h-3.5" />
                Archive
             </button>
        </div>
      </div>
    </div>
  );
}
