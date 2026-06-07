import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveHistory } from '../lib/historyUtils';
import { Sparkles, Calendar, Calculator, Percent } from 'lucide-react';

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

export default function Simple() {
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
      const earned = (principal * rate * time) / 100;
      const total = principal + earned;
      setResultTotal(total.toFixed(2));
      setResultInterest(earned.toFixed(2));
    } else {
      setResultTotal("0.00");
      setResultInterest("0.00");
    }
  };

  const handleCalculateClick = () => {
    calculate();
    const principal = parseFloat(p) || 0;
    const rate = parseFloat(r) || 0;
    const time = computedYears;

    if (principal > 0 && rate > 0 && time > 0) {
      const earned = (principal * rate * time) / 100;
      const total = principal + earned;
      saveHistory(
        'Simple Interest',
        total,
        `Pr: ₹${principal.toLocaleString('en-IN')}, R: ${rate}%, T: ${time.toFixed(2)} Yrs (Earned: ₹${earned.toFixed(2)})`
      );
    }
  };

  const lastLoggedRef = useRef<string>('');

  useEffect(() => {
    const principal = parseFloat(p) || 0;
    const rate = parseFloat(r) || 0;
    const time = computedYears;

    if (principal <= 0 || rate <= 0 || time <= 0) return;

    const paramKey = `${p}-${r}-${computedYears}`;
    if (lastLoggedRef.current === paramKey) return;

    const handler = setTimeout(() => {
      const earned = (principal * rate * time) / 100;
      const total = principal + earned;
      saveHistory(
        'Simple Interest',
        total,
        `Pr: ₹${principal.toLocaleString('en-IN')}, R: ${rate}%, T: ${time.toFixed(2)} Yrs (Earned: ₹${earned.toFixed(2)})`
      );
      lastLoggedRef.current = paramKey;
    }, 1800);

    return () => clearTimeout(handler);
  }, [p, r, computedYears]);

  useEffect(() => {
    calculate();
  }, [p, r, computedYears]);

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      {/* 📈 TITLE CARD */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">Simple Interest</h2>
            <p className="text-xs text-gray-400">Basic linear interest with Start & End Dates</p>
          </div>
        </div>
      </Card>

      {/* 📊 INPUT CONTROLS */}
      <Card>
        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-emerald-400" />
          Linear Rate Engine
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block">Principal (₹)</label>
            <Input placeholder="Principal ₹" value={p} onChange={(e) => setP(e.target.value)} type="number" />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block flex items-center gap-1">
              <Percent className="w-3 h-3" /> Annual Interest Rate (%)
            </label>
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

          <Button text="Calculate Simple Interest" onClick={handleCalculateClick} />
        </div>
      </Card>

      {/* 📊 RESULT CARD */}
      <Card>
        <div className="space-y-4 py-1 text-center">
          <div className="grid grid-cols-2 gap-4 divide-x divide-white/5">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Simple Interest Earned</div>
              <h4 className="text-lg font-black text-emerald-400">
                ₹ {parseFloat(resultInterest).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Original Principal</div>
              <h4 className="text-lg font-black text-gray-300">
                ₹ {p && !isNaN(parseFloat(p)) ? parseFloat(p).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </h4>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-4">
            <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Projected Total Amount</div>
            <h2 className="text-3xl font-black text-emerald-400">
              ₹ {parseFloat(resultTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
}
