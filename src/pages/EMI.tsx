import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveHistory } from '../lib/historyUtils';
import { CreditCard, ShieldCheck, Landmark, Percent, Calendar } from 'lucide-react';

export default function EMI() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState<string>("0.00");
  const [totalInterest, setTotalInterest] = useState<string>("0.00");
  const [totalPayment, setTotalPayment] = useState<string>("0.00");

  const calculateEMI = () => {
    const P = parseFloat(loan) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const N = parseFloat(months) || 0;

    if (P > 0 && r > 0 && N > 0) {
      const emiCalculated = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      const totalPay = emiCalculated * N;
      const totalInt = totalPay - P;

      setEmi(emiCalculated.toFixed(2));
      setTotalPayment(totalPay.toFixed(2));
      setTotalInterest(totalInt.toFixed(2));
    } else {
      setEmi("0.00");
      setTotalPayment("0.00");
      setTotalInterest("0.00");
    }
  };

  const handleCalculateClick = () => {
    calculateEMI();
    const P = parseFloat(loan) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const N = parseFloat(months) || 0;

    if (P > 0 && r > 0 && N > 0) {
      const emiCalculated = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      saveHistory(
        'EMI Loan Calculation',
        emiCalculated,
        `Principal: ₹${P.toLocaleString('en-IN')}, Rate: ${rate}%, Tenure: ${N} Months (Total Pay: ₹${(emiCalculated * N).toFixed(2)})`
      );
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [loan, rate, months]);

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      {/* 💳 TITLE CARD */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/10">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">EMI Calculator</h2>
            <p className="text-xs text-gray-400">Calculate Equated Monthly Installments for loans</p>
          </div>
        </div>
      </Card>

      {/* 📊 INPUT CONTROLS */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-cyan-400" />
              Loan Amount / Principal (₹)
            </label>
            <Input placeholder="e.g., 500000" value={loan} onChange={(e) => setLoan(e.target.value)} type="number" />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block flex items-center gap-1.5 border-white/5">
              <Percent className="w-3.5 h-3.5 text-cyan-400" />
              Interest Rate (Annual % )
            </label>
            <Input placeholder="e.g., 8.5" value={rate} onChange={(e) => setRate(e.target.value)} type="number" />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Tenure (Months)
            </label>
            <Input placeholder="e.g., 60" value={months} onChange={(e) => setMonths(e.target.value)} type="number" />
          </div>

          <Button text="Calculate EMI" onClick={handleCalculateClick} />
        </div>
      </Card>

      {/* 📊 RESULTS BREAKDOWN */}
      <Card>
        <div className="space-y-4 text-center">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
              Monthly EMI Amount
            </div>
            <h2 className="text-3xl font-black text-cyan-400">
              ₹ {parseFloat(emi).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 divide-x divide-white/5">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Total Interest</div>
              <h4 className="text-md font-bold text-gray-200">
                ₹ {parseFloat(totalInterest).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Total Payment</div>
              <h4 className="text-md font-bold text-gray-200">
                ₹ {parseFloat(totalPayment).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
