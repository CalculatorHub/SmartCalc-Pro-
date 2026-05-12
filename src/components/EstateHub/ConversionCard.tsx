import React from 'react';

const CONVERSIONS = [
  { label: 'Acre', val: '43,560 sq.ft / 4,047 sq.m' },
  { label: 'Hectare', val: '10,000 sq.m / 2.47 acres' },
  { label: 'Gunta', val: '1,089 sq.ft (Standard)' },
  { label: 'Cent', val: '435.6 sq.ft' },
];

export default function ConversionCard() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4" id="estate-conversion-card">
       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Reference Matrix</h4>
       <div className="space-y-3">
          {CONVERSIONS.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/50 dark:bg-gray-800/40 p-2.5 rounded-xl border border-white/50 dark:border-gray-700/50">
               <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider">{item.label}</span>
               <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 italic">{item.val}</span>
            </div>
          ))}
       </div>
    </div>
  );
}
