"use client";

import { TrendingDown, TrendingUp, Scale } from "lucide-react";
import { useFinanceStore } from "@/store/finance-store";
import { formatCurrency } from "@/lib/utils";

export default function SummaryCards() {
  const getMonthlyExpenses = useFinanceStore((s) => s.getMonthlyExpenses);
  const getMonthlyIncome = useFinanceStore((s) => s.getMonthlyIncome);
  const getBalance = useFinanceStore((s) => s.getBalance);

  const expenses = getMonthlyExpenses();
  const income = getMonthlyIncome();
  const balance = getBalance();

  const cards = [
    {
      label: "Expenses",
      value: expenses,
      icon: TrendingDown,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-400/20",
      shadow: "shadow-rose-500/20",
    },
    {
      label: "Income",
      value: income,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-400/20",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Balance",
      value: balance,
      icon: Scale,
      gradient: "from-navy-600 to-navy-800",
      iconBg: "bg-white/15",
      shadow: "shadow-navy-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br ${card.gradient} p-3 md:p-6 shadow-lg ${card.shadow}`}
        >
          <div
            className={`w-8 h-8 md:w-11 md:h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-2 md:mb-3`}
          >
            <card.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <p className="text-[10px] md:text-xs font-medium text-white/70 uppercase tracking-wider">
            {card.label}
          </p>
          <p className="text-xs sm:text-sm md:text-xl lg:text-2xl font-bold text-white mt-0.5 md:mt-1 truncate">
            {formatCurrency(card.value)}
          </p>
          {/* Decorative circle */}
          <div className="absolute -right-3 -bottom-3 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/5" />
          <div className="hidden md:block absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/[0.03]" />
        </div>
      ))}
    </div>
  );
}
