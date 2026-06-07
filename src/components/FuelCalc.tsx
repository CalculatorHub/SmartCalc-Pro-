import React, { useState } from 'react';
import { RotateCcw, Save, Flame, Info, Route, ShieldAlert } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface FuelCalcProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

export default function FuelCalc({ currency, onSaveHistory }: FuelCalcProps) {
  const [distance, setDistance] = useState<number>(100);
  const [fuelPrice, setFuelPrice] = useState<number>(3.8);
  const [efficiency, setEfficiency] = useState<number>(25); // km/L or MPG
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Labels and standard formulas
  const efficiencyLabel = unitSystem === 'imperial' ? 'mpg (Miles / Gallon)' : 'L/100km (Liters / 100km)';
  const distanceUnit = unitSystem === 'imperial' ? 'miles' : 'km';
  const volumeUnit = unitSystem === 'imperial' ? 'gallons' : 'liters';

  // Calculations
  let fuelNeeded = 0;
  if (unitSystem === 'imperial') {
    // Miles / mpg = Gallons
    fuelNeeded = efficiency > 0 ? distance / efficiency : 0;
  } else {
    // (Distance * L/100km) / 100 = Liters
    fuelNeeded = (distance * efficiency) / 100;
  }

  const totalCost = fuelNeeded * fuelPrice;
  const costPerUnit = distance > 0 ? totalCost / distance : 0;

  // CO2 Emissions (Approx: 8.89 kg per Gallon, 2.31 kg per Liter)
  const co2Factor = unitSystem === 'imperial' ? 8.897 : 2.31;
  const co2Emissions = fuelNeeded * co2Factor;

  // Scale commute expenditures
  const dailyCost = totalCost;
  const weeklyCost = totalCost * 5; // assumes 5-day commute
  const monthlyCost = totalCost * 22; // 22 standard work days
  const annualCost = totalCost * 260; // 260 standard work days

  const maxYearlyCost = 6000; // default cap for color sizing
  const annualPercent = Math.min(100, Math.max(5, (annualCost / maxYearlyCost) * 100));

  const handlePreset = (sys: 'imperial' | 'metric', dist: number, price: number, eff: number) => {
    setUnitSystem(sys);
    setDistance(dist);
    setFuelPrice(price);
    setEfficiency(eff);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveHistory({
      type: 'fuel',
      title: 'Fuel Calculator',
      inputs: {
        distance,
        fuelPrice,
        efficiency,
        unitSystem,
      },
      outputs: {
        fuelNeeded,
        totalCost,
        co2Emissions,
        weeklyCost,
        monthlyCost,
        annualCost,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Carbon footprint banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 text-orange-950 text-sm">
        <Flame className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-orange-900">Eco-Finance insights:</span>
          <p className="mt-0.5 text-xs text-orange-850 opacity-90">
            Fuel expenses map directly to carbon emissions. By increasing fuel efficiency by just 5 MPG, you can save roughly {formatCurrency(350, currency)} per year and offset 1,200 lbs of CO2.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Parameters */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Route className="w-5 h-5 text-orange-600" />
              Commute Parameters
            </h3>
            <button
              onClick={() => handlePreset('imperial', 50, 3.8, 25)}
              className="text-gray-400 hover:text-orange-600 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Unit System Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Measurement System</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setUnitSystem('imperial');
                  setEfficiency(25); // reset efficiency to standard MPG
                  setIsSaved(false);
                }}
                className={cn(
                  "py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center",
                  unitSystem === 'imperial'
                    ? "bg-orange-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                Imperial (Miles, MPG, Gallon)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnitSystem('metric');
                  setEfficiency(8.5); // reset to standard L/100km
                  setIsSaved(false);
                }}
                className={cn(
                  "py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center",
                  unitSystem === 'metric'
                    ? "bg-orange-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                Metric (Km, L/100km, Liter)
              </button>
            </div>
          </div>

          {/* Planned Distance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Travel Distance ({distanceUnit})</label>
              <span className="text-sm font-semibold text-gray-800">{distance} {distanceUnit}</span>
            </div>
            <div className="relative rounded-xl">
              <input
                type="number"
                value={distance || ''}
                onChange={(e) => {
                  setDistance(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium"
                placeholder="0"
              />
            </div>
            <input
              type="range"
              min="1"
              max="500"
              step="5"
              value={distance}
              onChange={(e) => {
                setDistance(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-orange-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fuel Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Fuel Price (per {volumeUnit})</label>
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(fuelPrice, currency)}</span>
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
                className="block w-full pl-8 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium"
                placeholder="0.00"
              />
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.05"
              value={fuelPrice}
              onChange={(e) => {
                setFuelPrice(parseFloat(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-orange-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fuel Efficiency / Mileage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Vehicle Fuel Consumption</label>
              <span className="text-sm font-semibold text-gray-800">{efficiency} {unitSystem === 'imperial' ? 'mpg' : 'L/100km'}</span>
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
                className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium"
              />
            </div>
            <input
              type="range"
              min={unitSystem === 'imperial' ? 5 : 2}
              max={unitSystem === 'imperial' ? 80 : 30}
              step="0.5"
              value={efficiency}
              onChange={(e) => {
                setEfficiency(parseFloat(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-orange-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Vehicle Presets */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Typical Vehicles</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset('imperial', 30, 3.8, 52)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🚴 Hybrid Hatchback (52 mpg)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('imperial', 40, 3.8, 28)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🚗 Standard Sedan (28 mpg)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('imperial', 50, 4.0, 16)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/20 text-xs text-gray-600 hover:text-orange-700 transition-all font-medium cursor-pointer"
              >
                🛻 Family SUV / Truck (16 mpg)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Outputs */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Expenditure Insights
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
            <div className="p-4 bg-gray-50/30 border border-gray-100 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Fuel Needed</span>
              <p className="text-lg font-bold text-gray-800 font-sans">{fuelNeeded.toFixed(2)} {volumeUnit}</p>
            </div>
            <div className="p-4 bg-orange-50/20 border border-orange-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-orange-600">Total Travel Cost</span>
              <p className="text-lg font-bold text-orange-700 font-sans">{formatCurrency(totalCost, currency)}</p>
            </div>
            <div className="p-4 bg-emerald-50/20 border border-emerald-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Cost per {distanceUnit}</span>
              <p className="text-lg font-bold text-emerald-700 font-sans">{formatCurrency(costPerUnit, currency)}</p>
            </div>
            <div className="p-4 bg-red-50/20 border border-red-50 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Carbon Impact
              </span>
              <p className="text-lg font-bold text-red-700 font-sans">{co2Emissions.toFixed(1)} lbs CO2</p>
            </div>
          </div>

          {/* Animated Horizontal Commute bar charts */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projected Commute Forecast (Budget)</h4>

            <div className="space-y-2.5 text-xs">
              {/* Daily */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Daily Commute (1 day)</span>
                  <span className="font-bold text-gray-800">{formatCurrency(dailyCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, (dailyCost / annualCost) * 1000)}%` }}
                  ></div>
                </div>
              </div>

              {/* Weekly */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Weekly Commute (5 days)</span>
                  <span className="font-bold text-gray-800">{formatCurrency(weeklyCost, currency)}</span>
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
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Monthly Commute (22 days)</span>
                  <span className="font-bold text-gray-800">{formatCurrency(monthlyCost, currency)}</span>
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
                <div className="flex justify-between font-bold text-indigo-900 border-t border-gray-100 pt-2">
                  <span>Annual Budget (260 commute days)</span>
                  <span className="text-sm">{formatCurrency(annualCost, currency)}</span>
                </div>
                <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
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
