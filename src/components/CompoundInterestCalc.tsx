import React, { useState } from 'react';
import { Percent, Info, RotateCcw, Save, Calendar, Landmark, TrendingUp } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface CompoundInterestProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

type Frequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export default function CompoundInterestCalc({ currency, onSaveHistory }: CompoundInterestProps) {
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8.0);
  const [timeValue, setTimeValue] = useState<number>(10);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [frequency, setFrequency] = useState<Frequency>('annually');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Calculate compounding state
  const t = timeUnit === 'years' ? timeValue : timeValue / 12;
  const n = FREQUENCY_MULTIPLIERS[frequency];
  const r = rate / 100;
  
  // A = P * (1 + r/n)^(n*t)
  const totalAmount = principal * Math.pow(1 + r / n, n * t);
  const interest = totalAmount - principal;

  // Simple Interest for comparison
  const simpleTotal = principal * (1 + r * t);

  // Generate incremental milestones for SVG curved line chart (up to 10 points)
  const numSteps = Math.min(10, Math.ceil(t));
  const points: { label: string; compound: number; simple: number }[] = [];
  
  for (let i = 0; i <= numSteps; i++) {
    const currentT = t === 0 ? 0 : (t / numSteps) * i;
    const compVal = principal * Math.pow(1 + r / n, n * currentT);
    const simpVal = principal * (1 + r * currentT);
    points.push({
      label: timeUnit === 'years' 
        ? `${Math.round(currentT)}y` 
        : `${Math.round(currentT * 12)}m`,
      compound: compVal,
      simple: simpVal,
    });
  }

  // Draw smooth SVG path
  const svgWidth = 320;
  const svgHeight = 120;
  const paddingX = 20;
  const paddingY = 15;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(...points.map((p) => p.compound)) || 1;
  const minVal = principal * 0.9; // scale starting near principal

  const getCoordinates = (p: typeof points) => {
    return p.map((pt, idx) => {
      const x = paddingX + (idx / (p.length - 1)) * graphWidth;
      const pctY = (pt.compound - minVal) / (maxVal - minVal);
      const y = paddingY + graphHeight - pctY * graphHeight;
      return { x, y };
    });
  };

  const coords = getCoordinates(points);
  
  // Construct line path string
  let linePath = '';
  if (coords.length > 0) {
    linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map((c) => `L ${c.x} ${c.y}`).join(' ');
  }

  // Under-fill area
  let fillPath = '';
  if (coords.length > 0) {
    fillPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;
  }

  const handlePreset = (p: number, r: number, t: number, f: Frequency) => {
    setPrincipal(p);
    setRate(r);
    setTimeValue(t);
    setTimeUnit('years');
    setFrequency(f);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveHistory({
      type: 'compound',
      title: 'Compound Interest',
      inputs: {
        principal,
        rate,
        timeValue,
        timeUnit,
        frequency,
      },
      outputs: {
        interest,
        totalAmount,
        simpleTotalSavings: simpleTotal,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Info */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3 text-purple-950 text-sm">
        <TrendingUp className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-purple-900">The Power of Compounding:</span>
          <p className="mt-0.5 text-xs text-purple-800/90">
            Compound interest reinvests earnings back into the principal pool, creating exponential wealth growth. Albert Einstein called it the "8th Wonder of the World".
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Parameter Panel */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5 text-purple-600" />
              Compounding Parameters
            </h3>
            <button
              onClick={() => handlePreset(10000, 8.0, 10, 'annually')}
              className="text-gray-400 hover:text-purple-600 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Principal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Initial Deposit (Principal)</label>
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
                className="block w-full pl-8 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium"
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
              className="w-full accent-purple-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Annual Return Rate (% APY)</label>
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
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium"
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
              className="w-full accent-purple-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-600">Deposit Tenure</label>
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setTimeUnit('years');
                    setIsSaved(false);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    timeUnit === 'years' ? "bg-white text-purple-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
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
                    timeUnit === 'months' ? "bg-white text-purple-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
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
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium"
                placeholder="10"
              />
            </div>
            <input
              type="range"
              min="1"
              max={timeUnit === 'years' ? 50 : 360}
              step="1"
              value={timeValue}
              onChange={(e) => {
                setTimeValue(parseInt(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-purple-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 block">Compounding Interval</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-gray-50 p-1 rounded-xl">
              {(Object.keys(FREQUENCY_MULTIPLIERS) as Frequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFrequency(f);
                    setIsSaved(false);
                  }}
                  className={cn(
                    "py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer text-center",
                    frequency === f
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  )}
                >
                  {f === 'semi-annually' ? 'Semi-An' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-1.5 pt-1 border-t border-gray-50">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest block">Compounding Presets</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreset(20000, 10, 15, 'annually')}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 text-xs text-gray-600 hover:text-purple-700 transition-all font-medium cursor-pointer"
              >
                10% Index ETF (20k, 15 yrs)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(5000, 5, 5, 'monthly')}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 text-xs text-gray-600 hover:text-purple-700 transition-all font-medium cursor-pointer"
              >
                High-Yield Account (5k, 5 yrs)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(100000, 12, 25, 'annually')}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 text-xs text-gray-600 hover:text-purple-700 transition-all font-medium cursor-pointer"
              >
                Retirement Nest (100k, 25 yrs)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Retirement & Growth Forecast
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50/30 border border-gray-100 rounded-xl space-y-1 col-span-2">
              <span className="text-xs text-gray-400 font-medium">Future Value (Total Compound Benefit)</span>
              <p className="text-3xl font-extrabold text-indigo-950 font-sans tracking-tight">
                {formatCurrency(totalAmount, currency)}
              </p>
            </div>
            <div className="p-4 bg-purple-50/20 border border-purple-50 rounded-xl space-y-1">
              <span className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Compound Interest</span>
              <p className="text-xl font-bold text-purple-800 font-sans">{formatCurrency(interest, currency)}</p>
            </div>
            <div className="p-4 bg-rose-50/10 border border-rose-50 rounded-xl space-y-1">
              <span className="text-xs text-rose-500 font-semibold uppercase tracking-wider">Compounding Gain VS Simple</span>
              <p className="text-xl font-bold text-rose-600 font-sans">
                +{formatCurrency(Math.max(0, totalAmount - simpleTotal), currency)}
              </p>
            </div>
          </div>

          {/* Projected Growth Path SVG */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-500">Maturity Curve</span>
              <span className="text-purple-600">Tenure: {timeValue} {timeUnit}</span>
            </div>

            <div className="bg-slate-50/50 rounded-xl border border-gray-100 p-2 relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible">
                {/* Under Fill gradient */}
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis boundary indicators */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1={paddingX} y1={paddingY + graphHeight} x2={svgWidth - paddingX} y2={paddingY + graphHeight} stroke="#e2e8f0" />

                {/* Fill Path */}
                {fillPath && <path d={fillPath} fill="url(#purpleGrad)" />}

                {/* Curved Growth Line */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Dots along path & Labels */}
                {coords.map((c, i) => {
                  const isEnd = i === coords.length - 1;
                  const isStart = i === 0;
                  return (
                    <g key={i}>
                      {/* Highlight first and last dots */}
                      {(isStart || isEnd) && (
                        <>
                          <circle cx={c.x} cy={c.y} r="5" fill="#4f46e5" />
                          <circle cx={c.x} cy={c.y} r="8" fill="none" stroke="#818cf8" strokeWidth="1.5" className="animate-ping" />
                        </>
                      )}
                      
                      {/* Tiny dots for mid milestones */}
                      {!isStart && !isEnd && (
                        <circle cx={c.x} cy={c.y} r="2.5" fill="#818cf8" />
                      )}

                      {/* Display value for endpoints */}
                      {(isStart || isEnd) && (
                        <text
                          x={c.x + (isStart ? 6 : -15)}
                          y={c.y - 8}
                          fontSize="9"
                          fontWeight="700"
                          fill="#312e81"
                          className="font-mono bg-white bg-opacity-70 px-1"
                        >
                          {isStart ? 'Entry' : formatCurrency(points[i].compound, currency).split('.')[0]}
                        </text>
                      )}

                      {/* Timeline labels at the bottom */}
                      {(isStart || isEnd || (i === Math.floor(coords.length / 2))) && (
                        <text
                          x={c.x - 8}
                          y={svgHeight - 2}
                          fontSize="8"
                          fontWeight="600"
                          fill="#94a3b8"
                        >
                          {points[i].label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-extrabold text-gray-400 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></div>
                <span>Compounded Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-300">|</span>
                <span>Exponential Curve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
