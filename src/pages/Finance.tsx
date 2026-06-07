import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { annualToMonthlyRate, monthlyToAnnualRate, formatIndianCurrency, formatIndianShorthand } from '../lib/financeUtils';
import { saveHistory } from '../lib/historyUtils';
import { ArrowRightLeft, Calculator, TrendingUp, Coins, Save, Check, RefreshCw, Sparkles, HelpCircle, Calendar, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/haptic';
import { jsPDF } from 'jspdf';

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
        <h3 className="text-sm font-bold flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
          Rural ⇋ Bank Rate Converter
        </h3>
        <button
          onClick={() => {
            triggerHaptic('medium');
            setMode(prev => prev === 'pctToRs' ? 'rsToPct' : 'pctToRs');
            setInputVal('');
          }}
          className="text-[10px] bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl text-[#60a5fa] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/5 active:scale-95"
        >
          {mode === 'pctToRs' ? 'Rs/Month ⇋ %' : '% ⇋ Rs/Month'}
        </button>
      </div>

      <div className="space-y-4 font-mono">
        <div>
          <label className="text-[10px] text-gray-400 font-bold mb-1.5 block uppercase tracking-[0.15em]">
            {mode === 'pctToRs' ? 'Annual Percentage Rate (%)' : 'Rural Monthly Rate (₹ per ₹100)'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs select-none">
              {mode === 'pctToRs' ? '%' : '₹'}
            </span>
            <input
              type="number"
              placeholder={mode === 'pctToRs' ? "e.g., 12" : "e.g., 1.5"}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 pl-9 text-xs font-bold text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
            />
          </div>
        </div>

        {converted && (
          <div className="p-4 bg-[#22c55e]/5 border border-[#22c55e]/15 rounded-xl text-center">
            <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Equivalent Exchange Rate</span>
            <div className="text-lg font-extrabold text-white mt-1">
              {mode === 'pctToRs' && parseFloat(converted.value) >= 1 ? '₹' : ''}
              {converted.value} <span className="text-[10px] font-semibold text-gray-400 uppercase ml-1 font-mono">{converted.unit}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------- Date-to-Date Interest Calculator ---------- */
function InterestByDates() {
  const [p, setP] = useState<number>(100000);
  const [rateType, setRateType] = useState<'annual' | 'rural'>('rural'); // rural is ₹ per month per ₹100
  const [r, setR] = useState<number>(2); // 2%/month rural default
  const [mode, setMode] = useState<'SI' | 'CI'>('SI'); // simple interest is standard
  
  // Dates
  const [startStr, setStartStr] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1); // 1 year ago default
    return d.toISOString().split('T')[0];
  });
  const [endStr, setEndStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [dur, setDur] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  useEffect(() => {
    if (!startStr || !endStr) {
      setDur(null);
      return;
    }
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      setDur(null);
      return;
    }

    // Precise count
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setDur({ years, months, days, totalDays });
  }, [startStr, endStr]);

  // Calculations
  let interest = 0;
  let totalTimeInYears = 0;
  let textTime = '';

  if (dur) {
    totalTimeInYears = dur.totalDays / 365.25;
    
    // Construct readable text time
    const parts = [];
    if (dur.years > 0) parts.push(`${dur.years} Yr${dur.years > 1 ? 's' : ''}`);
    if (dur.months > 0) parts.push(`${dur.months} Mo${dur.months > 1 ? 's' : ''}`);
    if (dur.days > 0) parts.push(`${dur.days} Day${dur.days > 1 ? 's' : ''}`);
    textTime = parts.join(', ') || '0 Days';

    // Rate calculations
    // If rural rate (₹ per month per ₹100), it's equivalent to (r * 12)% per annum
    const annualRate = rateType === 'rural' ? r * 12 : r;

    if (mode === 'SI') {
      interest = (p * annualRate * totalTimeInYears) / 100;
    } else {
      interest = p * Math.pow(1 + annualRate / 100, totalTimeInYears) - p;
    }
  }

  const total = p + interest;

  // Manual save
  const [manualSaved, setManualSaved] = useState(false);
  const handleManualSave = () => {
    if (!dur || p <= 0 || r <= 0) return;
    triggerHaptic('success');
    saveHistory(
      'Date-to-Date Interest',
      total,
      `Pr: ${formatIndianCurrency(p)}, Rate: ${r}% (${rateType === 'rural' ? 'Rural' : 'Annual'}), Time: ${dur.totalDays} Days (${mode === 'CI' ? 'Compound' : 'Simple'})`
    );
    setManualSaved(true);
    setTimeout(() => setManualSaved(false), 2000);
  };

  const handleShare = () => {
    triggerHaptic('medium');
    const shareText = `Date-to-Date Interest Calculation on CalHub:
- Principal: ₹${p.toLocaleString('en-IN')}
- Mode: ${mode === 'CI' ? 'Compound Interest' : 'Simple Interest'} (${rateType === 'rural' ? 'Rural Rate' : 'Annual Rate'})
- Interest Rate: ${r}${rateType === 'rural' ? ' ₹/month/₹100' : '% annual'}
- Duration: ${textTime} (${dur?.totalDays} Days)
- Interest Earned: ₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
- Projected Future Value: ₹${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    if (navigator.share) {
      navigator.share({
        title: "CalHub Interest Result",
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Results copied to your clipboard!");
    }
  };

  const handleExportPDF = () => {
    triggerHaptic('success');
    const doc = new jsPDF();
    
    // Custom styled PDF layout
    doc.setFillColor(15, 23, 42); // slate background color for headers
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("CALHUB FINANCE REPORT", 14, 25);
    doc.setFontSize(10);
    doc.text("Premium Financial Calculators", 14, 33);
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("Date-to-Date Interest Statement", 14, 55);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 60, 196, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Principal Amount: Rs. ${p.toLocaleString('en-IN')}`, 14, 75);
    doc.text(`Interest Rate: ${r}${rateType === 'rural' ? ' Paise/Rs/Month' : '% Annual'}`, 14, 85);
    doc.text(`Calculation Mode: ${mode === 'CI' ? 'Compound Interest' : 'Simple Interest'}`, 14, 95);
    doc.text(`Duration: ${textTime} (${dur?.totalDays} Days)`, 14, 105);
    doc.text(`Dates: From ${startStr} to ${endStr}`, 14, 115);
    
    doc.setDrawColor(34, 197, 94);
    doc.line(14, 125, 196, 125);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Interest Amount: Rs. ${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 14, 140);
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`Total Projected Value: Rs. ${total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 14, 155);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated securely via CalHub mobile application", 14, 280);
    
    doc.save(`calhub-interest-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* INSTRUCTIONAL TIP */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide font-sans">Date-to-Date Interest Calculator</h4>
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
            Calculate precise day-by-day interest for modern accounts or customary village accounts (₹ per ₹100 per month).
          </p>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6 block">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#8fa3c7] font-mono flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Interest Parameters
          </h3>

          {/* Compound / Simple Toggle switch */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 select-none font-mono mt-2 sm:mt-0">
            <button 
              type="button"
              onClick={() => { triggerHaptic('light'); setMode('SI'); }} 
              className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                mode === 'SI' ? 'bg-indigo-600 text-white font-black' : 'text-[#8fa3c7] hover:text-white'
              }`}
            >
              Simple
            </button>
            <button 
              type="button"
              onClick={() => { triggerHaptic('light'); setMode('CI'); }} 
              className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                mode === 'CI' ? 'bg-indigo-600 text-white font-black' : 'text-[#8fa3c7] hover:text-white'
              }`}
            >
              Compound
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Principal Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em]">Principal Amount</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 max-w-[150px] shadow-inner">
                <span className="text-gray-500 font-bold font-mono text-xs mr-1">₹</span>
                <input
                  type="number"
                  value={p === 0 ? '' : p}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setP(isNaN(val) ? 0 : val);
                  }}
                  placeholder="e.g. 10000"
                  className="bg-transparent text-white font-mono font-bold text-xs w-full outline-none text-right"
                  min="0"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="2000000"
              step="1000"
              value={p > 2000000 ? 2000000 : p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono"
            />
          </div>

          {/* Rate Input & Type Switch */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-[#8fa3c7] uppercase tracking-[0.2em]">Interest Rate</label>
                <div className="flex bg-white/5 px-1.5 py-0.5 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setRateType('rural'); setR(2); }}
                    className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${rateType === 'rural' ? 'bg-indigo-500/20 text-indigo-400 font-black' : 'text-gray-400'}`}
                  >
                    Rural (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setRateType('annual'); setR(12); }}
                    className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${rateType === 'annual' ? 'bg-indigo-500/20 text-indigo-400 font-black' : 'text-gray-400'}`}
                  >
                    Annual (%)
                  </button>
                </div>
              </div>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 max-w-[110px] shadow-inner">
                <input
                  type="number"
                  value={r === 0 ? '' : r}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setR(isNaN(val) ? 0 : val);
                  }}
                  placeholder="0"
                  className="bg-transparent text-white font-mono font-bold text-xs w-full outline-none text-right mr-1"
                  min="0.1"
                  step="0.1"
                />
                <span className="text-[#8fa3c7] font-black text-[10px] font-mono">
                  {rateType === 'rural' ? '₹' : '%'}
                </span>
              </div>
            </div>
            
            <p className="text-[9px] text-gray-500 font-mono italic">
              {rateType === 'rural' 
                ? `₹${r} per month for every ₹100 principal (equivalent to ${r * 12}% per annum)`
                : `${r}% interest per annum`
              }
            </p>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold mb-1.5 block uppercase tracking-[0.1em]">Start Date</label>
              <input
                type="date"
                value={startStr}
                onChange={(e) => setStartStr(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/5 rounded-xl px-3 text-xs font-bold text-white outline-none focus:border-indigo-500/30 transition-all font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold mb-1.5 block uppercase tracking-[0.1em]">End Date</label>
              <input
                type="date"
                value={endStr}
                onChange={(e) => setEndStr(e.target.value)}
                className="w-full h-11 bg-white/5 border border-white/5 rounded-xl px-3 text-xs font-bold text-white outline-none focus:border-indigo-500/30 transition-all font-mono"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* DYNAMIC RESULTS BOARD */}
      {dur ? (
        <div className="premium-card rounded-[22px] p-6 space-y-6 flex flex-col justify-between border-white/5 relative overflow-hidden font-mono">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="text-center bg-white/5 p-3.5 rounded-2xl border border-white/5">
              <span className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.2em] block">Calculated Duration</span>
              <h4 className="text-xs font-black text-[#89a5f7] mt-1">{textTime}</h4>
              <p className="text-[9px] text-gray-500 mt-0.5">{dur.totalDays} Total Days elapsed</p>
            </div>

            <div className="grid grid-cols-2 gap-4 divide-x divide-white/5 text-center">
              <div>
                <span className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.2em] block">Principal Amount</span>
                <h4 className="text-[15px] font-black text-gray-300 mt-1 italic tracking-tight">{formatIndianCurrency(p)}</h4>
              </div>
              <div>
                <span className="text-[9px] font-black text-[#8fa3c7] uppercase tracking-[0.2em] block">Interest Earned</span>
                <h4 className="text-[15px] font-black text-emerald-400 mt-1 italic tracking-tight">+{formatIndianCurrency(interest)}</h4>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Projected Future Value</span>
              <h2 className="text-3xl font-black text-[#22c55e] tracking-tighter italic mt-1 drop-shadow-[0_0_15px_rgba(34,197,148,0.2)]">
                {formatIndianCurrency(total)}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleManualSave}
            className={`w-full mt-2 h-12 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border transition-all ${
              manualSaved 
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                : 'bg-indigo-600/10 border-indigo-500/20 text-[#89a5f7] hover:bg-indigo-600 hover:text-white hover:border-transparent active:scale-95 cursor-pointer shadow-md'
            }`}
          >
            {manualSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {manualSaved ? 'Saved to Ledger ✓' : 'Save To Local History'}
          </button>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={handleShare}
              className="h-11 bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 font-black rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              Share
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="h-11 bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 font-black rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center">
          <HelpCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-mono">Please enter a valid Start and End Date</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Finance Hub (Rate Converter & Interest by Dates) ---------- */
export default function Finance() {
  return (
    <div className="container animate-in fade-in duration-350 space-y-8 pb-10">
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          Finance Calculator
        </h2>
        <p className="text-xs text-gray-400">
          Convert rural to bank interest rates and calculate precise interest by custom dates.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <TraditionalConverter />
        </div>

        <hr className="border-white/5" />

        <div className="space-y-6">
          <InterestByDates />
        </div>
      </div>
    </div>
  );
}
