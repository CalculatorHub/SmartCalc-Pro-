import React, { useEffect, useState } from "react";
import Routes from "./app/routes";

export default function App() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>
      
      <Routes />
    </div>
  );
}
