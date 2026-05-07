import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  IndianRupee, 
  TrendingUp, 
  Percent, 
  ArrowRightLeft, 
  Calculator, 
  Tag, 
  Wallet,
  Save,
  History as HistoryIcon
} from "lucide-react";

export default function FinanceHub() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 pb-32 max-w-md mx-auto space-y-6"
      id="finance-hub"
    >
      {/* HEADER */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="rounded-[2.5rem] p-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-2 text-slate-900 dark:text-white">
          <div className="p-2.5 rounded-2xl text-white shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Finance <span className="text-blue-500">Hub</span>
          </h1>
        </div>
        <p className="text-xs font-medium opacity-60 uppercase tracking-widest leading-none dark:text-white/60">
          Smart Financial Intelligence
        </p>

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />
      </motion.div>

      <RateConverter />
      <InterestPlanner />
      <CompoundInterest />
      <EMICalculator />
      <DiscountCalculator />
    </motion.div>
  );
}

const saveFinance = async (type: string, inputs: any, result: any) => {
  try {
    await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, inputs, result }),
    });
  } catch (error) {
    console.error("Failed to save finance record:", error);
  }
};

//////////////////////////////
// 🔹 RATE CONVERTER
//////////////////////////////
function RateConverter() {
  const [percent, setPercent] = useState("");
  const pVal = parseFloat(percent) || 0;
  
  // Logic: 12% Per Annum = 1 Rupee (1% per month)
  // Value in Rupees = percent / 12
  const rupeeVal = pVal / 12;
  const isRupee = rupeeVal >= 1;
  const displayVal = isRupee 
    ? `${rupeeVal.toFixed(2)} Rupee` 
    : `${(rupeeVal * 100).toFixed(0)} Paise`;

  return (
    <div className="card-finance">
      <h2 className="title-finance flex items-center gap-2">
        <Percent className="w-4 h-4 text-blue-500" />
        Rate Converter
      </h2>

      <input
        type="number"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
        placeholder="Enter percentage (%)"
        className="input-finance"
      />

      <div className="flex justify-center text-blue-500">
        <ArrowRightLeft className="w-6 h-6 rotate-90" />
      </div>

      <div className="result-finance bg-gradient-to-br from-blue-600 to-blue-800">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Interest Equivalence</span>
        <span className="text-2xl font-black">{percent ? displayVal : "0 Paise"}</span>
        <span className="text-[10px] opacity-50 block mt-1">(Per ₹100 Monthly)</span>
      </div>
    </div>
  );
}

//////////////////////////////
// 🔹 INTEREST PLANNER
//////////////////////////////
function InterestPlanner() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");

  const interest =
    amount && rate && time
      ? ((parseFloat(amount) * parseFloat(rate) * parseFloat(time)) / 100).toFixed(2)
      : "0.00";

  return (
    <div className="card-finance">
      <h2 className="title-finance flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        Interest Planner
      </h2>

      <div className="space-y-4">
        <Input label="Principal (₹)" value={amount} onChange={setAmount} />
        <Input label="Interest Rate (%)" value={rate} onChange={setRate} />
        <Input label="Time (years)" value={time} onChange={setTime} />
      </div>

      <div className="result-finance">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Simple Interest</span>
        <span className="text-2xl font-black">₹ {parseFloat(interest).toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => saveFinance("Simple Interest", { amount, rate, time }, interest)}
        className="chip-finance w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

//////////////////////////////
// 🔹 COMPOUND INTEREST
//////////////////////////////
function CompoundInterest() {
  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [t, setT] = useState("");

  const amount =
    p && r && t
      ? (parseFloat(p) * Math.pow(1 + parseFloat(r) / 100, parseFloat(t))).toFixed(2)
      : "0.00";

  return (
    <div className="card-finance">
      <h2 className="title-finance flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-500" />
        Compound Interest
      </h2>

      <div className="space-y-4">
        <Input label="Principal (₹)" value={p} onChange={setP} />
        <Input label="Rate (%)" value={r} onChange={setR} />
        <Input label="Time (years)" value={t} onChange={setT} />
      </div>

      <div className="result-finance bg-gradient-to-br from-indigo-600 to-purple-800">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Future Value</span>
        <span className="text-2xl font-black">₹ {parseFloat(amount).toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => saveFinance("Compound Interest", { p, r, t }, amount)}
        className="chip-finance w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

//////////////////////////////
// 🔹 EMI CALCULATOR
//////////////////////////////
function EMICalculator() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const r = parseFloat(rate) / 12 / 100;
  const n = parseFloat(months);

  const emi =
    loan && rate && months
      ? (
          (parseFloat(loan) * r * Math.pow(1 + r, n)) /
          (Math.pow(1 + r, n) - 1)
        ).toFixed(2)
      : "0.00";

  return (
    <div className="card-finance">
      <h2 className="title-finance flex items-center gap-2">
        <Wallet className="w-4 h-4 text-blue-600" />
        EMI Calculator
      </h2>

      <div className="space-y-4">
        <Input label="Loan Amount (₹)" value={loan} onChange={setLoan} />
        <Input label="Interest Rate (%)" value={rate} onChange={setRate} />
        <Input label="Tenure (months)" value={months} onChange={setMonths} />
      </div>

      <div className="result-finance">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Monthly EMI</span>
        <span className="text-2xl font-black">₹ {parseFloat(emi).toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => saveFinance("EMI", { loan, rate, months }, emi)}
        className="chip-finance w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

//////////////////////////////
// 🔹 DISCOUNT CALCULATOR
//////////////////////////////
function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const final =
    price && discount
      ? (parseFloat(price) - (parseFloat(price) * parseFloat(discount)) / 100).toFixed(2)
      : "0.00";

  return (
    <div className="card-finance">
      <h2 className="title-finance flex items-center gap-2">
        <Tag className="w-4 h-4 text-emerald-500" />
        Discount Calculator
      </h2>

      <div className="space-y-4">
        <Input label="Original Price (₹)" value={price} onChange={setPrice} />
        <Input label="Discount (%)" value={discount} onChange={setDiscount} />

        <div className="flex gap-2">
          {[10, 20, 50].map((d) => (
            <button
              key={d}
              onClick={() => setDiscount(d.toString())}
              className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-xs font-bold hover:bg-blue-500 hover:text-white transition-all border border-slate-200 dark:border-white/5"
            >
              {d}%
            </button>
          ))}
        </div>
      </div>

      <div className="result-finance bg-gradient-to-br from-emerald-500 to-teal-700">
        <span className="text-[10px] uppercase tracking-widest opacity-70 block mb-1">Final Price</span>
        <span className="text-2xl font-black">₹ {parseFloat(final).toLocaleString('en-IN')}</span>
      </div>

      <button
        onClick={() => saveFinance("Discount", { price, discount }, final)}
        className="chip-finance w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function Input({ label, value, onChange }: InputProps) {
  return (
    <div className="group">
      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 text-slate-900 dark:text-white transition-opacity group-focus-within:opacity-100">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="input-finance"
      />
    </div>
  );
}
