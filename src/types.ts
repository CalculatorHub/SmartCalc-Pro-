export type AppTab = 'home' | 'tools' | 'calculate' | 'history' | 'profile';

export type CalculatorType = 'interest' | 'simple' | 'compound' | 'fuel' | 'gold' | 'silver' | 'estate';

export interface HistoryItem {
  id: string;
  type: CalculatorType;
  title: string;
  date: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

export interface MetalPrice {
  basePrice: number; // base price per gram (24k gold or 99.9% fine silver)
  change24h: number; // percentage change (e.g., -0.24, +1.15)
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface UserPreferences {
  userName: string;
  currency: string; // '$', '₹', '€', '£', etc.
  themeColor: string;
  weeklyGoal: number;
  theme?: 'system' | 'light' | 'dark';
  locationPermission?: boolean;
  vegMode?: boolean;
  hapticFeedback?: boolean;
  // Security Panel Options
  inputSanitization?: boolean;
  transitEncryption?: boolean;
  screenshotProtection?: boolean;
  inactiveSessionAutoLogout?: 'off' | '1m' | '5m' | '15m';
  lastSecurityCheckTime?: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
}
