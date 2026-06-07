import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveHistory } from '../lib/historyUtils';
import { Tag, Percent, Receipt, Undo, Landmark } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../lib/haptic';

export default function Discount() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [finalPrice, setFinalPrice] = useState<string>("0.00");
  const [savedAmount, setSavedAmount] = useState<string>("0.00");
  const [taxAmount, setTaxAmount] = useState<string>("0.00");

  const calculate = () => {
    const rawPrice = parseFloat(price) || 0;
    const rawDiscount = parseFloat(discount) || 0;
    const rawTax = parseFloat(tax) || 0;

    if (rawPrice > 0) {
      const discountVal = (rawPrice * rawDiscount) / 100;
      const priceAfterDiscount = rawPrice - discountVal;
      const taxVal = (priceAfterDiscount * rawTax) / 100;
      const finalVal = priceAfterDiscount + taxVal;

      setFinalPrice(finalVal.toFixed(2));
      setSavedAmount(discountVal.toFixed(2));
      setTaxAmount(taxVal.toFixed(2));
    } else {
      setFinalPrice("0.00");
      setSavedAmount("0.00");
      setTaxAmount("0.00");
    }
  };

  const handleRecalculate = () => {
    calculate();
    const rawPrice = parseFloat(price) || 0;
    const rawDiscount = parseFloat(discount) || 0;
    const rawTax = parseFloat(tax) || 0;

    if (rawPrice > 0) {
      triggerHaptic('success');
      const discountVal = (rawPrice * rawDiscount) / 100;
      const priceAfterDiscount = rawPrice - discountVal;
      const taxVal = (priceAfterDiscount * rawTax) / 100;
      const finalVal = priceAfterDiscount + taxVal;

      saveHistory(
        'Discount Markdown',
        finalVal,
        `Price: ₹${rawPrice.toLocaleString('en-IN')}, Discount: ${rawDiscount}%, Saved: ₹${discountVal.toFixed(2)}${rawTax > 0 ? `, Tax: ${rawTax}%` : ''}`
      );
    } else {
      triggerHaptic('warning');
    }
  };

  useEffect(() => {
    calculate();
  }, [price, discount, tax]);

  return (
    <div className="container animate-in fade-in duration-350 space-y-6">
      {/* 🏷️ TITLE CARD */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/10">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">Discount Calculator</h2>
            <p className="text-xs text-gray-400">Calculate final sale prices with tax and instant savings</p>
          </div>
        </div>
      </Card>

      {/* 📊 INPUTS */}
      <Card>
        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
          <Percent className="w-4 h-4 text-rose-400" />
          Price & Markdown Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 block">Original Price (₹)</label>
            <Input 
              placeholder="e.g., 2999" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              type="number" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Discount (%)</label>
              <Input 
                placeholder="e.g., 15" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                type="number" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Tax rate (%) <span className="text-[10px] text-gray-500 opacity-80">(optional)</span></label>
              <Input 
                placeholder="e.g., 18" 
                value={tax} 
                onChange={(e) => setTax(e.target.value)} 
                type="number" 
              />
            </div>
          </div>
          
          <Button text="Recalculate Markdown" onClick={handleRecalculate} />
        </div>
      </Card>

      {/* 📊 RESULT MATRIX */}
      <Card>
        <div className="space-y-4 py-1 text-center">
          <div className="grid grid-cols-2 gap-4 divide-x divide-white/5">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Savings</div>
              <h4 className="text-lg font-black text-rose-400">
                ⭐ ₹ {parseFloat(savedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Tax Accrued</div>
              <h4 className="text-lg font-black text-gray-300">
                ₹ {parseFloat(taxAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-4">
            <div className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Final Sale Price</div>
            <h2 className="text-3xl font-black text-rose-400">
              ₹ {parseFloat(finalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
}
