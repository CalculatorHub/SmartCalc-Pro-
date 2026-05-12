import React from 'react';
import { User, Mail, Shield, Settings, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="px-5 pt-6 pb-32 font-sans">
      <h1 className="text-2xl font-black italic tracking-tight mb-8 uppercase">Profile</h1>

      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl flex items-center gap-5">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight italic">User 👋</h2>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Matrix Protocol Access Level: Core</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Account Details</h3>
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-300">Email Address</span>
            </div>
            <span className="text-[11px] font-black text-gray-500">user@example.com</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-bold text-gray-300">Security Status</span>
            </div>
            <span className="text-[11px] font-black text-emerald-500 uppercase">AES-256 Active</span>
          </div>
        </div>

        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 pt-4">Global Settings</h3>
        <div className="bg-white/5 border border-white/10 rounded-3xl shadow-xl">
          <button className="w-full p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-300">Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-300">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
