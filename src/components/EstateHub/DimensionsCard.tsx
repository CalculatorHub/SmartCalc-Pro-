import React, { useState } from 'react';
import { Ruler, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DimensionsCardProps {
  length: string;
  setLength: (val: string) => void;
  width: string;
  setWidth: (val: string) => void;
  unit: 'FEET' | 'METERS';
  setUnit: (unit: 'FEET' | 'METERS') => void;
}

export default function DimensionsCard({ length, setLength, width, setWidth, unit, setUnit }: DimensionsCardProps) {
  const [hasInteracted, setHasInteracted] = useState({ length: false, width: false });

  const isLengthInvalid = length !== '' && (isNaN(parseFloat(length)) || parseFloat(length) <= 0);
  const isWidthInvalid = width !== '' && (isNaN(parseFloat(width)) || parseFloat(width) <= 0);

  return (
    <div className="premium-card rounded-[22px] p-6 space-y-8" id="estate-dimensions-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic font-mono">Boundaries</h3>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 font-mono">
            <button 
                onClick={() => setUnit('FEET')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${unit === 'FEET' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
                FT
            </button>
            <button 
                onClick={() => setUnit('METERS')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${unit === 'METERS' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
                M
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Length</label>
          <div className="relative">
             <AnimatePresence>
                {isLengthInvalid && (
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
                    {/* Tiny decorative arrow pointing down to input box */}
                    <div className="absolute top-full left-5 -translate-y-1.5 w-3.5 h-3.5 flex items-center justify-center overflow-hidden pointer-events-none">
                      <div className="w-2 h-2 bg-red-950/90 border-r border-b border-red-500/40 rotate-45 transform origin-center" />
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>

             <input
                type="number"
                value={length}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, length: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  setLength(val);
                }}
                className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                  isLengthInvalid ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]' : (hasInteracted.length && !length ? 'border-red-500/50' : 'border-white/5')
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8fa3c7]/40 uppercase font-mono">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Width</label>
          <div className="relative">
             <AnimatePresence>
                {isWidthInvalid && (
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
                    {/* Tiny decorative arrow pointing down to input box */}
                    <div className="absolute top-full left-5 -translate-y-1.5 w-3.5 h-3.5 flex items-center justify-center overflow-hidden pointer-events-none">
                      <div className="w-2 h-2 bg-red-950/90 border-r border-b border-red-500/40 rotate-45 transform origin-center" />
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>

             <input
                type="number"
                value={width}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, width: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  setWidth(val);
                }}
                className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                  isWidthInvalid ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]' : (hasInteracted.width && !width ? 'border-red-500/50' : 'border-white/5')
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8fa3c7]/40 uppercase font-mono">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
