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

export const annualToMonthlyRate = (annual: number) => {
  if (!annual) return 0;
  return annual / 12;
};

export const monthlyToAnnualRate = (monthly: number) => {
  if (!monthly) return 0;
  return monthly * 12;
};

export const getMonthsBetween = (start: string | Date, end: string | Date) => {
  const s = new Date(start);
  const e = new Date(end);

  let months =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth());

  // ✅ handle partial month
  if (e.getDate() > s.getDate()) {
    months += 1;
  }

  return Math.max(months, 1); // never 0
};

export const numberToIndianWords = (num: number): string => {
  if (num === 0) return 'Zero';
  if (!num || isNaN(num)) return '';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const doubleDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensPlace = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertGroup = (n: number) => {
    let str = '';
    if (n >= 100) {
      str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += doubleDigits[n - 10] + ' ';
    } else if (n >= 20 || (n > 0 && n < 10)) {
      str += tensPlace[Math.floor(n / 10)] + ' ' + singleDigits[n % 10] + ' ';
    }
    return str.trim();
  };

  let res = '';
  let temp = Math.floor(num);

  if (temp >= 10000000) {
    res += convertGroup(Math.floor(temp / 10000000)) + ' Crore ';
    temp %= 10000000;
  }
  if (temp >= 100000) {
    res += convertGroup(Math.floor(temp / 100000)) + ' Lakh ';
    temp %= 100000;
  }
  if (temp >= 1000) {
    res += convertGroup(Math.floor(temp / 1000)) + ' Thousand ';
    temp %= 1000;
  }
  if (temp > 0) {
    res += convertGroup(temp);
  }

  return res.trim() + ' Rupees Only';
};

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
