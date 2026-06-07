import React, { useState } from 'react';
import { RotateCcw, Save, Flame, Route, ShieldAlert, Info } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface FuelCalcProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

export default function FuelCalc({ currency = '₹', onSaveHistory }: FuelCalcProps) {
  // Balanced Indian default values: 100 km, ₹101.5/L, 15 km/L (KMPL)
  const [distance, setDistance] = useState<number>(100);
  const [fuelPrice, setFuelPrice] = useState<number>(101.5);
  const [efficiency, setEfficiency] = useState<number>(15); // in km/L (KMPL)
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Labels
  const efficiencyLabel = 'km/L (KMPL - Kilometers per Liter)';
  const distanceUnit = 'km';
  const volumeUnit = 'Liters';

  // Calculations
  // Distance (km) / Efficiency (km/L) = Fuel Needed (Liters)
  const fuelNeeded = efficiency > 0 ? distance / efficiency : 0;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerUnit = distance > 0 ? totalCost / distance : 0; // ₹ per km

  // CO2 Emissions (Approx: 2.31 kg per Liter for standard petrol/diesel)
  const co2Emissions = fuelNeeded * 2.31; // in kg CO2

  // Projected budgets
  const dailyCost = totalCost;
  const weeklyCost = totalCost * 5; // 5-day work week
  const monthlyCost = totalCost * 22; // 22 work days
  const annualCost = totalCost * 260; // 260 work days

  // Default max budget cap for visual sizing (e.g. ₹1,00,000 / year)
  const maxYearlyCost = 100000;
  const annualPercent = Math.min(100, Math.max(5, (annualCost / maxYearlyCost) * 100));

  const handlePreset = (dist: number, price: number, eff: number) => {
    setDistance(dist);
    setFuelPrice(price);
    setEfficiency(eff);
    setIsSaved(false);
  };

  const handleReset = () => {
    setDistance(100);
    setFuelPrice(101.5);
    setEfficiency(15);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveHistory({
      type: 'fuel',
      title: 'Fuel & Commute Calculator',
      inputs: {
        distanceKm: distance,
        fuelPricePerLiter: fuelPrice,
        efficiencyKmpl: efficiency,
      },
      outputs: {
        fuelNeededLiters: fuelNeeded,
        totalCostINR: totalCost,
        co2EmissionsKg: co2Emissions,
        weeklyCostINR: weeklyCost,
        monthlyCostINR: monthlyCost,
        annualCostINR: annualCost,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Carbon footprint banner */}
      <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4 flex gap-3 text-orange-950 text-sm">
        <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-orange-900">Commute Carbon & Financial Insight:</span>
          <p className="mt-0.5 text-xs text-orange-850 opacity-90">
            Fuel costs map directly to carbon emissions. By improving your vehicle's mileage (KMPL) by just 3 km/L, you can save significant fuel charges per year and reduce your carbon footprint by up to {(100 * 2.31).toFixed(0)} kg of CO2.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Parameters */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
              <Route className="w-5 h-5 text-orange-600" />
              Indian Commute Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-orange-600 text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {/* Planned Distance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Travel Distance ({distanceUnit})</label>
              <span className="font-bold text-gray-800 text-sm">{distance} {distanceUnit}</span>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                value={distance || ''}
                onChange={(e) => {
                  setDistance(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold"
                placeholder="0"
              />
            </div>
          </div>

          {/* Fuel Price (Rupees per Liter) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Fuel Price (per Liter)</label>
              <span className="font-bold text-gray-800 text-sm">{formatCurrency(fuelPrice, currency)}/L</span>
            </div>
            <div className="relative rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs font-bold">{currency}</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={fuelPrice || ''}
                onChange={(e) => {
                  setFuelPrice(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-8 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Fuel Efficiency / Vehicle Mileage (km/L) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Vehicle Mileage ({efficiencyLabel})</label>
              <span className="font-bold text-gray-800 text-sm">{efficiency} km/L</span>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                step="0.1"
                value={efficiency || ''}
                onChange={(e) => {
                  setEfficiency(Math.max(0.1, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold"
              />
            </div>
          </div>

          {/* Indian Typical Vehicle Presets */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            <span className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block">Typical Indian Vehicles</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 55)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🏍️ Commuter Bike / Scooty (55 km/L)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 18)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🚗 Hatchback / Sedan (18 km/L)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 12)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🚙 Family SUV / MPV (12 km/L)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Outputs */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Expenditure Estimates
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-orange-100 text-orange-850 border border-orange-200"
                  : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/35 border border-gray-100 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Fuel Needed</span>
              <p className="text-lg font-bold text-gray-800 font-sans">{fuelNeeded.toFixed(2)} {volumeUnit}</p>
            </div>
            <div className="p-4 bg-orange-50/20 border border-orange-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-600">Total Travel Cost</span>
              <p className="text-lg font-bold text-orange-700 font-sans">{formatCurrency(totalCost, currency)}</p>
            </div>
            <div className="p-4 bg-emerald-50/20 border border-emerald-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Running Cost ({distanceUnit})</span>
              <p className="text-lg font-bold text-emerald-700 font-sans">{formatCurrency(costPerUnit, currency)}/km</p>
            </div>
            <div className="p-4 bg-red-50/20 border border-red-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-650 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Carbon Weight
              </span>
              <p className="text-lg font-bold text-red-700 font-sans">{co2Emissions.toFixed(1)} kg CO2</p>
            </div>
          </div>

          {/* Projected Commute bar charts */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projected Commute Budgets</h4>

            <div className="space-y-2.5 text-xs font-semibold">
              {/* Daily */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Daily Commute (1 day)</span>
                  <span className="font-extrabold text-gray-800">{formatCurrency(dailyCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-550 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (dailyCost / annualCost) * 1000)}%` }}
                  ></div>
                </div>
              </div>

              {/* Weekly */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Weekly Commute (5 days)</span>
                  <span className="font-extrabold text-gray-800">{formatCurrency(weeklyCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (weeklyCost / annualCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Monthly Commute (22 days)</span>
                  <span className="font-extrabold text-gray-800">{formatCurrency(monthlyCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (monthlyCost / annualCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Annual */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-indigo-900 border-t border-gray-150 pt-2 bg-indigo-50/10 px-2 rounded-lg py-1">
                  <span className="flex items-center gap-1">Annual Commute Budget (260 Days)</span>
                  <span className="text-sm font-extrabold">{formatCurrency(annualCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-650 h-full rounded-full transition-all duration-300"
                    style={{ width: `${annualPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
