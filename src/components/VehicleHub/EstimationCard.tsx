import React from 'react';
import { IndianRupee, MapPin, Droplets, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { formatIndianCurrency } from '../../lib/financeUtils';

interface EstimationCardProps {
  distance: number;
  mileage: number;
  fuelPrice: number;
}

export default function EstimationCard({ distance, mileage, fuelPrice }: EstimationCardProps) {
  const fuelNeeded = mileage > 0 ? distance / mileage : 0;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerKm = distance > 0 ? totalCost / distance : 0;

  const stats = [
    { label: 'Fuel Needed', value: `${fuelNeeded.toFixed(2)} L`, icon: <Droplets className="w-4 h-4 text-blue-500" /> },
    { label: 'Cost / KM', value: formatIndianCurrency(costPerKm, 2), icon: <Target className="w-4 h-4 text-emerald-500" /> },
  ];

  return (
    <div className="premium-card p-8 rounded-[25px] flex flex-col items-center text-center space-y-8" id="vehicle-estimation-card">
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em]">Estimated Trip Cost</h3>
        <div className="flex items-center justify-center gap-2">
            <span className="text-6xl font-black text-white tracking-tighter italic font-mono">{formatIndianCurrency(totalCost)}</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 p-5 rounded-[22px] border border-white/5 space-y-3">
             <div className="p-2 bg-white/5 rounded-xl w-fit mx-auto shadow-sm">
                {stat.icon}
             </div>
             <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#8fa3c7]">{stat.label}</div>
                <div className="text-sm font-black text-white italic font-mono">{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="w-full pt-4">
         <button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black rounded-[20px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20">
            <MapPin className="w-4 h-4" />
            Launch Route Analytics
         </button>
      </div>
    </div>
  );
}
