import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { annualToMonthlyRate, monthlyToAnnualRate, formatIndianCurrency } from '../lib/financeUtils';
import { saveHistory } from '../lib/historyUtils';
import { ArrowRightLeft, Calculator, Percent } from 'lucide-react';

/* ---------- Traditional Rate Converter ---------- */
function TraditionalConverter() {
  const [mode, setMode] = useState<'pctToRs' | 'rsToPct'>('pctToRs');
  const [inputVal, setInputVal] = useState('');
  const [converted, setConverted] = useState<{ value: string; unit: string } | null>(null);

  useEffect(() => {
    if (!inputVal) {
      setConverted(null);
      return;
    }
    const val = parseFloat(inputVal);
    if (isNaN(val) || val <= 0) {
      setConverted(null);
      return;
    }

    if (mode === 'pctToRs') {
      const rs = annualToMonthlyRate(val);
      if (rs < 1) {
        setConverted({ value: (rs * 100).toFixed(0), unit: 'Paise / month / ₹100' });
      } else {
        setConverted({ value: rs.toFixed(2), unit: 'Rupees / month / ₹100' });
      }
    } else {
      const pct = monthlyToAnnualRate(val);
      setConverted({ value: pct.toFixed(2), unit: 'Annual % Interest' });
    }
  }, [inputVal, mode]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-blue-400" />
          Rural ⇋ Bank Converter
        </h3>
        <button
          onClick={() => {
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-[#60a5fa] font-bold transition-all cursor-pointer border border-white/5"
        >
          {mode === 'pctToRs' ? 'Rs/Month ⇋ %' : '% ⇋ Rs/Month'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-1.5 block">
            {mode === 'pctToRs' ? 'Annual Percentage Rate (%)' : 'Rural Monthly Rate (₹ per ₹100)'}
          </label>
          <Input 
            placeholder={mode === 'pctToRs' ? "e.g., 12" : "e.g., 1"} 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)} 
            type="number"
          />
        </div>

        {converted && (
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
            <span className="text-[10px] uppercase font-black text-blue-400 tracking-wider">Equivalent Interest Rate</span>
            <div className="text-xl font-extrabold text-white mt-1">
              {mode === 'pctToRs' && parseFloat(converted.value) >= 1 ? '₹' : ''}
              {converted.value} <span className="text-xs font-semibold text-gray-400">{converted.unit}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------- Compound & Simple Interest ---------- */
const getDurationString = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return '';
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
  const diffMs = e.getTime() - s.getTime();
  if (diffMs <= 0) return 'End Date must be after Start Date';
  
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = totalDays - Math.floor(years * 365.25);
  const months = Math.floor(remainingDays / 30.43);
  const days = Math.round(remainingDays - Math.floor(months * 30.43));

  const parts = [];
  if (years > 0) parts.push(`${years} Yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} Mo${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 Days';
};

export default function Finance() {
  const [interestType, setInterestType] = useState<'SI' | 'CI'>('CI');
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resultTotal, setResultTotal] = useState<string>("0.00");
  const [resultInterest, setResultInterest] = useState<string>("0.00");

  const [computedYears, setComputedYears] = useState<number>(0);
  const [isDatesInvalid, setIsDatesInvalid] = useState<boolean>(false);

  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const diffMs = e.getTime() - s.getTime();
        if (diffMs > 0) {
          const yrs = diffMs / (1000 * 60 * 60 * 24 * 365.25);
          setComputedYears(yrs);
          setIsDatesInvalid(false);
        } else {
          setComputedYears(0);
          setIsDatesInvalid(true);
        }
      } else {
        setComputedYears(0);
        setIsDatesInvalid(false);
      }
    } else {
      setComputedYears(0);
      setIsDatesInvalid(false);
    }
  }, [startDate, endDate]);

  const calculate = () => {
    const principal = parseFloat(p) || 0;
    const rate = parseFloat(r) || 0;
    const time = computedYears;
    
    if (principal > 0 && rate > 0 && time > 0) {
      if (interestType === 'CI') {
        const total = principal * Math.pow(1 + rate / 100, time);
        const earned = total - principal;
        setResultTotal(total.toFixed(2));
        setResultInterest(earned.toFixed(2));
      } else {
        const earned = (principal * rate * time) / 100;
        const total = principal + earned;
        setResultTotal(total.toFixed(2));
        setResultInterest(earned.toFixed(2));
      }
    } else {
      setResultTotal("0.00");
      setResultInterest("0.00");
    }
  };

  const handleRecalculate = () => {
    calculate();
    const principal = parseFloat(p) || 0;
    const rate = parseFloat(r) || 0;
    const time = computedYears;
    if (principal > 0 && rate > 0 && time > 0) {
      if (interestType === 'CI') {
        const total = principal * Math.pow(1 + rate / 100, time);
        const earned = total - principal;
        saveHistory(
          'Compound Interest',
          total,
          `Pr: ₹${principal.toLocaleString('en-IN')}, R: ${rate}%, T: ${time.toFixed(2)} Yrs (Earned: ₹${earned.toFixed(2)})`
        );
      } else {
        const earned = (principal * rate * time) / 100;
        const total = principal + earned;
        saveHistory(
          'Simple Interest',
          total,
          `Pr: ₹${principal.toLocaleString('en-IN')}, R: ${rate}%, T: ${time.toFixed(2)} Yrs (Earned: ₹${earned.toFixed(2)})`
        );
      }
    }
  };

  // Real-time calculation on state change
  useEffect(() => {
    calculate();
  }, [interestType, p, r, computedYears]);

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      
      {/* 🔄 UNIT / RATE CONVERTER */}
      <TraditionalConverter />

      {/* 📊 INTEREST CALCULATOR ZONE */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            Interest Calculator
          </h3>
          
          {/* Segmented SI/CI Toggle control */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 select-none text-[10px] font-bold font-mono">
            <button 
              onClick={() => setInterestType('SI')} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                interestType === 'SI' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Simple
            </button>
            <button 
              onClick={() => setInterestType('CI')} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                interestType === 'CI' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Compound
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block">Principal (₹)</label>
            <Input placeholder="Principal ₹" value={p} onChange={(e) => setP(e.target.value)} type="number" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block">Annual Interest Rate (%)</label>
            <Input placeholder="Rate %" value={r} onChange={(e) => setR(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Start Date</label>
              <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">End Date</label>
              <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
            </div>
          </div>

          {startDate && endDate && (
            <div className={`p-3 rounded-xl border font-mono text-[11px] text-center font-bold tracking-wide ${
              isDatesInvalid 
                ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {isDatesInvalid ? (
                <span>⚠️ End Date must be strictly after Start Date</span>
              ) : (
                <span>🕒 Duration: {getDurationString(startDate, endDate)} ({computedYears.toFixed(2)} Years)</span>
              )}
            </div>
          )}

          <Button text="Recalculate" onClick={handleRecalculate} />
        </div>
      </Card>

      {/* 📊 ACCUMULATED RESULTS BREAKDOWN */}
      <Card>
        <div className="space-y-4 py-1">
          <div className="grid grid-cols-2 gap-4 divide-x divide-white/5 text-center">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Interest Earned</div>
              <h4 className="text-lg font-black text-emerald-400">
                ₹ {parseFloat(resultInterest).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Principal Amount</div>
              <h4 className="text-lg font-black text-gray-300">
                ₹ {p && !isNaN(parseFloat(p)) ? parseFloat(p).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </h4>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-4 text-center">
            <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">
              Projected {interestType === 'CI' ? 'Compound' : 'Simple'} Total
            </div>
            <h2 className="text-3xl font-black text-indigo-400">
              ₹ {parseFloat(resultTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
}
