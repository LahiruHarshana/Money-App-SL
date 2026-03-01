"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutList,
  BarChart3,
  Plus,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AddTransactionModal from "@/components/add-transaction-modal";

const NAV_ITEMS = [
  { href: "/", icon: LayoutList, label: "Records" },
  { href: "/charts", icon: BarChart3, label: "Charts" },
  { href: "#add", icon: Plus, label: "Add", isCenter: true },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/profile", icon: User, label: "Me" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-navy-100/50 pb-safe md:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            if (item.isCenter) {
              return (
                <button
                  key="add"
                  onClick={() => setShowAddModal(true)}
                  className="relative -mt-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform"
                >
                  <Plus className="w-7 h-7" strokeWidth={2.5} />
                </button>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors",
                  isActive
                    ? "text-emerald-600"
                    : "text-navy-400 hover:text-navy-600"
                )}
              >
                <Icon
                  className={cn("w-5 h-5", isActive && "stroke-[2.5]")}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <AddTransactionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}
