import React, { useState, useEffect } from "react";
import FinanceHub from "../features/finance/FinanceHub";
import VehicleHub from "../features/vehicle/VehicleHub";
import EstateHub from "../features/estate/EstateHub";
import AdminPanel from "../features/admin/AdminPanel";
import GoldSilverHub from "../features/metals/GoldSilverHub";
import Dashboard from "../features/dashboard/Dashboard";
import Feedback from "../features/feedback/Feedback";
import AdminAccess from "../features/admin/AdminAccess";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AnimatePresence, motion } from "motion/react";
import FloatingMenu from "../components/ui/FloatingMenu";
import { observeAuth, logoutAdmin } from "../services/authService";

export default function Routes() {
  const [page, setPage] = useState<string>("dashboard");
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [showAdminGate, setShowAdminGate] = useState(false);

  useEffect(() => {
    const unsub = observeAuth((user) => {
      setAdminToken(user ? user.uid : null);
      setAuthInitialized(true);
    });

    return () => unsub();
  }, []);

  const navigate = (nextPage: string) => {
    const currentPage = page;

    // 🔐 Auto logout when LEAVING admin
    if (currentPage === "admin" && nextPage !== "admin") {
      handleAdminLogout();
    }

    // 🔐 If going to admin → check token
    if (nextPage === "admin" && !adminToken) {
      setShowAdminGate(true);
      return;
    }

    setPage(nextPage);
  };

  const handleAdminStepUp = (newAdminToken: string) => {
    setAdminToken(newAdminToken);
    setShowAdminGate(false);
    setPage("admin");
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    if (page === "admin") {
      setPage("dashboard");
    }
  };

  // 5-minute Inactivity Logout for Admin
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

    resetTimer();

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
        if (!authInitialized) {
          return (
            <div className="flex h-64 items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          );
        }
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
