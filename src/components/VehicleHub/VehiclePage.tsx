import React, { useState } from 'react';
import FuelLogicCard from './FuelLogicCard';
import DistanceEconomyCard from './DistanceEconomyCard';
import EstimationCard from './EstimationCard';
import { Car } from 'lucide-react';

export default function VehiclePage() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');

  return (
    <div className="space-y-6 pb-28 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" id="vehicle-hub">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
          <Car className="w-8 h-8 text-blue-600" />
          Vehicle
        </h2>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Loan & vehicle tools</p>
        <span className="text-[8px] font-bold text-gray-400/50 uppercase tracking-[0.2em] mt-1">CRAFTED BY PATEL VAMSHIDHAR REDDY</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FuelLogicCard fuelPrice={fuelPrice} setFuelPrice={setFuelPrice} />
          <DistanceEconomyCard 
            distance={distance} setDistance={setDistance} 
            mileage={mileage} setMileage={setMileage} 
          />
        </div>
        <div className="h-full">
          <EstimationCard 
            distance={parseFloat(distance) || 0} 
            mileage={parseFloat(mileage) || 0} 
            fuelPrice={parseFloat(fuelPrice) || 0} 
          />
        </div>
      </div>
    </div>
  );
}
