"use client";

import MonthSelector from "@/components/month-selector";
import SummaryCards from "@/components/summary-cards";
import RecentTransactions from "@/components/recent-transactions";
import { Bell } from "lucide-react";
import { useFinanceStore } from "@/store/finance-store";
import { ICON_MAP } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="pt-safe md:pt-0">
      {/* Top App Bar */}
      <header className="px-4 pt-4 pb-3 md:px-8 md:pt-6 md:pb-5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-navy-900 tracking-tight truncate md:hidden">
              MoneySL
            </h1>
            <h1 className="hidden md:block text-2xl font-bold text-navy-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-[11px] text-navy-400 font-medium truncate md:text-sm md:mt-0.5">
              Personal Finance Tracker
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 md:gap-3">
            <MonthSelector />
            <button className="p-2 rounded-xl hover:bg-navy-50 text-navy-400 transition-colors relative shrink-0">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="px-4 mt-2 md:px-8 md:mt-1">
        <SummaryCards />
      </section>

      {/* Account Overview */}
      <AccountsStrip />

      {/* Desktop: two-column layout for transactions + quick stats */}
      <div className="md:px-8 md:mt-8 md:grid md:grid-cols-3 md:gap-6">
        {/* Recent Transactions - takes 2/3 on desktop */}
        <section className="px-4 mt-6 md:px-0 md:mt-0 md:col-span-2">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
              Recent Transactions
            </h3>
          </div>
          <RecentTransactions limit={15} />
        </section>

        {/* Quick Stats Panel — desktop only */}
        <aside className="hidden md:block md:col-span-1">
          <QuickStatsPanel />
        </aside>
      </div>
    </div>
  );
}

function AccountsStrip() {
  const accounts = useFinanceStore((s) => s.accounts);

  return (
    <section className="mt-4 md:px-8 md:mt-6">
      <h3 className="hidden md:block text-xs font-bold text-navy-800 uppercase tracking-wider mb-3">
        Accounts & Wallets
      </h3>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 pb-1 md:px-0 md:gap-3 md:grid md:grid-cols-3 lg:grid-cols-4">
        {accounts.map((acc) => {
          const Icon = ICON_MAP[acc.icon];
          return (
            <div
              key={acc.id}
              className="flex-shrink-0 flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-sm border border-navy-50 min-w-[160px] md:min-w-0"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                {Icon && <Icon className="w-4 h-4 md:w-[18px] md:h-[18px] text-navy-500" />}
              </div>
              <div>
                <p className="text-[11px] md:text-xs font-medium text-navy-400">
                  {acc.name}
                </p>
                <p className="text-sm md:text-base font-bold text-navy-800">
                  {formatCurrency(acc.balance)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Desktop-only right-hand quick stats panel */
function QuickStatsPanel() {
  const getMonthlyExpenses = useFinanceStore((s) => s.getMonthlyExpenses);
  const getMonthlyIncome = useFinanceStore((s) => s.getMonthlyIncome);
  const getBalance = useFinanceStore((s) => s.getBalance);
  const getMonthlyTransactions = useFinanceStore((s) => s.getMonthlyTransactions);

  const expenses = getMonthlyExpenses();
  const income = getMonthlyIncome();
  const balance = getBalance();
  const txCount = getMonthlyTransactions().length;

  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wider mb-3">Quick Stats</h3>

      {/* Savings Rate */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-navy-50">
        <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider">Savings Rate</p>
        <p className="text-3xl font-bold text-emerald-600 mt-1">{savingsRate}%</p>
        <div className="mt-3 h-2 bg-navy-50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{ width: `${Math.min(Math.max(parseFloat(savingsRate), 0), 100)}%` }}
          />
        </div>
      </div>

      {/* This month summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-navy-50 space-y-3">
        <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider">This Month</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-navy-500">Transactions</span>
          <span className="text-sm font-bold text-navy-800">{txCount}</span>
        </div>
        <div className="h-px bg-navy-50" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-navy-500">Income</span>
          <span className="text-sm font-bold text-emerald-600">{formatCurrency(income)}</span>
        </div>
        <div className="h-px bg-navy-50" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-navy-500">Expenses</span>
          <span className="text-sm font-bold text-rose-500">{formatCurrency(expenses)}</span>
        </div>
        <div className="h-px bg-navy-50" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-navy-500">Net Balance</span>
          <span className={`text-sm font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCurrency(balance)}</span>
        </div>
      </div>
    </div>
  );
}
