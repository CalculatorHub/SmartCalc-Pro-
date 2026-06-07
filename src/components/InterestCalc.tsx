import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  RotateCcw, 
  Save, 
  Calendar, 
  Landmark, 
  TrendingUp, 
  Sliders, 
  Lightbulb,
  CheckCircle,
  Sparkles,
  Coins
} from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface InterestCalcProps {
  initialMode?: 'simple' | 'compound' | 'compare';
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

export default function InterestCalc({ 
  initialMode = 'simple', 
  currency = '₹', 
  onSaveHistory 
}: InterestCalcProps) {
  // Mode tabs: we've removed 'compare' as per request, only 'simple' and 'compound' remain
  const [calcMode, setCalcMode] = useState<'simple' | 'compound'>(
    initialMode === 'compare' ? 'simple' : initialMode
  );

  // Sync calcMode if user toggles selection from the main dashboard cards
  useEffect(() => {
    if (initialMode === 'simple' || initialMode === 'compound') {
      setCalcMode(initialMode);
    }
  }, [initialMode]);
  
  // Base Parameters - Defaulted to 0 as per "Everytime input values with 0"
  const [principal, setPrincipal] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Synced Rate States - Defaulted to 0 as per "Everytime input values with 0"
  // formula: 12% annual = ₹1 rupee/month per ₹100 principal
  // formula: 18% annual = ₹1.5 rupees/month per ₹100 principal
  const [annualRate, setAnnualRate] = useState<number>(0);
  const [rupeeRate, setRupeeRate] = useState<number>(0);

  // Date difference utility to yield highly precise years/months breakdown
  const calcDateDiff = (d1Str: string, d2Str: string) => {
    if (!d1Str || !d2Str) return null;
    const d1 = new Date(d1Str);
    const d2 = new Date(d2Str);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    if (d1 > d2) return { invalid: true };

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = parseFloat((years * 12 + months + days / 30.4375).toFixed(2));
    const totalYears = parseFloat((totalMonths / 12).toFixed(2));

    return {
      years,
      months,
      days,
      totalDays: diffDays,
      totalMonths,
      totalYears,
      invalid: false
    };
  };

  const diffResult = calcDateDiff(startDate, endDate);

  // Sync date differences with duration inputs
  useEffect(() => {
    if (diffResult && !diffResult.invalid) {
      const calculatedVal = timeUnit === 'years' ? diffResult.totalYears : diffResult.totalMonths;
      setTimeValue(calculatedVal);
    } else {
      setTimeValue(0);
    }
  }, [startDate, endDate, timeUnit]);

  // Dynamically sync rate values
  const handleAnnualRateChange = (val: number) => {
    setAnnualRate(val);
    if (val === 0) {
      setRupeeRate(0);
    } else {
      setRupeeRate(parseFloat((val / 12).toFixed(4)));
    }
    setIsSaved(false);
  };

  const handleRupeeRateChange = (val: number) => {
    setRupeeRate(val);
    if (val === 0) {
      setAnnualRate(0);
    } else {
      setAnnualRate(parseFloat((val * 12).toFixed(2)));
    }
    setIsSaved(false);
  };

  // Reset parameters back to 0
  const handleReset = () => {
    setPrincipal(0);
    setTimeValue(0);
    setTimeUnit('years');
    setFrequency('monthly');
    setAnnualRate(0);
    setRupeeRate(0);
    setIsSaved(false);
    setStartDate('');
    setEndDate('');
  };

  // Traditional Popular Conversions presets
  const traditionalPresets = [
    { label: '50 Paise Rate', rRate: 0.5, aRate: 6.0, desc: 'Local rate of 0.5% per month' },
    { label: '₹1.00 Rupee Rate', rRate: 1.0, aRate: 12.0, desc: 'Traditional standard rate' },
    { label: '₹1.50 Rupee Rate', rRate: 1.5, aRate: 18.0, desc: 'Popular standard rural rate' },
    { label: '₹2.00 Rupees Rate', rRate: 2.0, aRate: 24.0, desc: 'High-risk or merchant rate' },
    { label: '₹3.00 Rupees Rate', rRate: 3.0, aRate: 36.0, desc: 'High-yield personal term' },
  ];

  // Duration in years (t)
  const t = timeUnit === 'years' ? timeValue : timeValue / 12;

  // -- SIMPLE INTEREST FORMULA --
  const simpleInterest = (principal * annualRate * t) / 100;
  const simpleTotal = principal + simpleInterest;
  const simpleMonthlyIncome = timeValue > 0 ? simpleInterest / (timeUnit === 'years' ? timeValue * 12 : timeValue) : 0;

  // -- COMPOUND INTEREST FORMULA --
  const n = FREQUENCY_MULTIPLIERS[frequency];
  const rCombined = annualRate / 100;
  // A = P * (1 + r/n)^(n*t)
  const compoundTotal = principal * Math.pow(1 + rCombined / n, n * t);
  const compoundInterest = compoundTotal - principal;
  const compoundMonthlyAverage = timeValue > 0 ? compoundInterest / (timeUnit === 'years' ? timeValue * 12 : timeValue) : 0;

  // Growth graph coordinate generator (0-Division safe)
  const numSteps = Math.min(12, Math.ceil(timeUnit === 'years' ? timeValue : timeValue)) || 1;
  const points: { label: string; value: number }[] = [];
  
  for (let i = 0; i <= numSteps; i++) {
    const stepT = (t === 0 || numSteps === 0) ? 0 : (t / numSteps) * i;
    if (calcMode === 'simple') {
      const sInt = (principal * annualRate * stepT) / 100;
      points.push({
        label: timeUnit === 'years' ? `${i}y` : `${i}m`,
        value: principal + sInt,
      });
    } else {
      const cTot = principal * Math.pow(1 + rCombined / n, n * stepT);
      points.push({
        label: timeUnit === 'years' ? `${i}y` : `${i}m`,
        value: cTot,
      });
    }
  }

  // Draw smooth SVG path
  const svgWidth = 500;
  const svgHeight = 180;
  const paddingX = 35;
  const paddingY = 20;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(...points.map(p => p.value)) || 1;
  const minVal = principal || 0;

  const getCoordinatesY = (val: number) => {
    if (maxVal === minVal) return paddingY + graphHeight;
    const pctY = (val - minVal) / (maxVal - minVal);
    return paddingY + graphHeight - pctY * graphHeight;
  };

  const getCoordinatesX = (idx: number) => {
    if (points.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (idx / (points.length - 1)) * graphWidth;
  };

  let linePath = '';
  let fillPath = '';

  if (points.length > 0) {
    const coords = points.map((p, idx) => ({ x: getCoordinatesX(idx), y: getCoordinatesY(p.value) }));
    linePath = `M ${coords[0].x} ${coords[0].y} ` + 
      coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');

    fillPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingY} L ${coords[0].x} ${svgHeight - paddingY} Z`;
  }

  const handleSave = () => {
    const isComp = calcMode === 'compound';
    onSaveHistory({
      type: calcMode,
      title: isComp ? `Compound Interest (${frequency})` : 'Simple Interest',
      inputs: {
        principal,
        rate: annualRate,
        rupeeRate,
        timeValue,
        timeUnit,
        ...(startDate && endDate && { startDate, endDate }),
        ...(isComp && { frequency })
      },
      outputs: {
        interest: isComp ? compoundInterest : simpleInterest,
        totalAmount: isComp ? compoundTotal : simpleTotal,
        rupeeReturnNote: `Traditional Rupee interest rate of ${rupeeRate} per ₹100/month`
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER BLOCK - Clean mode selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-150/45 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Landmark className="w-5.5 h-5.5 text-indigo-600" />
            Interest Calculator
          </h2>
          <p className="text-xs text-gray-450 mt-1 select-none font-medium">
            Dual Rate Conversion System (Annual % p.a. &amp; Local Monthly Rupee Rate)
          </p>
        </div>

        {/* Clean Selector for Simple and Compound. Compare mode removed completely */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto border border-gray-200/50 font-bold text-xs select-none shadow-3xs">
          <button
            type="button"
            onClick={() => {
              setCalcMode('simple');
              setIsSaved(false);
            }}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1",
              calcMode === 'simple' ? "bg-white text-emerald-700 shadow-3xs border border-emerald-100" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            Simple Interest
          </button>
          <button
            type="button"
            onClick={() => {
              setCalcMode('compound');
              setIsSaved(false);
            }}
            className={cn(
              "px-4 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1",
              calcMode === 'compound' ? "bg-white text-purple-700 shadow-3xs border border-purple-100" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            Compound Interest
          </button>
        </div>
      </div>

      {/* DYNAMICS EXPLANATION FOR RATE CONVERSIONS */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-emerald-50/50 border border-indigo-100/50 rounded-2xl p-4 flex gap-3 text-gray-700 text-xs shadow-3xs relative overflow-hidden">
        <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1 z-10">
          <span className="font-bold text-indigo-950 text-sm">Traditional Conversions Integrated Directly:</span>
          <p className="opacity-90 leading-relaxed text-indigo-900">
            For local finance bookkeeping, interest is defined as <strong className="text-emerald-750 font-extrabold">Rupees per month for every ₹100 of principal</strong>. 
            Here, <strong className="text-slate-800 font-bold">12% Annual Rate (% p.a.) = ₹1.00 Rupee Rate</strong>, and <strong className="text-slate-800 font-bold">18% Annual Rate = ₹1.50 Rupee Rate</strong>. 
            Simply modify either field below, and the active conversion rate displays instantly inline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PARAMETERS FOR THE INDIVIDUAL SECTION */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-150/45 shadow-3xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Configure {calcMode === 'simple' ? 'Simple' : 'Compound'} Parameters
            </h3>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-indigo-600 text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors"
              title="Reset parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Inputs to 0
            </button>
          </div>

          {/* 1. Principal Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Principal Amount</label>
              <span className="text-sm font-extrabold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {formatCurrency(principal, currency)}
              </span>
            </div>
            <div className="relative rounded-xl shadow-3xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-semibold">{currency}</span>
              </div>
              <input
                type="number"
                value={principal === 0 ? '' : principal}
                onChange={(e) => {
                  setPrincipal(Math.max(0, parseFloat(e.target.value) || 0));
                  setIsSaved(false);
                }}
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold text-gray-850"
                placeholder="0"
              />
            </div>
          </div>

          {/* 2. Synced Rate Inputs inside the Section for User Interest (12% = 1 Rupee / 18% = 1.5 Rupees) */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-gray-50/60 border border-gray-150/45">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block">Rate &amp; Rupee Conversion Converter</span>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                12% = 1 Rupee | 18% = 1.5 Rupees
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Annual Percent Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 select-none">
                  <Percent className="w-3 h-3 text-indigo-500" />
                  Annual Rate (% p.a.)
                </label>
                <div className="relative rounded-lg shadow-3xs">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="120"
                    value={annualRate === 0 ? '' : annualRate}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      handleAnnualRateChange(v);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-indigo-950"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
                    <span className="text-[10px] text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Rupee Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 select-none">
                  <Coins className="w-3 h-3 text-emerald-600" />
                  Monthly Rupee Rate
                </label>
                <div className="relative rounded-lg shadow-3xs">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={rupeeRate === 0 ? '' : rupeeRate}
                    onChange={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      handleRupeeRateChange(v);
                    }}
                    className="block w-full pl-5 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-950"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <span className="text-[10px] text-emerald-500 font-bold">{currency}</span>
                  </div>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <span className="text-[8px] text-gray-450 font-bold">/100 p.m.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Conversion Indicator bar inside SI and CI */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-150/40 text-center select-none font-medium">
              <p className="text-[11px] text-slate-700">
                👉 Conversion: <strong className="text-indigo-700">{annualRate}%</strong> Annual is exactly <strong className="text-emerald-700">{currency}{rupeeRate.toFixed(4)}</strong> Rupee Interest per ₹100/month
              </p>
            </div>

            {/* PRESETS */}
            <div className="space-y-1 select-none">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Presets</span>
              <div className="flex flex-wrap gap-1">
                {traditionalPresets.map((preset, idx) => {
                  const isActive = Math.abs(rupeeRate - preset.rRate) < 0.01;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleRupeeRateChange(preset.rRate);
                      }}
                      className={cn(
                        "px-2 py-0.5 rounded-md border text-[9px] font-bold cursor-pointer transition-all",
                        isActive 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-gray-250/60 hover:bg-slate-50"
                      )}
                      title={preset.desc}
                    >
                      ₹{preset.rRate.toFixed(2)} ({preset.aRate}%)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Duration */}
          <div className="space-y-3.5 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center select-none">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Duration</label>
              <div className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">Computed from Dates</div>
            </div>

            <div className="space-y-3.5 p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/35">
              <div className="grid grid-cols-2 gap-3.5">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 select-none">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setIsSaved(false);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 cursor-pointer"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 select-none">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setIsSaved(false);
                    }}
                    className="block w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-800 cursor-pointer"
                  />
                </div>
              </div>

              {/* Scaling switcher while in date mode */}
              <div className="flex items-center justify-between text-xs select-none bg-white p-2 rounded-xl border border-gray-150/40">
                <span className="text-[10px] text-gray-400 font-bold block">Render duration in:</span>
                <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeUnit('years');
                      setIsSaved(false);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer text-[10px]",
                      timeUnit === 'years' ? "bg-white text-slate-800 shadow-3xs font-extrabold" : "text-gray-400 hover:text-gray-850"
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
                      "px-2.5 py-1 rounded-md transition-all cursor-pointer text-[10px]",
                      timeUnit === 'months' ? "bg-white text-slate-800 shadow-3xs font-extrabold" : "text-gray-400 hover:text-gray-850"
                    )}
                  >
                    Months
                  </button>
                </div>
              </div>

              {/* Date diff statistics banner */}
              {diffResult && !diffResult.invalid && (
                <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/40 text-[11px] text-indigo-950 font-medium space-y-1">
                  <p className="flex items-center gap-1 font-bold text-indigo-900">
                    <span>✓</span> Period Computed Successfully:
                  </p>
                  <p className="opacity-95 pl-3">
                    <strong>{diffResult.years}</strong> Years,{" "}
                    <strong>{diffResult.months}</strong> Months, and{" "}
                    <strong>{diffResult.days}</strong> Days
                  </p>
                  <p className="text-[10px] text-slate-500 pl-3 pt-0.5 border-t border-indigo-100/20">
                    Equates to: <span className="bg-white px-1.5 py-0.5 rounded shadow-3xs font-extrabold text-indigo-700">{timeValue} {timeUnit}</span> for formulas
                  </p>
                </div>
              )}

              {diffResult && diffResult.invalid && (
                <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl border border-rose-100/45 text-[10px] font-bold">
                  ⚠️ Error: End Date cannot be before Start Date! Please adjust values.
                </div>
              )}

              {(!startDate || !endDate) && (
                <div className="text-slate-400 text-[10px] text-center p-3 border border-dashed border-gray-200 rounded-xl bg-white/50 select-none">
                  Select both Start and End Dates to compute duration automatically
                </div>
              )}
            </div>
          </div>

          {/* 4. Compound Frequency (Compound tab only) */}
          {calcMode === 'compound' && (
            <div className="space-y-2 pt-2 border-t border-gray-100 select-none">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                Compounding Cycle
              </label>
              <div className="grid grid-cols-5 gap-1 bg-gray-50 p-1 rounded-xl border border-gray-150/40">
                {(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily'] as Frequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => {
                      setFrequency(freq);
                      setIsSaved(false);
                    }}
                    className={cn(
                      "px-1 py-1 text-[9px] font-bold text-center transition-all cursor-pointer capitalize rounded-md",
                      frequency === freq
                        ? "bg-purple-600 text-white shadow-3xs"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    {freq.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CALCULATION RESULTS + INDEPENDENT GRAPH */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* RESULTS SPECIFIC TO ACTIVE CALC MODE */}

          {/* SIMPLE INTEREST MODE UI */}
          {calcMode === 'simple' && (
            <div className="bg-white p-5 rounded-3xl border border-emerald-500/15 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Simple Return Outputs</span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved || principal === 0}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer select-none transition-all"
                >
                  <Save className="w-3 h-3" />
                  Save Calculation
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/20 p-3.5 rounded-2xl border border-emerald-100/35">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Simple Interest</span>
                  <span className="text-lg font-black text-emerald-800">{formatCurrency(simpleInterest, currency)}</span>
                </div>
                <div className="bg-emerald-50/20 p-3.5 rounded-2xl border border-emerald-100/35">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Balance</span>
                  <span className="text-lg font-black text-slate-800">{formatCurrency(simpleTotal, currency)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-550 bg-gray-50/80 p-3 rounded-xl border border-gray-150/40 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Estimated Return per Month:</span>
                  <span className="text-slate-800 font-extrabold">{formatCurrency(simpleMonthlyIncome, currency)}</span>
                </div>
                <span className="text-emerald-750 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Linear Yield
                </span>
              </div>
            </div>
          )}

          {/* COMPOUND INTEREST MODE UI */}
          {calcMode === 'compound' && (
            <div className="bg-white p-5 rounded-3xl border border-purple-500/15 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider capitalize">Compound Return ({frequency})</span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved || principal === 0}
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer select-none transition-all"
                >
                  <Save className="w-3 h-3" />
                  Save Calculation
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50/20 p-3.5 rounded-2xl border border-purple-100/35">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Interest Accrued</span>
                  <span className="text-lg font-black text-purple-800">{formatCurrency(compoundInterest, currency)}</span>
                </div>
                <div className="bg-purple-50/20 p-3.5 rounded-2xl border border-purple-100/35">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Future Maturity Value</span>
                  <span className="text-lg font-black text-slate-800">{formatCurrency(compoundTotal, currency)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-550 bg-gray-50/80 p-3 rounded-xl border border-gray-150/40 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Average Yield per Month:</span>
                  <span className="text-slate-800 font-extrabold">{formatCurrency(compoundMonthlyAverage, currency)}</span>
                </div>
                <span className="text-purple-750 font-bold bg-purple-50 px-2 py-0.5 rounded text-[10px] uppercase">
                  Compounding Yield
                </span>
              </div>
            </div>
          )}

          {/* DYNAMIC SHADOWED GROWTH GRAPH */}
          <div className="bg-white p-5 rounded-3xl border border-gray-150/45 shadow-3xs space-y-4">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Projected Balance Curve over duration
            </span>

            {/* GROWING SVG GRAPH */}
            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center relative select-none">
              
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 mb-2">
                <span>Principal Base: {formatCurrency(principal, currency)}</span>
                <span className={calcMode === 'simple' ? 'text-emerald-600' : 'text-purple-600'}>
                  Final Value: {formatCurrency(calcMode === 'simple' ? simpleTotal : compoundTotal, currency)}
                </span>
              </div>

              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-36 max-w-full overflow-visible font-bold"
              >
                {/* Grid guidelines */}
                {[0, 1, 2].map((g) => {
                  const yVal = paddingY + (graphHeight / 2) * g;
                  return (
                    <line 
                      key={g}
                      x1={paddingX} 
                      y1={yVal} 
                      x2={svgWidth - paddingX} 
                      y2={yVal} 
                      stroke="#e2e8f0" 
                      strokeWidth="1" 
                    />
                  );
                })}

                {/* Fill shadow area */}
                {points.length > 0 && (
                  <path 
                    d={fillPath} 
                    fill={`url(#${calcMode === 'simple' ? 'emeraldGlow' : 'purpleGlow'})`} 
                    opacity="0.12" 
                  />
                )}

                {/* Main line path */}
                {points.length > 0 && (
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke={calcMode === 'simple' ? '#10b981' : '#8b5cf6'} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                )}

                {/* Base Anchor Indicator */}
                <circle 
                  cx={paddingX} 
                  cy={getCoordinatesY(principal)} 
                  r="4" 
                  fill="#4f46e5" 
                />

                {/* Return Cap Marker */}
                <circle 
                  cx={svgWidth - paddingX} 
                  cy={getCoordinatesY(calcMode === 'simple' ? simpleTotal : compoundTotal)} 
                  r="5" 
                  fill={calcMode === 'simple' ? '#10b981' : '#8b5cf6'} 
                />

                {/* Dynamic Axis ticks labels */}
                {points.length > 0 && Array.from(new Set([0, Math.floor(points.length / 2), points.length - 1])).map((idx) => {
                  if (idx >= points.length) return null;
                  const item = points[idx];
                  if (!item) return null;
                  return (
                    <text
                      key={idx}
                      x={getCoordinatesX(idx)}
                      y={svgHeight - 4}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {item.label}
                    </text>
                  );
                })}

                <defs>
                  <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* SAVING SUCCESS PROMPTER */}
          {isSaved && (
            <div className="bg-emerald-600 text-white rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs font-semibold select-none shadow-sm animate-bounce">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Interest Record successfully saved to Your History Log!
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
