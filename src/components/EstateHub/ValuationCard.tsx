import React, { useState } from 'react';
import { IndianRupee, RefreshCw, Archive, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValuationCardProps {
  rate: string;
  setRate: (val: string) => void;
  rateUnit: string;
  setRateUnit: (val: string) => void;
  onReset: () => void;
  onArchive: () => void;
  archiveSaved?: boolean;
}

export default function ValuationCard({ rate, setRate, rateUnit, setRateUnit, onReset, onArchive, archiveSaved }: ValuationCardProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const isRateInvalid = rate !== '' && (isNaN(parseFloat(rate)) || parseFloat(rate) <= 0);

  return (
    <div className="premium-card rounded-[22px] p-6 space-y-8" id="estate-valuation-card">
      <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-blue-500" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic font-mono">Valuation Protocol</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2 relative">
                <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Rate / Unit</label>
                <div className="relative">
                    <AnimatePresence>
                        {isRateInvalid && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute z-30 bottom-full mb-3 left-0 right-0 p-3 bg-red-950/90 backdrop-blur-md border border-red-500/40 rounded-xl shadow-glow text-red-200"
                          >
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              <span className="text-[9px] font-black uppercase tracking-wider font-mono">Must be &gt; 0</span>
                            </div>
                            <div className="absolute top-full left-5 -translate-y-1.5 w-3.5 h-3.5 flex items-center justify-center overflow-hidden pointer-events-none">
                              <div className="w-2 h-2 bg-red-950/90 border-r border-b border-red-500/40 rotate-45 transform origin-center" />
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa3c7] font-bold">₹</span>
                    <input
                        type="number"
                        value={rate}
                        placeholder="0.00"
                        onBlur={() => setHasInteracted(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRate(val);
                        }}
                        className={`w-full h-14 bg-white/5 text-white rounded-2xl pl-10 pr-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                          isRateInvalid ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]' : (hasInteracted && !rate ? 'border-red-500/50' : 'border-white/5')
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
             <button 
                onClick={onArchive}
                className={`flex-1 h-14 text-[10px] font-black rounded-[18px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 font-mono transition-all active:scale-95 cursor-pointer shadow-lg ${
                  archiveSaved
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-emerald-500/10'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] text-white shadow-blue-500/20'
                }`}
             >
                <Archive className="w-4 h-4" />
                {archiveSaved ? 'Archived ✓' : 'Archive'}
             </button>
        </div>
      </div>
    </div>
  );
}
