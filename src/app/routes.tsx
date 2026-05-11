import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AnimatePresence, motion } from "motion/react";
import FloatingMenu from "../components/ui/FloatingMenu";

// Lazy Components
const Dashboard = lazy(() => import("../features/dashboard/Dashboard"));
const FinanceHub = lazy(() => import("../features/finance/FinanceHub"));
const VehicleHub = lazy(() => import("../features/vehicle/VehicleHub"));
const EstateHub = lazy(() => import("../features/estate/EstateHub"));
const GoldSilverHub = lazy(() => import("../features/metals/GoldSilverHub"));

function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Routes() {
  const [page, setPage] = useState<string>("dashboard");

  const navigate = (nextPage: string) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={navigate} />;
      case "finance": return <FinanceHub />;
      case "metals": return <GoldSilverHub />;
      case "vehicle": return <VehicleHub />;
      case "estate": return <EstateHub />;
      default: return <Dashboard setPage={navigate} />;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 overflow-x-hidden">
      <Header />
      
      <main className="relative min-h-[70vh]">
        <Suspense fallback={<Loading />}>
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
        </Suspense>
      </main>

      <Footer setPage={navigate} activePage={page} />
      <FloatingMenu setPage={navigate} />
    </div>
  );
}
