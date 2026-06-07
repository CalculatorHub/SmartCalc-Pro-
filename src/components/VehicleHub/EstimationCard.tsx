import React, { useEffect, useRef, useState } from 'react';
import { IndianRupee, MapPin, Droplets, Target, Save, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { formatIndianCurrency } from '../../lib/financeUtils';
import { saveHistory } from '../../lib/historyUtils';

interface EstimationCardProps {
  distance: number;
  mileage: number;
  fuelPrice: number;
}

export default function EstimationCard({ distance, mileage, fuelPrice }: EstimationCardProps) {
  const fuelNeeded = mileage > 0 ? distance / mileage : 0;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerKm = distance > 0 ? totalCost / distance : 0;

  const [savedStatus, setSavedStatus] = useState(false);
  const lastLoggedRef = useRef<string>('');

  // Debounced auto-save effect
  useEffect(() => {
    if (totalCost <= 0 || distance <= 0 || mileage <= 0 || fuelPrice <= 0) return;

    const paramKey = `${distance}-${mileage}-${fuelPrice}`;
    if (lastLoggedRef.current === paramKey) return;

    const handler = setTimeout(() => {
      saveHistory(
        'Vehicle Trip Estimation',
        totalCost,
        `Distance: ${distance} KM, Mileage: ${mileage} KMPL, Fuel Rate: ₹${fuelPrice}/L (Fuel: ${fuelNeeded.toFixed(1)} L)`
      );
      lastLoggedRef.current = paramKey;
    }, 1800);

    return () => clearTimeout(handler);
  }, [totalCost, distance, mileage, fuelPrice, fuelNeeded]);

  const handleManualSave = () => {
    if (totalCost <= 0) return;
    
    saveHistory(
      'Vehicle Trip Estimation',
      totalCost,
      `Distance: ${distance} KM, Mileage: ${mileage} KMPL, Fuel Rate: ₹${fuelPrice}/L (Fuel: ${fuelNeeded.toFixed(1)} L)`
    );
    
    const paramKey = `${distance}-${mileage}-${fuelPrice}`;
    lastLoggedRef.current = paramKey;
    
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

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

      <div className="w-full pt-4 flex flex-col sm:flex-row gap-3">
         <button
            onClick={handleManualSave}
            disabled={totalCost <= 0}
            className={`flex-1 h-14 rounded-[20px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
              savedStatus 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : totalCost <= 0
                  ? 'bg-white/5 border-white/5 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white cursor-pointer active:scale-95'
            }`}
         >
            {savedStatus ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedStatus ? 'Saved to Ledger ✓' : 'Save Trip Estimate'}
         </button>
         <button className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black rounded-[20px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/20">
            <MapPin className="w-4 h-4" />
            Launch Route Analytics
         </button>
      </div>
    </div>
  );
}
