import React from 'react';

export default function EstimationCard({ area, totalPrice, unit }: { area: number; totalPrice: number; unit: string }) {
  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 space-y-6" id="estate-estimation-card">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Est. Valuation</h3>
        <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
            ₹{totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
           <div className="space-y-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Total Coverage</span>
              <span className="text-base font-black text-gray-900 dark:text-white italic">{area.toLocaleString()} {unit}</span>
           </div>
           <div className="h-10 w-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">100%</span>
           </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase px-1">
                <span>Value Index</span>
                <span className="text-emerald-500">Normal</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-emerald-500 rounded-full" />
            </div>
        </div>
      </div>
    </div>
  );
}
