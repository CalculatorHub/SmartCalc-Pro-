import React from 'react';
import { IndianRupee, MapPin, Droplets, Target } from 'lucide-react';
import { motion } from 'motion/react';

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
    { label: 'Fuel Needed', value: `${fuelNeeded.toFixed(2)} Liters`, icon: <Droplets className="w-4 h-4" />, color: 'text-blue-500' },
    { label: 'Cost / KM', value: `₹${costPerKm.toFixed(2)}`, icon: <Target className="w-4 h-4" />, color: 'text-emerald-500' },
  ];

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-white/10 flex flex-col items-center text-center space-y-6 h-full" id="vehicle-estimation-card">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Estimated Trip Cost</h3>
        <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic">₹{totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/10 space-y-2">
             <div className={`${stat.color} p-2 bg-white dark:bg-white/10 rounded-xl w-fit mx-auto shadow-sm`}>
                {stat.icon}
             </div>
             <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
                <div className="text-sm font-black text-gray-900 dark:text-white italic">{stat.value}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="w-full pt-4 border-t border-gray-50 dark:border-gray-700">
         <button className="w-full h-12 bg-gray-900 dark:bg-blue-600 text-white font-black rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform">
            <MapPin className="w-4 h-4" />
            EXPAND LOGISTICS
         </button>
      </div>
    </div>
  );
}
