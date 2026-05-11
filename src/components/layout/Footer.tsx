import React from "react";
import { Home, Coins, Car } from "lucide-react";
import NavItem from "../ui/NavItem";

interface FooterProps {
  setPage: (page: string) => void;
  activePage: string;
}

export default function Footer({ setPage, activePage }: FooterProps) {
  const items = [
    { key: "finance", label: "Finance", icon: <span className="text-xl">₹</span> },
    { key: "metals", label: "Gold", icon: <span className="text-xl">🪙</span> },
    { key: "vehicle", label: "Vehicle", icon: <span className="text-xl">🚗</span> },
    { key: "estate", label: "Estate", icon: <span className="text-xl">🏠</span> },
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
      </div>
    </footer>
  );
}
