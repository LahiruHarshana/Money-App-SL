"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutList,
  BarChart3,
  Plus,
  FileText,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AddTransactionModal from "@/components/add-transaction-modal";

const NAV_ITEMS = [
  { href: "/", icon: LayoutList, label: "Records" },
  { href: "/charts", icon: BarChart3, label: "Charts" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/profile", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-64 bg-white/95 backdrop-blur-sm border-r border-navy-100/80 flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-navy-900 tracking-tight leading-tight">
              MoneySL
            </h1>
            <p className="text-[10px] text-navy-400 font-medium">
              Finance Tracker
            </p>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="px-4 mb-5">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-sm">New Transaction</span>
          </button>
        </div>

        {/* Section label */}
        <p className="px-6 mb-2 text-[10px] font-semibold text-navy-300 uppercase tracking-widest">
          Menu
        </p>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-navy-500 hover:bg-navy-50/70 hover:text-navy-700"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive
                      ? "text-emerald-600"
                      : "text-navy-400 group-hover:text-navy-600"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[13px]",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-navy-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-50 flex items-center justify-center text-xs font-bold text-navy-500">M</div>
            <div>
              <p className="text-[11px] font-semibold text-navy-700">MoneySL User</p>
              <p className="text-[10px] text-navy-300">Sri Lanka</p>
            </div>
          </div>
        </div>
      </aside>

      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}
