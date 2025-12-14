import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Wallet, FolderOpen, Target, PiggyBank, Receipt, BarChart3, Settings } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { path: "/transactions", icon: ArrowLeftRight, label: "Transaksi" },
    { path: "/wallets", icon: Wallet, label: "Wallet" },
    { path: "/categories", icon: FolderOpen, label: "Kategori" },
    { path: "/budgets", icon: Target, label: "Budget" },
    { path: "/goals", icon: PiggyBank, label: "Goals" },
    { path: "/bills", icon: Receipt, label: "Tagihan" },
    { path: "/reports", icon: BarChart3, label: "Laporan" },
    { path: "/settings", icon: Settings, label: "Pengaturan" },
  ];

  return (
    <nav className="bottom-nav" style={{ overflowX: "auto", overflowY: "hidden", justifyContent: "flex-start" }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link key={item.path} to={item.path} className={`bottom-nav-item ${isActive ? "active" : ""}`}>
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
