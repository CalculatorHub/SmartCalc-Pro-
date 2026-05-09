import React, { useState, useEffect } from "react";
import FinanceHub from "../features/finance/FinanceHub";
import VehicleHub from "../features/vehicle/VehicleHub";
import EstateHub from "../features/estate/EstateHub";
import AdminPanel from "../features/admin/AdminPanel";
import Feedback from "../features/feedback/Feedback";
import GoldSilverHub from "../features/metals/GoldSilverHub";
import Dashboard from "../features/dashboard/Dashboard";
import Login from "../features/auth/Login";
import AdminAccess from "../features/admin/AdminAccess";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AnimatePresence, motion } from "motion/react";

import FloatingMenu from "../components/ui/FloatingMenu";

export default function Routes() {
  const [page, setPage] = useState<string>("dashboard");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || "unrestricted_session");
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("adminToken"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role") || "admin");
  const [showAdminGate, setShowAdminGate] = useState(false);

  const handleLogin = (newToken: string, newRole: string) => {
    setToken(newToken);
    setRole(newRole);
    setPage("dashboard");
  };

  const navigate = (nextPage: string) => {
    const currentPage = page;

    // 🔐 If going to admin → ask password
    if (nextPage === "admin" && !adminToken) {
      setShowAdminGate(true);
      return;
    }

    // 🔐 Auto logout ONLY when leaving admin
    if (currentPage === "admin" && nextPage !== "admin") {
      localStorage.removeItem("adminToken");
      setAdminToken(null);
      console.log("Admin session cleared on navigation");
    }

    setPage(nextPage);
  };

  const handleAdminStepUp = (newAdminToken: string) => {
    setAdminToken(newAdminToken);
    setShowAdminGate(false);
    setPage("admin");
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setAdminToken(null);
    setRole(role);
    setPage("dashboard");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    if (page === "admin") {
      setPage("dashboard");
    }
  };

  // 5-second Inactivity Logout for Admin
  useEffect(() => {
    if (!adminToken) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleAdminLogout();
        console.log("Admin session expired due to 5m inactivity");
      }, 5 * 60 * 1000); // 5 minutes
    };

    // Initial start
    resetTimer();

    // Listen for activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => document.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [adminToken, page]);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={navigate} />;
      case "finance": return <FinanceHub />;
      case "metals": return <GoldSilverHub />;
      case "vehicle": return <VehicleHub />;
      case "estate": return <EstateHub />;
      case "admin": 
        if (!adminToken) {
          return <Dashboard setPage={navigate} />;
        }
        return <AdminPanel onLogout={handleAdminLogout} />;
      case "feedback": return <Feedback />;
      default: return <Dashboard setPage={navigate} />;
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      <Header />
      
      <main className="relative min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🔐 ADMIN PASSWORD POPUP */}
      <AnimatePresence>
        {showAdminGate && (
          <AdminAccess 
            onSuccess={handleAdminStepUp} 
            onCancel={() => setShowAdminGate(false)} 
          />
        )}
      </AnimatePresence>

      <Footer setPage={navigate} activePage={page} />
      
      <FloatingMenu setPage={navigate} />
    </div>
  );
}
