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
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-10 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Logistics Matrix</h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest italic">Core vehicle & trip analytics</p>
      </div>

      <div className="space-y-8">
        <FuelLogicCard fuelPrice={fuelPrice} setFuelPrice={setFuelPrice} />
        <DistanceEconomyCard 
            distance={distance} setDistance={setDistance} 
            mileage={mileage} setMileage={setMileage} 
        />
        <EstimationCard 
            distance={parseFloat(distance) || 0} 
            mileage={parseFloat(mileage) || 0} 
            fuelPrice={parseFloat(fuelPrice) || 0} 
        />
      </div>
    </div>
  );
}
