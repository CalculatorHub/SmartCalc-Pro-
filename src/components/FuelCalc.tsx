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
  const [mileageError, setMileageError] = useState<string | null>(null);
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
    setMileageError(null);
    setIsSaved(false);
  };

  const handleReset = () => {
    setDistance(100);
    setFuelPrice(101.5);
    setEfficiency(15);
    setMileageError(null);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (mileageError || isNaN(efficiency) || efficiency < 1 || efficiency > 100) {
      setMileageError("Please enter mileage between 1 and 100 KMPL");
      return;
    }
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Carbon footprint banner */}
      <div className="bg-orange-500/5 dark:bg-orange-950/10 border border-orange-500/10 dark:border-orange-950/20 rounded-2xl p-4 flex gap-3 text-app-text text-sm">
        <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-orange-500">Commute Carbon & Financial Insight:</span>
          <p className="mt-0.5 text-xs text-app-text-secondary opacity-90 leading-relaxed">
            Fuel costs map directly to carbon emissions. By improving your vehicle's mileage (KMPL) by just 3 km/L, you can save significant fuel charges per year and reduce your carbon footprint by up to {(100 * 2.31).toFixed(0)} kg of CO2.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Parameters */}
        <div className="space-y-5 bg-app-card p-6 rounded-2xl border border-app-border shadow-xs">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <h3 className="font-semibold text-app-text text-normal flex items-center gap-2">
              <Route className="w-5 h-5 text-orange-500" />
              Indian Commute Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-app-text-muted hover:text-orange-500 text-xs flex items-center gap-1 cursor-pointer font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          {/* Planned Distance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">Travel Distance ({distanceUnit})</label>
              <span className="font-bold text-app-text text-sm">{distance} {distanceUnit}</span>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                value={distance || ''}
                onChange={(e) => {
                  setDistance(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold text-[#0F172A] dark:text-[#FFFFFF] placeholder-[#94A3B8] dark:placeholder-[#9CA3AF]"
                placeholder="0"
              />
            </div>
          </div>

          {/* Fuel Price (Rupees per Liter) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">Fuel Price (per Liter)</label>
              <span className="font-bold text-app-text text-sm">{formatCurrency(fuelPrice, currency)}/L</span>
            </div>
            <div className="relative rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-app-text-muted text-xs font-bold">{currency}</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={fuelPrice || ''}
                onChange={(e) => {
                  setFuelPrice(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-8 pr-3 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-semibold text-[#0F172A] dark:text-[#FFFFFF] placeholder-[#94A3B8] dark:placeholder-[#9CA3AF]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Fuel Efficiency / Vehicle Mileage (km/L - KMPL) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-app-text-secondary uppercase tracking-wider">Vehicle Mileage (km/L - KMPL)</label>
              <span className="font-bold text-app-text text-sm">{efficiency || 0} km/L</span>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                min="1"
                max="100"
                step="0.1"
                value={efficiency || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setEfficiency(val);
                  setIsSaved(false);
                  
                  if (isNaN(val) || val < 1 || val > 100) {
                    setMileageError("Please enter mileage between 1 and 100 KMPL");
                  } else {
                    setMileageError(null);
                  }
                }}
                className={cn(
                  "block w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#151515] border rounded-xl focus:outline-none focus:ring-2 text-sm font-semibold placeholder-[#94A3B8] dark:placeholder-[#9CA3AF] transition-all",
                  mileageError 
                    ? "border-red-500 text-red-600 dark:text-red-400 focus:ring-red-500/20 focus:border-red-500" 
                    : "border-[#E2E8F0] dark:border-[#2A2A2A] text-[#0F172A] dark:text-[#FFFFFF] focus:ring-orange-500/20 focus:border-orange-500"
                )}
                placeholder="Enter mileage"
              />
            </div>
            {mileageError && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-150">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {mileageError}
              </p>
            )}
          </div>

          {/* Indian Typical Vehicle Presets */}
          <div className="space-y-1.5 pt-2 border-t border-app-border">
            <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest block">Typical Indian Vehicles</span>
            <div className="flex flex-col gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 55)}
                className="w-full text-left px-3 py-2 rounded-lg border border-app-border hover:border-orange-500/20 hover:bg-orange-500/5 text-xs text-app-text-secondary hover:text-orange-500 transition-all font-semibold cursor-pointer"
              >
                🏍️ Commuter Bike / Scooty (55 km/L)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 18)}
                className="w-full text-left px-3 py-2 rounded-lg border border-app-border hover:border-orange-500/20 hover:bg-orange-500/5 text-xs text-app-text-secondary hover:text-orange-500 transition-all font-semibold cursor-pointer"
              >
                🚗 Hatchback / Sedan (18 km/L)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100, 101.5, 12)}
                className="w-full text-left px-3 py-2 rounded-lg border border-app-border hover:border-orange-500/20 hover:bg-orange-500/5 text-xs text-app-text-secondary hover:text-orange-500 transition-all font-semibold cursor-pointer"
              >
                🚙 Family SUV / MPV (12 km/L)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Outputs */}
        <div className="flex flex-col justify-between bg-app-card p-6 rounded-2xl border border-app-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-app-border pb-3 select-none">
            <h3 className="font-semibold text-app-text text-normal flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Expenditure Estimates
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                  : "bg-[#4F46E5] text-white dark:bg-[#FACC15] dark:text-[#000000] hover:opacity-90 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-app-bg border border-app-border rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-app-text-muted">Total Fuel Needed</span>
              <p className="text-md font-extrabold text-app-text font-sans">{fuelNeeded.toFixed(2)} {volumeUnit}</p>
            </div>
            <div className="p-4 bg-orange-500/5 border border-orange-500/10 dark:border-orange-500/20 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-500">Total Travel Cost</span>
              <p className="text-md font-extrabold text-orange-600 dark:text-orange-400 font-sans">{formatCurrency(totalCost, currency)}</p>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-500">Running Cost ({distanceUnit})</span>
              <p className="text-md font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">{formatCurrency(costPerUnit, currency)}/km</p>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/10 dark:border-red-555/20 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-500 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Carbon Weight
              </span>
              <p className="text-md font-extrabold text-red-600 dark:text-red-400 font-sans">{co2Emissions.toFixed(1)} kg CO2</p>
            </div>
          </div>

          {/* Projected Commute bar charts */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-app-text-muted uppercase tracking-wider select-none">Projected Commute Budgets</h4>

            <div className="space-y-2.5 text-xs font-semibold">
              {/* Daily */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-app-text-secondary select-none">
                  <span>Daily Commute (1 day)</span>
                  <span className="font-extrabold text-app-text">{formatCurrency(dailyCost, currency)}</span>
                </div>
                <div className="w-full bg-app-bg h-2 rounded-full overflow-hidden select-none">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (dailyCost / annualCost) * 1000)}%` }}
                  ></div>
                </div>
              </div>

              {/* Weekly */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-app-text-secondary select-none">
                  <span>Weekly Commute (5 days)</span>
                  <span className="font-extrabold text-app-text">{formatCurrency(weeklyCost, currency)}</span>
                </div>
                <div className="w-full bg-app-bg h-2 rounded-full overflow-hidden select-none">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (weeklyCost / annualCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Monthly */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-app-text-secondary select-none">
                  <span>Monthly Commute (22 days)</span>
                  <span className="font-extrabold text-app-text">{formatCurrency(monthlyCost, currency)}</span>
                </div>
                <div className="w-full bg-app-bg h-2 rounded-full overflow-hidden select-none">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (monthlyCost / annualCost) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Annual */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-app-text border-t border-app-border pt-3 bg-app-bg/40 px-2 rounded-lg py-1.5 select-none">
                  <span className="flex items-center gap-1 font-semibold text-app-text-secondary">Annual Commute Budget (260 Days)</span>
                  <span className="text-sm font-extrabold text-app-text">{formatCurrency(annualCost, currency)}</span>
                </div>
                <div className="w-full bg-app-bg h-3 rounded-full overflow-hidden select-none border border-app-border/40">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
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
