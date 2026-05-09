import React from "react";
import { Home, IndianRupee, Coins, Car, ShieldCheck, MessageSquare, LayoutDashboard } from "lucide-react";
import NavItem from "../ui/NavItem";

interface FooterProps {
  setPage: (page: string) => void;
  activePage: string;
}

export default function Footer({ setPage, activePage }: FooterProps) {
  const role = localStorage.getItem("role");

  const items = [
    { key: "dashboard", label: "Hub", icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: "finance", label: "Finance", icon: <IndianRupee className="w-5 h-5" /> },
    { key: "metals", label: "Metals", icon: <Coins className="w-5 h-5" /> },
    { key: "estate", label: "Estate", icon: <Home className="w-5 h-5" /> },
    { key: "vehicle", label: "Vehicle", icon: <Car className="w-5 h-5" /> },
    { key: "feedback", label: "Msg", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 glass-nav flex justify-around items-center py-4 px-2 z-40 safe-area-bottom">
      <div className="flex justify-around items-center w-full max-w-md mx-auto">
        {items.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={activePage === item.key}
            onClick={() => setPage(item.key)}
          />
        ))}
        {role === "admin" && (
          <NavItem
            label="Admin"
            icon={<ShieldCheck className="w-5 h-5" />}
            active={activePage === "admin"}
            onClick={() => setPage("admin")}
          />
        )}
      </div>
    </footer>
  );
}
