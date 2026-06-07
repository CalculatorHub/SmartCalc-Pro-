import React from 'react';
import { User, DollarSign, Target, Award, Check } from 'lucide-react';
import { UserPreferences } from '../types';
import { cn, formatCurrency } from '../utils';

interface ProfileTabProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  savedCalculationsCount: number;
}

const CURRENCIES = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee (₹)' },
];

export default function ProfileTab({
  preferences,
  onUpdatePreferences,
  savedCalculationsCount,
}: ProfileTabProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Visual Avatar Card banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden flex items-center justify-center border-2 border-white/30 shadow-lg shrink-0">
          <img
            src="/src/assets/images/smart_finance_logo_1780875300350.png"
            alt="Smart Finance Brand"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 bg-blue-500/30 px-2.5 py-0.5 rounded-full">
            Active Profile
          </span>
          <h3 className="text-2xl font-black">{preferences.userName}</h3>
          <p className="text-xs text-blue-100">Managing financial plans with real-time variables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-50 pb-2.5">User Customization</h4>
          
          {/* Change Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Profile Name</label>
            <input
              type="text"
              value={preferences.userName}
              onChange={(e) => onUpdatePreferences({ userName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs font-semibold text-gray-700"
            />
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Global Workspace Currency</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {CURRENCIES.map((curr) => {
                const isSelected = preferences.currency === curr.symbol;
                return (
                  <button
                    key={curr.code}
                    onClick={() => onUpdatePreferences({ currency: curr.symbol })}
                    className={cn(
                      "w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border cursor-pointer transition-all",
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "border-gray-150 hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <span>{curr.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Goals & Achievements */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-50 pb-2.5">Achievements & Milestones</h4>

          <div className="space-y-4 text-xs font-semibold">
            {/* Target Card math */}
            <div className="p-4 bg-indigo-50/20 border border-indigo-50 rounded-xl flex gap-3 text-indigo-950 items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-400 text-[10px] uppercase block tracking-wider">Saved Computations Goals</span>
                <p className="text-sm font-black text-indigo-900">{savedCalculationsCount} / 5 Calculations Stored</p>
              </div>
            </div>

            {/* Progress gauge bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Core Target Completion</span>
                <span>{Math.min(100, Math.round((savedCalculationsCount / 5) * 100))}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-350"
                  style={{ width: `${Math.min(100, (savedCalculationsCount / 5) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Achievements unlock list */}
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Unlocked badges</span>
              
              <div className="space-y-2.5 text-xs text-slate-650">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-white",
                    savedCalculationsCount >= 1 ? "bg-emerald-500 border-emerald-300" : "bg-gray-100 border-gray-200"
                  )}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">First Steps Saver</h5>
                    <p className="text-[10px] text-gray-400">Logged your first customized projection.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-white",
                    savedCalculationsCount >= 3 ? "bg-indigo-500 border-indigo-300" : "bg-gray-100 border-gray-200"
                  )}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Finance Novice</h5>
                    <p className="text-[10px] text-gray-400">Logged 3+ calculations under different modules.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-white",
                    savedCalculationsCount >= 5 ? "bg-amber-500 border-amber-300 animate-pulse" : "bg-gray-100 border-gray-200"
                  )}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800">Strategic Planner</h5>
                    <p className="text-[10px] text-gray-400">Logged 5+ calculations. Full audit capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
