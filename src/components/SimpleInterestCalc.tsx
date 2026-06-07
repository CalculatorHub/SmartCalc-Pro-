import React, { useState, useEffect } from 'react';
import { Percent, Info, RotateCcw, Save, Calendar, Landmark, Coins } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface SimpleInterestProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

export default function SimpleInterestCalc({ currency, onSaveHistory }: SimpleInterestProps) {
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(7.5);
  const [timeValue, setTimeValue] = useState<number>(3);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Calculate Simple Interest
  const timeInYears = timeUnit === 'years' ? timeValue : timeValue / 12;
  const interest = (principal * rate * timeInYears) / 100;
  const totalAmount = principal + interest;
  const monthlyPayment = totalAmount / (timeUnit === 'years' ? timeValue * 12 : timeValue);

  // SVG parameters for doughnut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const interestRatio = totalAmount > 0 ? interest / totalAmount : 0;
  const strokeDashoffset = circumference * (1 - interestRatio);

  const handlePreset = (p: number, r: number, t: number, u: 'years' | 'months') => {
    setPrincipal(p);
    setRate(r);
    setTimeValue(t);
    setTimeUnit(u);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveHistory({
      type: 'simple',
      title: 'Simple Interest',
      inputs: {
        principal,
        rate,
        timeValue,
        timeUnit,
      },
      outputs: {
        interest,
        totalAmount,
        monthlyPayment,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Info Card */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 text-emerald-800 text-sm">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Simple Interest formula:</span>
          <p className="mt-0.5 text-xs opacity-90">
            Interest (I) = (Principal × Rate × Time) / 100. Growth is linear and interest does not earned interest on itself.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Inputs */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              Calculator Parameters
            </h3>
            <button
              onClick={() => handlePreset(10000, 7.5, 3, 'years')}
              className="text-gray-400 hover:text-emerald-600 text-xs flex items-center gap-1 cursor-pointer"
              title="Reset to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Principal Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Principal Amount</label>
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(principal, currency)}</span>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-medium">{currency}</span>
              </div>
              <input
                type="number"
                value={principal || ''}
                onChange={(e) => {
                  setPrincipal(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-8 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                placeholder="0"
              />
            </div>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={principal}
              onChange={(e) => {
                setPrincipal(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-emerald-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Annual Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Annual Interest Rate (% p.a.)</label>
              <span className="text-sm font-semibold text-gray-800">{rate}%</span>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                value={rate || ''}
                onChange={(e) => {
                  setRate(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                placeholder="0.0"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={rate}
              onChange={(e) => {
                setRate(parseFloat(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-emerald-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Duration / Time Period */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Time Duration</label>
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setTimeUnit('years');
                    setIsSaved(false);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    timeUnit === 'years' ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeUnit('months');
                    setIsSaved(false);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    timeUnit === 'months' ? "bg-white text-emerald-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  Months
                </button>
              </div>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="number"
                value={timeValue || ''}
                onChange={(e) => {
                  setTimeValue(Math.max(1, parseInt(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
                placeholder="1"
              />
            </div>
            <input
              type="range"
              min="1"
              max={timeUnit === 'years' ? 40 : 360}
              step="1"
              value={timeValue}
              onChange={(e) => {
                setTimeValue(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-emerald-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest block">Quick Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(5000, 6, 2, 'years')}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-xs text-gray-600 hover:text-emerald-700 transition-all font-medium cursor-pointer"
              >
                Small Loan (5k @ 6%, 2 yrs)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(50000, 8.5, 5, 'years')}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-xs text-gray-600 hover:text-emerald-700 transition-all font-medium cursor-pointer"
              >
                Medium Capital (50k @ 8.5%, 5 yrs)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(150000, 10, 10, 'years')}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-xs text-gray-600 hover:text-emerald-700 transition-all font-medium cursor-pointer"
              >
                Large Venture (150k @ 10%, 10 yrs)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Outputs & Visualization */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              Calculation Results
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/30 border border-gray-100 rounded-xl space-y-1">
              <span className="text-xs text-gray-400 font-medium">Principal Invested</span>
              <p className="text-xl font-bold text-gray-800 font-sans">{formatCurrency(principal, currency)}</p>
            </div>
            <div className="p-4 bg-emerald-50/20 border border-emerald-50 rounded-xl space-y-1">
              <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Interest Gained</span>
              <p className="text-xl font-bold text-emerald-700 font-sans">{formatCurrency(interest, currency)}</p>
            </div>
            <div className="p-4 bg-indigo-50/20 border border-indigo-50 rounded-xl space-y-1 col-span-2 md:col-span-1 xl:col-span-2">
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Total Maturity Value</span>
              <p className="text-2xl font-black text-indigo-900 font-sans">{formatCurrency(totalAmount, currency)}</p>
              <div className="text-[11px] text-gray-400 mt-1">
                Equivalent to <span className="font-medium text-gray-700">{formatCurrency(monthlyPayment, currency)}</span> / month
              </div>
            </div>
          </div>

          {/* Graphical Representation (SVG Donut) */}
          <div className="flex flex-col items-center justify-center py-2 space-y-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* Background loop */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Interest loop */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Interest Ratio</span>
                <p className="text-xl font-extrabold text-emerald-600">
                  {((interestRatio || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span className="text-gray-500">Principal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-emerald-600">Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
