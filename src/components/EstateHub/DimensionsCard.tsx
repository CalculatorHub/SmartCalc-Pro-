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
    <div className="bg-white dark:bg-white/5 p-5 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-6" id="estate-dimensions-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                <Ruler className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">Dimensions</h3>
        </div>
        <div className="flex bg-gray-100 dark:bg-white/10 p-1 rounded-full border border-gray-200 dark:border-white/10">
            <button 
                onClick={() => setUnit('FEET')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${unit === 'FEET' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500'}`}
            >
                FEET
            </button>
            <button 
                onClick={() => setUnit('METERS')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${unit === 'METERS' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500'}`}
            >
                METERS
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Length</label>
          <div className="relative">
             <input
                type="number"
                value={length}
                placeholder="Enter length"
                onBlur={() => setHasInteracted(prev => ({ ...prev, length: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setLength(val);
                }}
                autoComplete="off"
                className={`w-full h-11 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none border transition-all ${
                  hasInteracted.length && !length ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 uppercase">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Width</label>
          <div className="relative">
             <input
                type="number"
                value={width}
                placeholder="Enter width"
                onBlur={() => setHasInteracted(prev => ({ ...prev, width: true }))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (parseFloat(val) < 0) return;
                  setWidth(val);
                }}
                autoComplete="off"
                className={`w-full h-11 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none border transition-all ${
                  hasInteracted.width && !width ? 'border-red-500/50 bg-red-50/50 dark:bg-red-500/5' : 'border-transparent dark:border-white/10'
                }`}
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 uppercase">{unit === 'FEET' ? 'ft' : 'm'}</span>
          </div>
        </div>
      </div>

      {( (hasInteracted.length && !length) || (hasInteracted.width && !width) ) && (
        <div className="text-[10px] font-bold text-red-500 bg-red-500/10 p-2 rounded-lg text-center font-sans tracking-wide">
          Please enter all required values
        </div>
      )}
    </div>
  );
}
