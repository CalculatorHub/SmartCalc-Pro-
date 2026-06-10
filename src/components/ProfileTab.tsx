import React, { useState } from 'react';
import { 
  User, 
  Check, 
  Sun, 
  Moon, 
  Settings, 
  AlertCircle
} from 'lucide-react';
import { UserPreferences } from '../types';
import { cn } from '../utils';

interface ProfileTabProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  savedCalculationsCount: number;
}

export default function ProfileTab({
  preferences,
  onUpdatePreferences,
}: ProfileTabProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const activeTheme = preferences.theme || 'system';

  const triggerToast = (msg: string) => {
    setToastText(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    onUpdatePreferences({ theme: newTheme });
    triggerToast(`Theme set to ${newTheme.toUpperCase()}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 font-sans animate-in fade-in duration-300">
      
      {/* Toast Alert Banner */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1C1C1E] dark:bg-zinc-900 border border-zinc-800 text-app-accent px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-6 duration-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-app-accent" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Visual Header Banner */}
      <div className="bg-app-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 border border-app-border shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-app-accent/10 flex items-center justify-center border border-app-accent/20 shadow-sm shrink-0">
          <User className="w-8 h-8 text-app-accent" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-app-accent bg-app-accent/10 px-2.5 py-0.5 rounded-full select-none">
            Active Account
          </span>
          <h3 className="text-2xl font-black text-app-text">{preferences.userName}</h3>
          <p className="text-xs text-app-text-secondary">Customize your account options and interface themes instantly.</p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-app-card rounded-2xl border border-app-border p-6 md:p-8 space-y-6 shadow-xs">
        
        {/* Header Title */}
        <div className="flex items-center gap-2.5 border-b border-app-border pb-4 select-none">
          <Settings className="w-5 h-5 text-app-accent scroll-smooth" />
          <h4 className="font-extrabold text-app-text text-sm uppercase tracking-wider">
            User Customization
          </h4>
        </div>

        <div className="space-y-6 pt-2">
          
          {/* Profile Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider block">
              Profile Name
            </label>
            <input
              type="text"
              value={preferences.userName}
              onChange={(e) => onUpdatePreferences({ userName: e.target.value })}
              placeholder="Enter profile name"
              className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl focus:outline-none focus:ring-2 focus:ring-app-accent/15 focus:border-app-accent text-xs font-semibold text-app-text transition-all"
            />
          </div>

          {/* Workspace Currency info */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider block">
              Workspace Currency
            </label>
            <div className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-semibold text-app-text select-none">
              Indian Rupee (₹)
            </div>
          </div>

          {/* Segmented Theme Switcher */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider block">
                Workspace Theme
              </label>
              <span className="text-[10px] font-black bg-app-accent/10 text-app-accent px-2.5 py-0.5 rounded-full capitalize select-none">
                {activeTheme} Mode
              </span>
            </div>

            {/* Segmented Control Container */}
            <div className="grid grid-cols-3 bg-app-bg rounded-xl p-1 border border-app-border relative overflow-hidden">
              
              {/* System Option */}
              <button
                onClick={() => handleThemeChange('system')}
                className={cn(
                  "py-3 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10 select-none",
                  activeTheme === 'system'
                    ? "bg-app-accent text-white dark:text-zinc-950 shadow-xs font-extrabold scale-102"
                    : "text-app-text-secondary hover:text-app-text hover:bg-app-accent/5 font-semibold"
                )}
              >
                {activeTheme === 'system' ? (
                  <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
                ) : (
                  <Settings className="w-4 h-4 shrink-0 opacity-60" />
                )}
                <span>System</span>
              </button>

              {/* Light Option */}
              <button
                onClick={() => handleThemeChange('light')}
                className={cn(
                  "py-3 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10 select-none",
                  activeTheme === 'light'
                    ? "bg-app-accent text-white dark:text-zinc-950 shadow-xs font-extrabold scale-102"
                    : "text-app-text-secondary hover:text-app-text hover:bg-app-accent/5 font-semibold"
                )}
              >
                {activeTheme === 'light' ? (
                  <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
                ) : (
                  <Sun className="w-4 h-4 shrink-0 opacity-60" />
                )}
                <span>Light</span>
              </button>

              {/* Dark Option */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={cn(
                  "py-3 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10 select-none",
                  activeTheme === 'dark'
                    ? "bg-app-accent text-zinc-950 dark:text-zinc-950 shadow-xs font-extrabold scale-102"
                    : "text-app-text-secondary hover:text-app-text hover:bg-app-accent/5 font-semibold"
                )}
              >
                {activeTheme === 'dark' ? (
                  <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
                ) : (
                  <Moon className="w-4 h-4 shrink-0 opacity-60" />
                )}
                <span>Dark</span>
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
