import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  IndianRupee, 
  TrendingUp, 
  Percent, 
  ArrowRightLeft, 
  Tag, 
  Wallet,
  Save,
  Landmark,
  ShieldCheck,
  History,
  Trash2
} from "lucide-react";
import Card3D from "../../components/ui/3DCard";
import Icon3D from "../../components/ui/3DIcon";
import InputUI from "../../components/ui/MotionInput";
import Button from "../../components/ui/MotionButton";
import { num } from "../../utils/helpers";
import { saveFinanceRecord, subscribeToFinance, deleteFinanceRecord } from "../../services/financeService";

export default function FinanceHub() {
  const [records, setRecords] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsub = subscribeToFinance((data) => {
      setRecords(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <Card3D className="relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Icon3D icon={<Landmark className="w-6 h-6" />} color="from-blue-500 to-indigo-600" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                Finance Hub
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                Quantum Accounting v3.0
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-2xl transition-all ${showHistory ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </Card3D>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card3D className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Transmissions</h3>
                <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[8px] font-black">{records.length} RECORDS</span>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                {records.length === 0 ? (
                  <p className="text-center py-8 text-xs opacity-30 italic">No records found in local matrix.</p>
                ) : (
                  records.map(r => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{r.type}</p>
                        <p className="text-sm font-bold">₹ {r.result}</p>
                      </div>
                      <button 
                         onClick={() => deleteFinanceRecord(r.id)}
                         className="p-2 text-red-500/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card3D>
          </motion.div>
        )}
      </AnimatePresence>

      <RateConverter />
      <DateInterestPlanner />
      <InterestPlanner />
      <CompoundInterest />
      <EMICalculator />
      <DiscountCalculator />
    </div>
  );
}

const saveFinance = async (type: string, inputs: any, result: any) => {
  try {
    await saveFinanceRecord({ type, inputs, result: String(result) });
  } catch (error) {
    console.error("Failed to save finance record:", error);
  }
};

function RateConverter() {
  const [percent, setPercent] = useState("");
  const pVal = num(percent);
  
  const rupeeVal = pVal / 12;
  const isRupee = rupeeVal >= 1;
  const displayVal = isRupee 
    ? `${rupeeVal.toFixed(2)} Rupee` 
    : `${(rupeeVal * 100).toFixed(0)} Paise`;

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <Percent className="w-4 h-4 text-blue-500" />
        Rate Converter
      </h2>

      <InputUI
        type="number"
        value={percent}
        setValue={setPercent}
        placeholder="Enter percentage (%)"
      />

      <div className="flex justify-center text-blue-500">
        <ArrowRightLeft className="w-6 h-6 rotate-90 opacity-50" />
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Interest Equivalence</span>
        <span className="text-2xl font-black">{percent ? displayVal : "0 Paise"}</span>
        <span className="text-[10px] opacity-50 block mt-1">(Per ₹100 Monthly)</span>
      </div>
    </Card3D>
  );
}

function DateInterestPlanner() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const getDuration = () => {
    if (!start || !end) return { years: 0, months: 0, days: 0, totalYears: 0 };

    const s = new Date(start);
    const e = new Date(end);

    if (e < s) return { years: 0, months: 0, days: 0, totalYears: 0 };

    let years = e.getFullYear() - s.getFullYear();
    let months = e.getMonth() - s.getMonth();
    let days = e.getDate() - s.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diff = e.getTime() - s.getTime();
    const totalYears = diff / (1000 * 60 * 60 * 24 * 365.25);

    return { years, months, days, totalYears };
  };

  const dur = getDuration();
  const interest = num(p) && num(r) && dur.totalYears > 0
    ? (num(p) * num(r) * dur.totalYears / 100).toFixed(2)
    : "0.00";

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-pink-500" />
        Horizon Planner
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Principal (₹)</label>
            <InputUI value={p} setValue={setP} type="number" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Rate (%)</label>
            <InputUI value={r} setValue={setR} type="number" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Start Bound</label>
            <InputUI value={start} setValue={setStart} type="date" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">End Bound</label>
            <InputUI value={end} setValue={setEnd} type="date" />
          </div>
        </div>
      </div>

      {start && end && (
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-center">
          Epoch Duration: {dur.years}Y {dur.months}M {dur.days}D
        </div>
      )}

      <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-800 text-white shadow-lg">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Quantum Interest</span>
        <span className="text-2xl font-black">₹ {parseFloat(interest).toLocaleString('en-IN')}</span>
      </div>

      <Button onClick={() => saveFinance("Horizon Interest", { p, r, start, end }, interest)}>
        <span className="flex items-center justify-center gap-2 text-[10px]">
          <Save className="w-4 h-4" /> SAVE RECORD
        </span>
      </Button>
    </Card3D>
  );
}

function InterestPlanner() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");

  const totalTimeInYears = num(years) + num(months) / 12 + num(days) / 365;

  const interest =
    num(amount) && num(rate) && totalTimeInYears > 0
      ? ((num(amount) * num(rate) * totalTimeInYears) / 100).toFixed(2)
      : "0.00";

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        Interest Planner
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Principal (₹)</label>
          <InputUI value={amount} setValue={setAmount} type="number" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Interest Rate (%)</label>
          <InputUI value={rate} setValue={setRate} type="number" />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Time Duration</label>
          <div className="grid grid-cols-3 gap-2">
            <InputUI value={years} setValue={setYears} placeholder="YY" type="number" />
            <InputUI value={months} setValue={setMonths} placeholder="MM" type="number" />
            <InputUI value={days} setValue={setDays} placeholder="DD" type="number" />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 dark:bg-black text-white shadow-lg border border-white/5">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Simple Interest</span>
        <span className="text-2xl font-black">₹ {parseFloat(interest).toLocaleString('en-IN')}</span>
      </div>

      <Button onClick={() => saveFinance("Simple Interest", { amount, rate, years, months, days }, interest)}>
        <span className="flex items-center justify-center gap-2 text-[10px]">
          <Save className="w-4 h-4" /> SAVE RECORD
        </span>
      </Button>
    </Card3D>
  );
}

function CompoundInterest() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [days, setDays] = useState("");

  const totalTimeInYears = num(years) + num(months) / 12 + num(days) / 365;

  const amount =
    num(p) && num(r) && totalTimeInYears > 0
      ? (num(p) * Math.pow(1 + num(r) / 100, totalTimeInYears)).toFixed(2)
      : "0.00";

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-500" />
        Compound Interest
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Principal (₹)</label>
          <InputUI value={p} setValue={setP} type="number" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Rate (%)</label>
          <InputUI value={r} setValue={setR} type="number" />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Time Duration</label>
          <div className="grid grid-cols-3 gap-2">
            <InputUI value={years} setValue={setYears} placeholder="YY" type="number" />
            <InputUI value={months} setValue={setMonths} placeholder="MM" type="number" />
            <InputUI value={days} setValue={setDays} placeholder="DD" type="number" />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-lg">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Future Value</span>
        <span className="text-2xl font-black">₹ {parseFloat(amount).toLocaleString('en-IN')}</span>
      </div>

      <Button onClick={() => saveFinance("Compound Interest", { p, r, years, months, days }, amount)}>
        <span className="flex items-center justify-center gap-2 text-[10px]">
          <Save className="w-4 h-4" /> SAVE RECORD
        </span>
      </Button>
    </Card3D>
  );
}

function EMICalculator() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const rateVal = num(rate) / 12 / 100;
  const n = num(months);

  const emi =
    num(loan) && num(rate) && n > 0
      ? (
          (num(loan) * rateVal * Math.pow(1 + rateVal, n)) /
          (Math.pow(1 + rateVal, n) - 1)
        ).toFixed(2)
      : "0.00";

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <Wallet className="w-4 h-4 text-blue-600" />
        EMI Calculator
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Loan Amount (₹)</label>
          <InputUI value={loan} setValue={setLoan} type="number" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Rate (%)</label>
          <InputUI value={rate} setValue={setRate} type="number" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Months</label>
          <InputUI value={months} setValue={setMonths} type="number" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg border border-white/5">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Monthly EMI</span>
        <span className="text-2xl font-black">₹ {parseFloat(emi).toLocaleString('en-IN')}</span>
      </div>

      <Button onClick={() => saveFinance("EMI", { loan, rate, months }, emi)}>
        <span className="flex items-center justify-center gap-2 text-[10px]">
          <Save className="w-4 h-4" /> SAVE RECORD
        </span>
      </Button>
    </Card3D>
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const final =
    num(price) && num(discount)
      ? (num(price) - (num(price) * num(discount)) / 100).toFixed(2)
      : "0.00";

  return (
    <Card3D className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
        <Tag className="w-4 h-4 text-emerald-500" />
        Discount Calculator
      </h2>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Original Price (₹)</label>
          <InputUI value={price} setValue={setPrice} type="number" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Discount (%)</label>
          <InputUI value={discount} setValue={setDiscount} type="number" />
        </div>

        <div className="flex gap-2">
          {[10, 20, 50].map((d) => (
            <button
              key={d}
              onClick={() => setDiscount(d.toString())}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-xs font-bold hover:bg-blue-500 hover:text-white transition-all border border-slate-200 dark:border-white/5"
            >
              {d}%
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Final Price</span>
        <span className="text-2xl font-black">₹ {parseFloat(final).toLocaleString('en-IN')}</span>
      </div>

      <Button onClick={() => saveFinance("Discount", { price, discount }, final)}>
        <span className="flex items-center justify-center gap-2 text-[10px]">
          <Save className="w-4 h-4" /> SAVE RECORD
        </span>
      </Button>
    </Card3D>
  );
}
