import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8 pt-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Smartcalpro<span className="text-brand-500">+</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-tight">
          Neural Intelligence
        </p>
      </div>
    </header>
  );
}
