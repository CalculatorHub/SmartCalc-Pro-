import React from 'react';
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Settings, ChevronRight, LayoutDashboard } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-white px-5 pt-8 pb-32 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">User Identity</h1>
        <p className="text-xs font-bold text-[#8fa3c7] uppercase tracking-widest">System permission protocols</p>
      </div>

      <div className="premium-card p-6 flex items-center gap-6 rounded-[30px] border border-blue-500/20 shadow-glow/10">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10">
          <User className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tighter italic">MASTER 01 👋</h2>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 bg-blue-500/10 w-fit px-3 py-1 rounded-full border border-blue-500/20">Access: Level Alpha</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em] px-2 italic">Secured Data</h3>
          <div className="bg-white/5 border border-white/5 rounded-[25px] overflow-hidden backdrop-blur-md">
            <div className="p-5 flex items-center justify-between border-b border-white/5 group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold text-gray-400">Communication Node</span>
              </div>
              <span className="text-[10px] font-black text-[#8fa3c7] font-mono italic">user@legacy.hub</span>
            </div>
            <div className="p-5 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-gray-400">Encryption Status</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase font-mono italic">Enabled Secure</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-[#8fa3c7] uppercase tracking-[0.4em] px-2 italic">Control Matrix</h3>
          <div className="bg-white/5 border border-white/5 rounded-[25px] overflow-hidden backdrop-blur-md">
            {[
              { label: 'System Prefs', icon: <Settings className="w-5 h-5 text-indigo-500" />, path: '#' },
              { label: 'Admin Terminal', icon: <LayoutDashboard className="w-5 h-5 text-emerald-500" />, path: '/admin', highlight: true },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className={`w-full p-5 flex items-center justify-between border-b last:border-b-0 border-white/5 hover:bg-white/5 transition-all group ${item.highlight ? 'bg-blue-500/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
