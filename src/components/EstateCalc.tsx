import React, { useState } from 'react';
import { RotateCcw, Save, Home, Landmark, Calculator, Receipt, DollarSign, ListOrdered, Calendar } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface EstateCalcProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

type EstateSubTab = 'mortgage' | 'stamp' | 'afford';

export default function EstateCalc({ currency, onSaveHistory }: EstateCalcProps) {
  const [subTab, setSubTab] = useState<EstateSubTab>('mortgage');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // --- MORTGAGE (EMI) STATES ---
  const [propertyPrice, setPropertyPrice] = useState<number>(350000);
  const [downPercent, setDownPercent] = useState<number>(20); // downpayment percentage
  const [loanRate, setLoanRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30); // years

  // Calculations for Mortgage
  const downPayment = (propertyPrice * downPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  const isRateZero = loanRate === 0;
  const r = (loanRate / 100) / 12; // monthly rate
  const n = loanTerm * 12; // total payments
  
  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyEmi = isRateZero || loanAmount <= 0
    ? (n > 0 ? loanAmount / n : 0)
    : loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalMortgagePayment = monthlyEmi * n;
  const totalInterest = totalMortgagePayment - loanAmount;

  // --- STAMP DUTY STATES ---
  const [stampPropertyPrice, setStampPropertyPrice] = useState<number>(350000);
  const [stampDutyRate, setStampDutyRate] = useState<number>(5.0); // % stamp duty
  const [registrationRate, setRegistrationRate] = useState<number>(1.0); // % registration fee
  const [legalFlatFee, setLegalFlatFee] = useState<number>(1500);

  // Calculations for Stamp
  const stampDutyCost = (stampPropertyPrice * stampDutyRate) / 100;
  const registrationCost = (stampPropertyPrice * registrationRate) / 100;
  const totalClosingCost = stampDutyCost + registrationCost + legalFlatFee;
  const finalPurchaseCost = stampPropertyPrice + totalClosingCost;

  // --- AFFORDABILITY STATES ---
  const [monthlyIncome, setMonthlyIncome] = useState<number>(8500);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(600);
  const [affordRate, setAffordRate] = useState<number>(6.5);
  const [affordDown, setAffordDown] = useState<number>(50000);
  const [dtiLimit, setDtiLimit] = useState<number>(36); // standard max debt-to-income %

  // Calculations for Affordability
  const maxMonthlyHousingDebt = (monthlyIncome * dtiLimit) / 100 - monthlyDebts;
  const monthlyEmiBudget = Math.max(0, maxMonthlyHousingDebt);
  
  // Back-calculate principal from maximum monthly payment budget: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const affordTermInMonths = 30 * 12; // Standard 30 yr term
  const monthlyR = (affordRate / 100) / 12;
  const maxAffordablePrincipal = monthlyR === 0
    ? (monthlyEmiBudget * affordTermInMonths)
    : monthlyEmiBudget * (Math.pow(1 + monthlyR, affordTermInMonths) - 1) / (monthlyR * Math.pow(1 + monthlyR, affordTermInMonths));

  const maxAffordableProperty = maxAffordablePrincipal + affordDown;

  const handleSave = () => {
    let inputs: Record<string, any> = {};
    let outputs: Record<string, any> = {};
    let saveTitle = 'Estate - ';

    if (subTab === 'mortgage') {
      saveTitle += 'Mortgage EMI';
      inputs = { propertyPrice, downPercent, loanRate, loanTerm };
      outputs = { loanAmount, downPayment, monthlyEmi, totalInterest, totalMortgagePayment };
    } else if (subTab === 'stamp') {
      saveTitle += 'Stamp Duty & Buying Cost';
      inputs = { stampPropertyPrice, stampDutyRate, registrationRate, legalFlatFee };
      outputs = { stampDutyCost, registrationCost, totalClosingCost, finalPurchaseCost };
    } else {
      saveTitle += 'Purchase Affordability';
      inputs = { monthlyIncome, monthlyDebts, affordRate, dtiLimit, affordDown };
      outputs = { monthlyEmiBudget, maxAffordableProperty, maxAffordablePrincipal };
    }

    onSaveHistory({
      type: 'estate',
      title: saveTitle,
      inputs,
      outputs,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Nav: Mortgage, Stamp, Affordability */}
      <div className="flex bg-gray-150 p-1 rounded-xl shadow-2xs text-xs font-semibold max-w-lg">
        <button
          onClick={() => {
            setSubTab('mortgage');
            setIsSaved(false);
          }}
          className={cn(
            "flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
            subTab === 'mortgage' ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
          )}
        >
          <Home className="w-4 h-4" />
          Mortgage EMI
        </button>
        <button
          onClick={() => {
            setSubTab('stamp');
            setIsSaved(false);
          }}
          className={cn(
            "flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
            subTab === 'stamp' ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
          )}
        >
          <Receipt className="w-4 h-4" />
          Stamp Duty / Fees
        </button>
        <button
          onClick={() => {
            setSubTab('afford');
            setIsSaved(false);
          }}
          className={cn(
            "flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
            subTab === 'afford' ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
          )}
        >
          <Calculator className="w-4 h-4" />
          Affordability
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANEL: Variables */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-650" />
              {subTab === 'mortgage' && 'Mortgage Parameters'}
              {subTab === 'stamp' && 'Acquisition Inputs'}
              {subTab === 'afford' && 'Income & Debt Parameters'}
            </h3>
            <button
              onClick={() => {
                if (subTab === 'mortgage') {
                  setPropertyPrice(350000);
                  setDownPercent(20);
                  setLoanRate(6.5);
                  setLoanTerm(30);
                } else if (subTab === 'stamp') {
                  setStampPropertyPrice(350000);
                  setStampDutyRate(5.0);
                  setRegistrationRate(1.0);
                  setLegalFlatFee(1500);
                } else {
                  setMonthlyIncome(8500);
                  setMonthlyDebts(600);
                  setAffordRate(6.5);
                  setAffordDown(50000);
                  setDtiLimit(36);
                }
                setIsSaved(false);
              }}
              className="text-gray-400 hover:text-indigo-600 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* 1. MORTGAGE EMI TAB VIEW */}
          {subTab === 'mortgage' && (
            <div className="space-y-4">
              {/* Prop Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Home/Property Price</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(propertyPrice, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={propertyPrice || ''}
                    onChange={(e) => {
                      setPropertyPrice(Math.max(0, parseFloat(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={propertyPrice}
                  onChange={(e) => {
                    setPropertyPrice(parseInt(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-indigo-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Down Payment % */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Down Payment Percentage</label>
                  <span className="text-sm font-semibold text-gray-800">{downPercent}% ({formatCurrency(downPayment, currency)})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={downPercent}
                  onChange={(e) => {
                    setDownPercent(parseInt(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-indigo-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Loan percentage rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Mortgage Interest Rate</label>
                  <span className="text-sm font-semibold text-gray-800">{loanRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => {
                    setLoanRate(parseFloat(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-indigo-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Mortgage Loan term */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Amortization Period (Tenure)</label>
                  <span className="text-sm font-semibold text-gray-800">{loanTerm} Years</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setLoanTerm(term);
                        setIsSaved(false);
                      }}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all text-center",
                        loanTerm === term
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {term} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. STAMP DUTY TAB VIEW */}
          {subTab === 'stamp' && (
            <div className="space-y-4">
              {/* Property pricing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Property Declared Price</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(stampPropertyPrice, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={stampPropertyPrice || ''}
                    onChange={(e) => {
                      setStampPropertyPrice(Math.max(0, parseFloat(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Stamp Duty rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Stamp Duty / Land Tax Rate</label>
                  <span className="text-sm font-semibold text-gray-800">{stampDutyRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.1"
                  value={stampDutyRate}
                  onChange={(e) => {
                    setStampDutyRate(parseFloat(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-indigo-650 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Registration charges */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Registration / Deed Fee</label>
                  <span className="text-sm font-semibold text-gray-800">{registrationRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={registrationRate}
                  onChange={(e) => {
                    setRegistrationRate(parseFloat(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-indigo-650 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Legal Fees */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Legal, Brokerage & Extras</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(legalFlatFee, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={legalFlatFee || ''}
                    onChange={(e) => {
                      setLegalFlatFee(Math.max(0, parseInt(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. HOUSING AFFORDABILITY VIEW */}
          {subTab === 'afford' && (
            <div className="space-y-4">
              {/* Monthly household income */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Total Monthly Income (Pre-tax)</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(monthlyIncome, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={monthlyIncome || ''}
                    onChange={(e) => {
                      setMonthlyIncome(Math.max(0, parseInt(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Monthly Debts */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Existing Debts (Auto, Cards, Loans)</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(monthlyDebts, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={monthlyDebts || ''}
                    onChange={(e) => {
                      setMonthlyDebts(Math.max(0, parseInt(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Saved Downpayment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Cash Reserved for Downpayment</label>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(affordDown, currency)}</span>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">{currency}</span>
                  </div>
                  <input
                    type="number"
                    value={affordDown || ''}
                    onChange={(e) => {
                      setAffordDown(Math.max(0, parseInt(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold"
                  />
                </div>
              </div>

              {/* Debt-To-Income slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Maximum Allowed DTI Margin</label>
                  <span className="text-sm font-semibold text-gray-800">{dtiLimit}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[28, 36, 43].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => {
                        setDtiLimit(limit);
                        setIsSaved(false);
                      }}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer",
                        dtiLimit === limit
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {limit}% {limit === 36 ? '(Standard)' : limit === 28 ? '(Strict)' : '(Aggressive)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Outputs & Visuals */}
        <div className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-650" />
              Calculated Breakdown
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          {/* 1. MORTGAGE OUTPUT DETAIL */}
          {subTab === 'mortgage' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50/20 border border-indigo-50 rounded-xl space-y-1">
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Estimated Monthly EMI</span>
                <p className="text-3xl font-black text-indigo-900 font-sans">{formatCurrency(monthlyEmi, currency)}</p>
                <span className="text-[10px] text-gray-400 block pt-0.5">Principal and Interest only</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5">Loan Principal</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(loanAmount, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5">Down Payment ({downPercent}%)</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(downPayment, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5">Cumulative Interest</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(totalInterest, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5">Total Payments</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(totalMortgagePayment, currency)}</p>
                </div>
              </div>

              {/* Amortized Graph ratio visual */}
              <div className="space-y-1 pt-1.5 border-t border-gray-100">
                <div className="flex justify-between text-[11px] font-semibold text-gray-400">
                  <span>Down Payment ({((paintRatio(downPayment, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                  <span>Principal ({((paintRatio(loanAmount, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                  <span>Interest ({((paintRatio(totalInterest, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-150">
                  <div className="bg-slate-300 h-full" style={{ width: `${Math.max(5, paintRatio(downPayment, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                  <div className="bg-indigo-400 h-full" style={{ width: `${Math.max(5, paintRatio(loanAmount, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                  <div className="bg-rose-450 h-full" style={{ width: `${Math.max(5, paintRatio(totalInterest, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STAMP DUTY OUTPUT DETAIL */}
          {subTab === 'stamp' && (
            <div className="space-y-5">
              <div className="p-4 bg-teal-50/20 border border-teal-55 rounded-xl space-y-1">
                <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Total Closing Costs & Fees</span>
                <p className="text-3xl font-black text-teal-900 font-sans">{formatCurrency(totalClosingCost, currency)}</p>
                <div className="text-[11px] text-gray-500 mt-1">
                  Adds <span className="font-bold text-gray-700">{((totalClosingCost / stampPropertyPrice) * 100).toFixed(1)}%</span> on top of purchase price.
                </div>
              </div>

              <div className="space-y-3 divide-y divide-gray-50 text-xs text-gray-650">
                <div className="flex justify-between py-1">
                  <span>Stamp Duty / Land Registration Tax ({stampDutyRate}%)</span>
                  <span className="font-bold text-gray-955">{formatCurrency(stampDutyCost, currency)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Administrative Registration Deed Fee ({registrationRate}%)</span>
                  <span className="font-bold text-gray-955">{formatCurrency(registrationCost, currency)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Legal Counsel & Title Escrow Settlement (flat)</span>
                  <span className="font-bold text-gray-955">{formatCurrency(legalFlatFee, currency)}</span>
                </div>
                <div className="flex justify-between py-2.5 font-bold text-indigo-900 border-t border-gray-100">
                  <span>Complete Acquisition Cost (Property + closing)</span>
                  <span className="text-sm">{formatCurrency(finalPurchaseCost, currency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. AFFORDABILITY PLANNED REVIEWS */}
          {subTab === 'afford' && (
            <div className="space-y-5">
              <div className="p-4 bg-rose-50/20 border border-rose-50 rounded-xl space-y-1">
                <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Max Affordable Property Value</span>
                <p className="text-3xl font-black text-rose-900 font-sans">{formatCurrency(maxAffordableProperty, currency)}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Given your downpayment & DTI limits</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs text-gray-650">
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-405 block pb-0.5">Monthly EMI Budget</span>
                  <p className="font-bold text-gray-805 font-sans">{formatCurrency(monthlyEmiBudget, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-405 block pb-0.5">Maximum Loan Size</span>
                  <p className="font-bold text-gray-850 font-sans">{formatCurrency(maxAffordablePrincipal, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg col-span-2">
                  <span className="text-gray-405 block pb-0.5">Standard 28/36 Rule Guidance</span>
                  <p className="italic text-[11px] leading-relaxed text-gray-500 pt-0.5">
                    Lenders advise keeping total home ownership expenses under <span className="font-medium text-gray-700">{dtiLimit}%</span> of pre-tax income, minus outstanding credit/auto/personal payments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function paintRatio(subset: number, total: number): number {
  if (total <= 0 || subset <= 0) return 0;
  return subset / total;
}
