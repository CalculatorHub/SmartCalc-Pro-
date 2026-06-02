import React, { useState } from 'react';
import { Ruler, Maximize, Target } from 'lucide-react';

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
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${unit === 'FEET' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
                FT
            </button>
            <button 
                onClick={() => setUnit('METERS')}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${unit === 'METERS' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
                M
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Length</label>
          <div className="relative">
             <input
                type="number"
                value={length}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, length: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setLength(val);
                }}
                className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                  hasInteracted.length && !length ? 'border-red-500/50' : 'border-white/5'
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8fa3c7]/40 uppercase font-mono">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em] px-1">Width</label>
          <div className="relative">
             <input
                type="number"
                value={width}
                placeholder="0.00"
                onBlur={() => setHasInteracted(prev => ({ ...prev, width: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setWidth(val);
                }}
                className={`w-full h-14 bg-white/5 text-white rounded-2xl px-4 text-sm font-bold focus:border-blue-500/50 outline-none border transition-all font-mono ${
                  hasInteracted.width && !width ? 'border-red-500/50' : 'border-white/5'
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#8fa3c7]/40 uppercase font-mono">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
