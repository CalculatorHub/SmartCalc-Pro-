import React, { useState, useMemo } from 'react';
import DimensionsCard from './DimensionsCard';
import ValuationCard from './ValuationCard';
import EstimationCard from './EstimationCard';
import ConversionCard from './ConversionCard';
import { Landmark } from 'lucide-react';

export default function EstatePage() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState<'FEET' | 'METERS'>('FEET');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState('SQ.FT');

  const stats = useMemo(() => {
    const L = parseFloat(length) || 0;
    const W = parseFloat(width) || 0;
    const R = parseFloat(rate) || 0;

    let area = L * W;
    let convertedArea = area;

    // Logic: If inputs are in Meters but rate is in SQ.FT, convert area to SQ.FT for price calculation
    // Or just calculate Area in selected Unit, and if units mismatch, do conversion
    if (unit === 'METERS' && rateUnit === 'SQ.FT') {
        convertedArea = area * 10.7639;
    } else if (unit === 'FEET' && rateUnit === 'SQ.M') {
        convertedArea = area / 10.7639;
    }

    const price = convertedArea * R;

    return {
      area,
      totalPrice: price,
      displayUnit: unit === 'FEET' ? 'SQ.FT' : 'SQ.M'
    };
  }, [length, width, unit, rate, rateUnit]);

  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-10 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Estate Matrix</h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest italic">Precision real estate analytics hub</p>
      </div>

      <div className="space-y-8">
        <DimensionsCard 
            length={length} setLength={setLength}
            width={width} setWidth={setWidth}
            unit={unit} setUnit={setUnit}
        />
        <ValuationCard 
            rate={rate} setRate={setRate}
            rateUnit={rateUnit} setRateUnit={setRateUnit}
            onReset={() => { setLength(''); setWidth(''); setRate(''); }}
        />
        <EstimationCard area={stats.area} totalPrice={stats.totalPrice} unit={stats.displayUnit} />
        <ConversionCard />
      </div>
    </div>
  );
}
