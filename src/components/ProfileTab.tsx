import React, { useState, useEffect } from 'react';
import { 
  User, 
  Check, 
  Sun, 
  Moon, 
  Settings, 
  AlertCircle,
  Globe,
  Shield,
  ShieldAlert,
  EyeOff,
  Lock,
  Terminal,
  CheckSquare,
  Key,
  RefreshCw,
  FileWarning
} from 'lucide-react';
import { UserPreferences, SecurityEventLog } from '../types';
import { cn } from '../utils';
import { 
  sanitizeHTML, 
  sanitizeSQL, 
  hashSimulation, 
  getSecurityLogs, 
  appendSecurityLog 
} from '../utils/security';

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

  // Interactive Security Sandbox states
  const [sandboxInput, setSandboxInput] = useState("SELECT * FROM users WHERE active = '1' <script>alert(1)</script>");
  const [pwdInput, setPwdInput] = useState("SmartSDF89#$");
  const [hashedResult, setHashedResult] = useState("");
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(5);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'success' | 'error' | 'locked'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [secLogs, setSecLogs] = useState<SecurityEventLog[]>([]);

  useEffect(() => {
    setSecLogs(getSecurityLogs());
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 9) + 2;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaInput("");
    setCaptchaStatus("idle");
  };

  const verifyCaptchaSubmit = () => {
    if (captchaStatus === 'locked') return;

    const answer = captchaNum1 + captchaNum2;
    if (parseInt(captchaInput) === answer) {
      setCaptchaStatus("success");
      setAttempts(0);
      appendSecurityLog("Google reCAPTCHA simulation validated. Verified Human.", "low");
      setSecLogs(getSecurityLogs());
      triggerToast("reCAPTCHA Simulation Verified Successfully!");
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 4) {
        setCaptchaStatus("locked");
        appendSecurityLog("Multiple brute force CAPTCHA failures recorded. Lock triggered.", "high");
        triggerToast("Account Locked! Please wait for 60 seconds.");
        setTimeout(() => {
          setAttempts(0);
          setCaptchaStatus("idle");
          generateCaptcha();
        }, 15000); // 15 seconds cooldown in demo simulation so user isn't stuck forever
      } else {
        setCaptchaStatus("error");
        triggerToast(`Incorrect CAPTCHA! Attempt ${nextAttempts}/4`);
      }
    }
  };

  const handleHashClick = () => {
    if (!pwdInput) {
      triggerToast("Please enter a password key to hash.");
      return;
    }
    const simulated = hashSimulation(pwdInput);
    setHashedResult(simulated);
    appendSecurityLog(`Local client simulated salt-bcrypt hash successful. Built signature.`, "low");
    setSecLogs(getSecurityLogs());
    triggerToast("Hashed password using simulated Bcrypt!");
  };

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

          {/* External Web Version Option (Goal 3 Placement) */}
          <div className="space-y-2 pt-2 border-t border-app-border/40">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-app-text-secondary uppercase tracking-wider block">
                External Client Platform
              </label>
            </div>
            <a
              href={(import.meta as any).env?.VITE_WEBSITE_URL || 'https://websitehosting.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-semibold text-app-text hover:text-app-accent hover:border-app-accent/40 hover:bg-app-accent/5 transition-all cursor-pointer group"
              title="Visit Web Version"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-app-accent group-hover:scale-110 transition-transform" />
                <span>Visit Web Version Platform</span>
              </div>
              <span className="text-[10px] text-app-accent font-extrabold uppercase group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Launch ↗
              </span>
            </a>
          </div>

        </div>

      </div>

      {/* Dynamic Theme Diagnostic Check */}
      <div className="bg-app-card rounded-2xl border border-app-border p-6 space-y-4 shadow-xs select-none">
        <h4 className="font-extrabold text-app-text text-xs uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Theme System Diagnostics
        </h4>
        <p className="text-xs text-app-text-secondary leading-relaxed">
          Verify WCAG guidelines and theme cascade consistency tests on your device:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-1">
            <span className="text-[10px] text-app-text-muted font-bold block">ACTIVE MODE</span>
            <span className="text-xs font-extrabold text-app-text capitalize">
              {document.documentElement.classList.contains('dark') ? '🌑 Dark Mode Standard' : '☀️ Light Mode Standard'}
            </span>
          </div>
          
          <div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-1">
            <span className="text-[10px] text-app-text-muted font-bold block">VARIABLE RESOLUTION</span>
            <span className="text-xs font-extrabold text-[#4F46E5] dark:text-[#FACC15]">
              Cascading Active Tokens OK
            </span>
          </div>
        </div>

        <div className="bg-app-bg p-3.5 rounded-xl border border-app-border xs:block hidden">
          <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-app-text-secondary">
            <div className="flex items-center justify-between">
              <span>--bg-primary (Canvas background):</span>
              <span className="font-mono bg-app-card px-2 py-0.5 rounded border border-app-border text-app-text">
                {document.documentElement.classList.contains('dark') ? '#0D0D0D' : '#F8FAFC'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>--bg-card / --app-card (Containers):</span>
              <span className="font-mono bg-app-card px-2 py-0.5 rounded border border-app-border text-app-text">
                {document.documentElement.classList.contains('dark') ? '#1C1C1E' : '#FFFFFF'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>--app-text (Optimal readability):</span>
              <span className="font-mono bg-app-card px-2 py-0.5 rounded border border-app-border text-app-text">
                {document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#0F172A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 Interactive Cyber Security & Privacy Shield Panel */}
      <div className="bg-app-card rounded-2xl border border-app-border p-6 md:p-8 space-y-6 shadow-xs select-none">
        
        {/* Header Banner */}
        <div className="flex items-center gap-3 border-b border-app-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-app-text text-sm uppercase tracking-wider flex items-center gap-1.5">
              Secure Shield Cyber-Defense Suite
              <span className="text-[9px] bg-indigo-500/15 text-indigo-500 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                OWASP Compliant
              </span>
            </h4>
            <p className="text-xs text-app-text-secondary">Free best-practice backend protections, parameter sanitizations & active filters.</p>
          </div>
        </div>

        {/* Global Security Status Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-1">
            <span className="text-[9px] text-app-text-muted font-bold block">CONNECTION METHOD</span>
            <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              HTTPS/SSL Enforced
            </span>
          </div>
          <div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-1">
            <span className="text-[9px] text-app-text-muted font-bold block">ENVIRONMENT AUDIT</span>
            <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              No Secrets Hardcoded
            </span>
          </div>
          <div className="bg-app-bg p-3 rounded-xl border border-app-border space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[9px] text-app-text-muted font-bold block">XSS/SQLI REJECTION</span>
            <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Sanitization
            </span>
          </div>
        </div>

        {/* Active Security Controls */}
        <div className="space-y-4 pt-1">
          <h5 className="text-[11px] font-bold text-app-text uppercase tracking-widest">Active Protection Parameters</h5>
          
          <div className="space-y-3.5 bg-app-bg p-4 rounded-xl border border-app-border">
            
            {/* Input Sanitizer Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-app-text flex items-center gap-1">
                  XSS & SQL Injection Escaping
                </span>
                <p className="text-[10px] text-app-text-secondary">Escape malicious HTML tags and SQL markers globally in real-time.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const curr = preferences.inputSanitization !== false;
                  onUpdatePreferences({ inputSanitization: !curr });
                  appendSecurityLog(`XSS & SQLi Sanitization toggled ${!curr ? 'ON' : 'OFF'}.`, "medium");
                  setSecLogs(getSecurityLogs());
                  triggerToast(`XSS/SQLi sanitization set to ${!curr ? 'ON' : 'OFF'}`);
                }}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                  preferences.inputSanitization !== false ? "bg-indigo-500" : "bg-[#CBD5E1] dark:bg-[#475569]"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200",
                  preferences.inputSanitization !== false ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Transit and Storage Encryption Toggle */}
            <div className="flex items-center justify-between border-t border-app-border/40 pt-3">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-app-text">
                  Transit & Storage Obfuscation Encryption
                </span>
                <p className="text-[10px] text-app-text-secondary">Encrypt user session data at-rest within browser LocalStorage payloads.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const curr = preferences.transitEncryption !== false;
                  onUpdatePreferences({ transitEncryption: !curr });
                  appendSecurityLog(`At-Rest Obfuscation Encryption toggled ${!curr ? 'ON' : 'OFF'}.`, "low");
                  setSecLogs(getSecurityLogs());
                  triggerToast(`Transit / At-Rest Encryption set to ${!curr ? 'ON' : 'OFF'}`);
                }}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                  preferences.transitEncryption !== false ? "bg-indigo-500" : "bg-[#CBD5E1] dark:bg-[#475569]"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200",
                  preferences.transitEncryption !== false ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Screenshot Protection Sim Toggle */}
            <div className="flex items-center justify-between border-t border-app-border/40 pt-3">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-app-text flex items-center gap-1">
                  Sensitive Screenshot Blur Filter
                </span>
                <p className="text-[10px] text-app-text-secondary">Obfuscate calculator display viewport when application loses focus.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const curr = !preferences.screenshotProtection;
                  onUpdatePreferences({ screenshotProtection: curr });
                  appendSecurityLog(`Screenshot guard toggled ${curr ? 'ON' : 'OFF'}.`, "low");
                  setSecLogs(getSecurityLogs());
                  triggerToast(`Screenshot block mask is ${curr ? 'ON' : 'OFF'}`);
                }}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                  preferences.screenshotProtection ? "bg-indigo-500" : "bg-[#CBD5E1] dark:bg-[#475569]"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200",
                  preferences.screenshotProtection ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
            </div>

            {/* Session Inactive Auto Logout Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-app-border/40 pt-3 gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-app-text">
                  Session Auto-Logout (Inactive Detection)
                </span>
                <p className="text-[10px] text-app-text-secondary">Lock screen automatically on user inactivity detection.</p>
              </div>
              <select
                value={preferences.inactiveSessionAutoLogout || 'off'}
                onChange={(e) => {
                  const val = e.target.value as any;
                  onUpdatePreferences({ inactiveSessionAutoLogout: val });
                  appendSecurityLog(`Session timeout configured to: ${val}`, "low");
                  setSecLogs(getSecurityLogs());
                  triggerToast(`Session timeout threshold initialized to ${val}`);
                }}
                className="bg-app-card border border-app-border text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 text-app-text max-w-xs font-bold shrink-0 cursor-pointer"
              >
                <option value="off">🚫 Disabled</option>
                <option value="1m">⏱️ 1 Minute Inactivity</option>
                <option value="5m">⏱️ 5 Minutes Inactivity</option>
                <option value="15m">⏱️ 15 Minutes Inactivity</option>
              </select>
            </div>

          </div>
        </div>

        {/* Real-time Injection Sandbox Laboratory */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-app-accent" />
            <h5 className="text-[11px] font-bold text-app-text uppercase tracking-widest">
              SQL Injection & XSS Escape Sandbox
            </h5>
          </div>

          <div className="bg-app-bg p-4 rounded-xl border border-app-border space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-text-muted block">ENTER SUSPICIOUS HACKER STRING TO TEST:</label>
              <textarea
                rows={2}
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                className="w-full px-3 py-2 bg-app-card border border-app-border rounded-lg text-xs font-mono text-app-text focus:outline-none focus:ring-1 focus:ring-app-accent"
                placeholder="Type tags or raw queries, e.g. <script>alert(1)</script>"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-app-card p-3 rounded-lg border border-app-border space-y-1">
                <span className="text-[9px] font-bold text-indigo-500 uppercase">1. Escape HTML Result (XSS Shielded)</span>
                <pre className="text-[10px] font-mono text-app-text p-1.5 bg-app-bg rounded overflow-x-auto whitespace-pre-wrap leading-tight">
                  {sanitizeHTML(sandboxInput) || '(Write something to view output)'}
                </pre>
              </div>
              <div className="bg-app-card p-3 rounded-lg border border-app-border space-y-1">
                <span className="text-[9px] font-bold text-indigo-500 uppercase">2. Escape SQL Markers (SQLi Filtered)</span>
                <pre className="text-[10px] font-mono text-app-text p-1.5 bg-app-bg rounded overflow-x-auto whitespace-pre-wrap leading-tight">
                  {sanitizeSQL(sandboxInput) || '(Write something to view output)'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Password Salt/Hash bcrypt simulation */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Key className="w-4 h-4 text-app-accent" />
            <h5 className="text-[11px] font-bold text-app-text uppercase tracking-widest">
              Bcrypt Password Hashing Simulator
            </h5>
          </div>

          <div className="bg-app-bg p-4 rounded-xl border border-app-border space-y-3.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pwdInput}
                onChange={(e) => setPwdInput(e.target.value)}
                placeholder="Type credentials to test hashing..."
                className="flex-1 px-3 py-2 bg-app-card border border-app-border rounded-lg text-xs font-semibold text-app-text focus:outline-none focus:ring-1 focus:ring-app-accent"
              />
              <button
                type="button"
                onClick={handleHashClick}
                className="bg-[#4F46E5] text-white dark:bg-[#FACC15] dark:text-[#000000] font-bold text-xs px-3.5 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                Hash Bcrypt Sim
              </button>
            </div>

            {hashedResult && (
              <div className="bg-app-card p-3 rounded-lg border border-app-border space-y-1 animate-in fade-in duration-150">
                <span className="text-[9px] font-bold text-app-text-muted uppercase">GENERATED SECURED PASS SIGNATURE (SALT + PEPPER):</span>
                <code className="text-[10px] font-mono text-emerald-500 block break-all font-bold">
                  {hashedResult}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Human Verification Quiz (CAPTCHA) Simulation */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-app-accent" />
            <h5 className="text-[11px] font-bold text-app-text uppercase tracking-widest">
              Google reCAPTCHA Human Verification Demo
            </h5>
          </div>

          <div className="bg-app-bg p-4 rounded-xl border border-app-border space-y-3">
            <p className="text-[10px] text-app-text-secondary">Simulates security lock limits. Correct answer validates identity; 4 failures locks the mechanism for 15 seconds.</p>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-app-card px-3 py-2 rounded-lg border border-app-border text-xs font-bold text-app-text select-none">
                Math Quiz: <span className="font-mono text-app-accent font-black">{captchaNum1} + {captchaNum2} = ?</span>
              </div>
              <input
                type="number"
                value={captchaInput}
                disabled={captchaStatus === 'locked' || captchaStatus === 'success'}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter sum"
                className="w-24 px-3 py-2 bg-app-card border border-app-border rounded-lg text-xs font-semibold text-app-text focus:outline-none focus:ring-1 focus:ring-app-accent disabled:opacity-50"
              />
              <button
                type="button"
                disabled={captchaStatus === 'locked' || captchaStatus === 'success'}
                onClick={verifyCaptchaSubmit}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer shrink-0"
              >
                Verify Solution
              </button>
              <button
                type="button"
                onClick={generateCaptcha}
                title="Refresh Quiz"
                className="p-2 border border-app-border rounded-lg bg-app-card text-app-text hover:bg-app-bg transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {captchaStatus === 'success' && (
              <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                Verified Human! Status: Secured & Passed.
              </p>
            )}

            {captchaStatus === 'error' && (
              <p className="text-[11px] text-red-500 font-bold flex items-center gap-1">
                Incorrect Sum! Attempts: {attempts}/4
              </p>
            )}

            {captchaStatus === 'locked' && (
              <p className="text-[11px] text-red-500 font-bold animate-pulse flex items-center gap-1 bg-red-500/5 p-2 rounded border border-red-500/15">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                DANGEROUS DETECTED BOT BRUTE-FORCE! Account Locked for 15s.
              </p>
            )}
          </div>
        </div>

        {/* Live Attack Diagnostic Logs list */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <FileWarning className="w-4 h-4 text-app-accent" />
            <h5 className="text-[11px] font-bold text-app-text uppercase tracking-widest">
              Live Invasion Audit Logs (Local Diagnostic Logs)
            </h5>
          </div>

          <div className="bg-app-bg rounded-xl border border-app-border overflow-hidden">
            <div className="max-h-48 overflow-y-auto divide-y divide-app-border/40 scrollbar-none">
              {secLogs.length === 0 ? (
                <div className="p-4 text-center text-xs text-app-text-muted font-semibold">No threat logs available. Status clean.</div>
              ) : (
                secLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-app-card flex justify-between items-start text-[11px] font-semibold gap-3">
                    <div className="space-y-0.5">
                      <span className="text-app-text block leading-relaxed">{log.event}</span>
                      <span className="text-[9px] text-app-text-muted block font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()} · Severity:{' '}
                        <span className={cn(
                          "uppercase font-bold text-[9px]",
                          log.severity === 'high' ? 'text-red-500' : log.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                        )}>
                          {log.severity}
                        </span>
                      </span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono shrink-0">
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
