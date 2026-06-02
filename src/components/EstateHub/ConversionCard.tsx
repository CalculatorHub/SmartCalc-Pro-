import React from 'react';

const CONVERSIONS = [
  { label: 'Acre', val: '43,560 sq.ft / 4,047 sq.m' },
  { label: 'Hectare', val: '10,000 sq.m / 2.47 acres' },
  { label: 'Gunta', val: '1,089 sq.ft (Standard)' },
  { label: 'Cent', val: '435.6 sq.ft' },
];

export default function ConversionCard() {
  return (
    <div className="premium-card rounded-[22px] p-6 space-y-6" id="estate-conversion-card">
       <h4 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.3em] px-1 italic">Knowledge Matrix</h4>
       <div className="space-y-3">
          {CONVERSIONS.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 font-mono group hover:bg-white/10 transition-colors">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
               <span className="text-[9px] font-bold text-[#8fa3c7] italic">{item.val}</span>
            </div>
          ))}
       </div>
    </div>
  );
}
