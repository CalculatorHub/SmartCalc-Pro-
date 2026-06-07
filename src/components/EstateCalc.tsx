import React, { useState } from 'react';
import { RotateCcw, Save, Home, Landmark, Calculator, Receipt, Info, Calendar } from 'lucide-react';
import { formatCurrency, cn } from '../utils';
import { HistoryItem } from '../types';

interface EstateCalcProps {
  currency: string;
  onSaveHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

type EstateSubTab = 'mortgage' | 'stamp' | 'afford';

export default function EstateCalc({ currency = '₹', onSaveHistory }: EstateCalcProps) {
  const [subTab, setSubTab] = useState<EstateSubTab>('mortgage');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // --- MORTGAGE (EMI) STATES ---
  // Default property price: ₹80,000,000 (₹80 Lakhs)
  const [propertyPrice, setPropertyPrice] = useState<number>(8000000);
  const [downPercent, setDownPercent] = useState<number>(20); // 20% standard home loan down payment
  const [loanRate, setLoanRate] = useState<number>(8.55); // Typical SBI / Indian Bank home loan rate (~8.5%)
  const [loanTerm, setLoanTerm] = useState<number>(20); // standard Indian loan term (20 years)

  // Calculations for Mortgage
  const downPayment = (propertyPrice * downPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  const isRateZero = loanRate === 0;
  const r = (loanRate / 100) / 12; // monthly rate
  const n = loanTerm * 12; // total monthly payments
  
  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyEmi = isRateZero || loanAmount <= 0
    ? (n > 0 ? loanAmount / n : 0)
    : loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalMortgagePayment = monthlyEmi * n;
  const totalInterest = totalMortgagePayment - loanAmount;

  // --- STAMP DUTY STATES ---
  const [stampPropertyPrice, setStampPropertyPrice] = useState<number>(8000000);
  const [stampDutyRate, setStampDutyRate] = useState<number>(6.0); // % average Indian stamp duty
  const [registrationRate, setRegistrationRate] = useState<number>(1.0); // % standard Indian registration fee
  const [legalFlatFee, setLegalFlatFee] = useState<number>(25000); // broker fees, title searches, legal registration paperwork

  // Calculations for Stamp
  const stampDutyCost = (stampPropertyPrice * stampDutyRate) / 100;
  const registrationCost = (stampPropertyPrice * registrationRate) / 100;
  const totalClosingCost = stampDutyCost + registrationCost + legalFlatFee;
  const finalPurchaseCost = stampPropertyPrice + totalClosingCost;

  // --- AFFORDABILITY STATES ---
  // Defaults to typical middle-class salary: ₹1.5 Lakhs/month
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(15000);
  const [affordRate, setAffordRate] = useState<number>(8.55);
  const [affordDown, setAffordDown] = useState<number>(1500000); // 15 Lakhs reserve
  const [dtiLimit, setDtiLimit] = useState<number>(40); // standard max Indian bank EMI-to-income % (normally capped around 40-50%)

  // Calculations for Affordability
  const maxMonthlyHousingDebt = (monthlyIncome * dtiLimit) / 100 - monthlyDebts;
  const monthlyEmiBudget = Math.max(0, maxMonthlyHousingDebt);
  
  // Back-calculate principal from maximum monthly payment budget: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const affordTermInMonths = 20 * 12; // Standard 20 yr tenure
  const monthlyR = (affordRate / 100) / 12;
  const maxAffordablePrincipal = monthlyR === 0
    ? (monthlyEmiBudget * affordTermInMonths)
    : monthlyEmiBudget * (Math.pow(1 + monthlyR, affordTermInMonths) - 1) / (monthlyR * Math.pow(1 + monthlyR, affordTermInMonths));

  const maxAffordableProperty = maxAffordablePrincipal + affordDown;

  const handleSave = () => {
    let inputs: Record<string, any> = {};
    let outputs: Record<string, any> = {};
    let saveTitle = 'Real Estate - ';

    if (subTab === 'mortgage') {
      saveTitle += 'Home Loan EMI';
      inputs = { propertyPrice, downPercent, loanRate, loanTerm };
      outputs = { loanAmount, downPayment, monthlyEmi, totalInterest, totalMortgagePayment };
    } else if (subTab === 'stamp') {
      saveTitle += 'Stamp Registration Costs';
      inputs = { stampPropertyPrice, stampDutyRate, registrationRate, legalFlatFee };
      outputs = { stampDutyCost, registrationCost, totalClosingCost, finalPurchaseCost };
    } else {
      saveTitle += 'Property Affordability';
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
      {/* Sub-Tabs Nav */}
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
          Home Loan EMI
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
          Stamp Duty & Fees
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
          Affordability Check
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANEL: Variables */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-600" />
              {subTab === 'mortgage' && 'Home Loan Parameters'}
              {subTab === 'stamp' && 'State Tax Registration inputs'}
              {subTab === 'afford' && 'Income & Liability Benchmarks'}
            </h3>
            <button
              onClick={() => {
                if (subTab === 'mortgage') {
                  setPropertyPrice(8000000);
                  setDownPercent(20);
                  setLoanRate(8.55);
                  setLoanTerm(20);
                } else if (subTab === 'stamp') {
                  setStampPropertyPrice(8000000);
                  setStampDutyRate(6.0);
                  setRegistrationRate(1.0);
                  setLegalFlatFee(25000);
                } else {
                  setMonthlyIncome(150000);
                  setMonthlyDebts(15000);
                  setAffordRate(8.55);
                  setAffordDown(1500000);
                  setDtiLimit(40);
                }
                setIsSaved(false);
              }}
              className="text-gray-400 hover:text-indigo-600 text-xs flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Variables
            </button>
          </div>

          {/* 1. HOME LOAN EMI MODULE */}
          {subTab === 'mortgage' && (
            <div className="space-y-4">
              {/* Prop Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Home/Property Value</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(propertyPrice, currency)}</span>
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
                <span className="text-[10px] text-gray-400 font-semibold block">E.g. ₹5 Lakhs to ₹3 Crores</span>
              </div>

              {/* Down Payment % */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Down Payment Margin (%)</label>
                  <span className="font-bold text-gray-800 text-xs">({formatCurrency(downPayment, currency)})</span>
                </div>
                <div className="relative rounded-xl">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={downPercent || ''}
                    onChange={(e) => {
                      setDownPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)));
                      setIsSaved(false);
                    }}
                    className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                    placeholder="20"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Loan percentage rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Bank Annual Interest Rate (%)</label>
                </div>
                <div className="relative rounded-xl">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.01"
                    value={loanRate || ''}
                    onChange={(e) => {
                      setLoanRate(Math.max(0, parseFloat(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                    placeholder="8.55"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Home Loan term */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Loan Tenure (Years)</label>
                  <span className="font-bold text-gray-800 text-sm">{loanTerm} Years</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((term) => (
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
                          : "border-gray-200 text-gray-600 hover:bg-gray-55"
                      )}
                    >
                      {term} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. STAMP DUTY MODULE */}
          {subTab === 'stamp' && (
            <div className="space-y-4">
              {/* Property declared value */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Declared Property Value</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(stampPropertyPrice, currency)}</span>
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
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Stamp Duty Rate (State Government)</label>
                </div>
                <div className="relative rounded-xl">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.1"
                    value={stampDutyRate || ''}
                    onChange={(e) => {
                      setStampDutyRate(Math.max(0, parseFloat(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                    placeholder="6.0"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Registration charges */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Deed Registration Charges</label>
                </div>
                <div className="relative rounded-xl">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={registrationRate || ''}
                    onChange={(e) => {
                      setRegistrationRate(Math.max(0, parseFloat(e.target.value) || 0));
                      setIsSaved(false);
                    }}
                    className="block w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold"
                    placeholder="1.0"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Legal Fees */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Legal, Brokerage, Documentation Fees</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(legalFlatFee, currency)}</span>
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

          {/* 3. HOUSING AFFORDABILITY check */}
          {subTab === 'afford' && (
            <div className="space-y-4">
              {/* Monthly household income */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Gross Monthly Household Salary</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(monthlyIncome, currency)}</span>
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
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-gray-700"
                  />
                </div>
              </div>

              {/* Monthly Debts */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Monthly EMIs & Liabilities</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(monthlyDebts, currency)}</span>
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
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Cash Fund for Down Payment</label>
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(affordDown, currency)}</span>
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
                    className="block w-full pl-8 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-bold text-gray-700"
                  />
                </div>
              </div>

              {/* Debt-To-Income slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Max Allowed Bank FOIR / EMI Ratio</label>
                  <span className="font-bold text-gray-800 text-sm">{dtiLimit}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[35, 45, 55].map((limit) => (
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
                          : "border-gray-200 text-gray-600 hover:bg-gray-55"
                      )}
                    >
                      {limit}% {limit === 45 ? '(Standard)' : limit === 35 ? '(Conservative)' : '(Liberal)'}
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
              Indian Financial Breakdown
            </h3>
            <button
              onClick={handleSave}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
                isSaved
                  ? "bg-indigo-100 text-indigo-850 border border-indigo-200 animate-pulse"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved!" : "Save Calculation"}
            </button>
          </div>

          {/* 1. HOME LOAN OUTPUTS */}
          {subTab === 'mortgage' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50/30 border border-indigo-50 rounded-xl space-y-1">
                <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider block">Estimated Monthly EMI</span>
                <p className="text-3xl font-black text-indigo-900 font-sans">{formatCurrency(monthlyEmi, currency)}</p>
                <span className="text-[10px] text-gray-400 block pt-0.5">Calculated using home loan standards in India</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs text-gray-650 font-semibold">
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5 font-medium">Loan Principal</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(loanAmount, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5 font-medium">Down payment ({downPercent}%)</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(downPayment, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5 font-medium">Total Interest Paid</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(totalInterest, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-400 block pb-0.5 font-medium">Total Cumulative Cost</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(totalMortgagePayment, currency)}</p>
                </div>
              </div>

              {/* Amortized Graph ratio visual */}
              <div className="space-y-1 pt-1.5 border-t border-gray-100">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  <span>Down Payment ({((paintRatio(downPayment, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                  <span>Principal ({((paintRatio(loanAmount, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                  <span>Interest ({((paintRatio(totalInterest, totalMortgagePayment + downPayment)) * 100).toFixed(0)}%)</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100">
                  <div className="bg-slate-300 h-full animate-pulse" style={{ width: `${Math.max(5, paintRatio(downPayment, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                  <div className="bg-indigo-400 h-full" style={{ width: `${Math.max(5, paintRatio(loanAmount, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                  <div className="bg-rose-400 h-full" style={{ width: `${Math.max(5, paintRatio(totalInterest, totalMortgagePayment + downPayment) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STAMP DUTY OUTPUT DETAIL */}
          {subTab === 'stamp' && (
            <div className="space-y-5">
              <div className="p-4 bg-teal-50/20 border border-teal-100 rounded-xl space-y-1">
                <span className="text-xs text-teal-605 font-bold uppercase tracking-wider block">Total Gov. Registration & Broker Charges</span>
                <p className="text-3xl font-black text-teal-900 font-sans">{formatCurrency(totalClosingCost, currency)}</p>
                <div className="text-[11px] text-gray-500 mt-1">
                  Adds <span className="font-bold text-gray-700">{((totalClosingCost / stampPropertyPrice) * 100).toFixed(1)}%</span> on top of purchasing bid.
                </div>
              </div>

              <div className="space-y-3 divide-y divide-gray-55 text-xs text-gray-650 font-semibold">
                <div className="flex justify-between py-1">
                  <span>Stamp Duty / Land Tax ({stampDutyRate}%)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(stampDutyCost, currency)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Deed Registration charges ({registrationRate}%)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(registrationCost, currency)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Legal Drafting, Agency & Brokerage fees</span>
                  <span className="font-bold text-gray-900">{formatCurrency(legalFlatFee, currency)}</span>
                </div>
                <div className="flex justify-between py-2.5 font-black text-indigo-950 border-t border-gray-150">
                  <span>Total Investment Needed (Property + registration)</span>
                  <span className="text-sm font-black font-sans">{formatCurrency(finalPurchaseCost, currency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. AFFORDABILITY REVIEWS */}
          {subTab === 'afford' && (
            <div className="space-y-5">
              <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-xl space-y-1">
                <span className="text-xs text-rose-650 font-bold uppercase tracking-wider block">Max Affordable Property Value</span>
                <p className="text-3xl font-black text-rose-950 font-sans">{formatCurrency(maxAffordableProperty, currency)}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Calculated based on down payment reserve and net EMIs</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs text-gray-650 font-semibold">
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-405 block pb-0.5 font-medium">Monthly Home EMI Budget</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(monthlyEmiBudget, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                  <span className="text-gray-405 block pb-0.5 font-medium">Maximum Loan eligible</span>
                  <p className="font-bold text-gray-800 font-sans">{formatCurrency(maxAffordablePrincipal, currency)}</p>
                </div>
                <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-lg col-span-2">
                  <span className="text-gray-405 block pb-0.5 font-medium">Indian Banking Standards</span>
                  <p className="italic text-[11px] leading-relaxed text-gray-500 font-normal pt-1">
                    Reserve Bank of India guidelines suggest keeping total EMI ratios under 40-50% (DTI / FOIR limits) of your household salary to ensure successful verification.
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
