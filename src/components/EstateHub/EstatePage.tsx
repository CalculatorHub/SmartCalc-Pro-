import React, { useState, useMemo, useEffect, useRef } from 'react';
import DimensionsCard from './DimensionsCard';
import ValuationCard from './ValuationCard';
import EstimationCard from './EstimationCard';
import ConversionCard from './ConversionCard';
import { Landmark } from 'lucide-react';
import { saveHistory } from '../../lib/historyUtils';

export default function EstatePage() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [unit, setUnit] = useState<'FEET' | 'METERS'>('FEET');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState('SQ.FT');

  const stats = useMemo(() => {
    const rawL = parseFloat(length);
    const rawW = parseFloat(width);
    const rawR = parseFloat(rate);

    const L = isNaN(rawL) || rawL <= 0 ? 0 : rawL;
    const W = isNaN(rawW) || rawW <= 0 ? 0 : rawW;
    const R = isNaN(rawR) || rawR <= 0 ? 0 : rawR;

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

  const [archiveSaved, setArchiveSaved] = useState(false);
  const lastLoggedRef = useRef<string>('');

  // Auto-save logic
  useEffect(() => {
    const rawL = parseFloat(length);
    const rawW = parseFloat(width);
    const rawR = parseFloat(rate);

    if (isNaN(rawL) || rawL <= 0 || isNaN(rawW) || rawW <= 0 || isNaN(rawR) || rawR <= 0) {
      return;
    }

    const paramKey = `${length}-${width}-${unit}-${rate}-${rateUnit}`;
    if (lastLoggedRef.current === paramKey) return;

    const handler = setTimeout(() => {
      saveHistory(
        'Real Estate Valuation',
        stats.totalPrice,
        `Dimensions: ${length}x${width} ${unit} (Area: ${stats.area.toFixed(2)} ${stats.displayUnit}), Rate: ₹${rate}/${rateUnit}`
      );
      lastLoggedRef.current = paramKey;
    }, 1800);

    return () => clearTimeout(handler);
  }, [length, width, unit, rate, rateUnit, stats]);

  const handleArchive = () => {
    const rawL = parseFloat(length);
    const rawW = parseFloat(width);
    const rawR = parseFloat(rate);

    if (isNaN(rawL) || rawL <= 0 || isNaN(rawW) || rawW <= 0 || isNaN(rawR) || rawR <= 0) {
      return;
    }

    saveHistory(
      'Real Estate Valuation',
      stats.totalPrice,
      `Dimensions: ${length}x${width} ${unit} (Area: ${stats.area.toFixed(2)} ${stats.displayUnit}), Rate: ₹${rate}/${rateUnit}`
    );

    const paramKey = `${length}-${width}-${unit}-${rate}-${rateUnit}`;
    lastLoggedRef.current = paramKey;

    setArchiveSaved(true);
    setTimeout(() => setArchiveSaved(false), 2000);
  };

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
            onArchive={handleArchive}
            archiveSaved={archiveSaved}
        />
        <EstimationCard area={stats.area} totalPrice={stats.totalPrice} unit={stats.displayUnit} />
        <ConversionCard />
      </div>
    </div>
  );
}
