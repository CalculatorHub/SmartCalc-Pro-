import { differenceInDays, addDays, format, isValid } from 'date-fns';

export type InterestType = 'simple' | 'compound';
export type Frequency = 'daily' | 'monthly' | 'quarterly' | 'yearly';

export interface CalculationResult {
  principal: number;
  totalInterest: number;
  totalAmount: number;
  durationDays: number;
  durationDescription: string;
  schedule: Array<{
    date: string;
    interest: number;
    balance: number;
  }>;
}

export function calculateFinance(
  principal: number,
  rate: number,
  startDate: Date,
  endDate: Date,
  type: InterestType,
  compoundingFrequency: Frequency = 'monthly'
): CalculationResult | null {
  if (!isValid(startDate) || !isValid(endDate) || endDate < startDate) return null;

  const days = differenceInDays(endDate, startDate);
  const years = days / 365;

  let totalInterest = 0;
  let totalAmount = 0;
  const schedule = [];

  if (type === 'simple') {
    totalInterest = (principal * rate * years) / 100;
    totalAmount = principal + totalInterest;

    // Generate a simple schedule for plotting (5 points)
    for (let i = 0; i <= 5; i++) {
        const stepDays = Math.floor((days / 5) * i);
        const stepDate = addDays(startDate, stepDays);
        const stepInterest = (principal * rate * (stepDays / 365)) / 100;
        schedule.push({
            date: format(stepDate, 'MMM dd, yyyy'),
            interest: Number(stepInterest.toFixed(2)),
            balance: Number((principal + stepInterest).toFixed(2))
        });
    }
  } else {
    // Compound Interest: A = P(1 + r/n)^(nt)
    const nMap: Record<Frequency, number> = {
      daily: 365,
      monthly: 12,
      quarterly: 4,
      yearly: 1,
    };

    const n = nMap[compoundingFrequency];
    const r = rate / 100;
    totalAmount = principal * Math.pow(1 + r / n, n * years);
    totalInterest = totalAmount - principal;

    // Generate more detailed schedule for compound interest
    const steps = Math.min(days, 12); // Max 12 points for graph
    for (let i = 0; i <= steps; i++) {
        const stepDays = Math.floor((days / steps) * i);
        const stepYears = stepDays / 365;
        const stepDate = addDays(startDate, stepDays);
        const stepAmount = principal * Math.pow(1 + r / n, n * stepYears);
        schedule.push({
            date: format(stepDate, 'MMM dd, yyyy'),
            interest: Number((stepAmount - principal).toFixed(2)),
            balance: Number(stepAmount.toFixed(2))
        });
    }
  }

  const durationDescription = `${days} days (${(days / 30).toFixed(1)} months)`;

  return {
    principal,
    totalInterest: Number(totalInterest.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    durationDays: days,
    durationDescription,
    schedule
  };
}
