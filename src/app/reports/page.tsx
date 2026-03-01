"use client";

import { useFinanceStore } from "@/store/finance-store";
import { formatCurrency } from "@/lib/utils";
import { FileBarChart, TrendingDown, TrendingUp, Scale, Calendar } from "lucide-react";

export default function ReportsPage() {
  const getMonthlyTransactions = useFinanceStore((s) => s.getMonthlyTransactions);
  const getMonthlyExpenses = useFinanceStore((s) => s.getMonthlyExpenses);
  const getMonthlyIncome = useFinanceStore((s) => s.getMonthlyIncome);
  const getBalance = useFinanceStore((s) => s.getBalance);
  const transactions = useFinanceStore((s) => s.transactions);

  const monthlyTx = getMonthlyTransactions();
  const expenses = getMonthlyExpenses();
  const income = getMonthlyIncome();
  const balance = getBalance();

  const expenseCount = monthlyTx.filter((tx) => tx.type === "expense").length;
  const incomeCount = monthlyTx.filter((tx) => tx.type === "income").length;
  const avgExpense = expenseCount > 0 ? expenses / expenseCount : 0;

  // Daily spending this month
  const daysWithExpenses = new Set(
    monthlyTx
      .filter((tx) => tx.type === "expense")
      .map((tx) => tx.date.split("T")[0])
  ).size;
  const avgDailySpend = daysWithExpenses > 0 ? expenses / daysWithExpenses : 0;

  const isEmpty = monthlyTx.length === 0;

  return (
    <div className="pt-safe md:pt-0">
      <header className="px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-navy-900 tracking-tight">
          Reports
        </h1>
        <p className="text-xs text-navy-400 font-medium">Monthly summary</p>
      </header>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 rounded-3xl bg-navy-50 flex items-center justify-center mb-4">
            <FileBarChart className="w-10 h-10 text-navy-300" />
          </div>
          <h3 className="text-base font-semibold text-navy-700 mb-1">
            No reports yet
          </h3>
          <p className="text-sm text-navy-400 max-w-[240px]">
            Add transactions to generate monthly reports.
          </p>
        </div>
      ) : (
        <div className="px-4 space-y-4 mt-2 md:px-8 md:mt-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 md:space-y-0">
          {/* Overview Card */}
          <div className="bg-gradient-to-br from-navy-700 to-navy-900 rounded-3xl p-5 md:p-6 text-white md:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-semibold text-white/70 mb-4">
              Monthly Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-medium text-white/60 uppercase">
                    Income
                  </span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(income)}</p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {incomeCount} entries
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-medium text-white/60 uppercase">
                    Expenses
                  </span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(expenses)}</p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {expenseCount} entries
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-medium text-white/60 uppercase">
                    Balance
                  </span>
                </div>
                <p className={`text-lg font-bold ${balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-2 lg:grid-cols-2">
            <StatCard
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Avg. Daily Spend"
              value={formatCurrency(avgDailySpend)}
              bg="bg-blue-50"
            />
            <StatCard
              icon={<TrendingDown className="w-5 h-5 text-rose-500" />}
              label="Avg. per Expense"
              value={formatCurrency(avgExpense)}
              bg="bg-rose-50"
            />
            <StatCard
              icon={<FileBarChart className="w-5 h-5 text-indigo-500" />}
              label="Total Transactions"
              value={monthlyTx.length.toString()}
              bg="bg-indigo-50"
            />
            <StatCard
              icon={<Scale className="w-5 h-5 text-emerald-500" />}
              label="Savings Rate"
              value={
                income > 0
                  ? `${((balance / income) * 100).toFixed(1)}%`
                  : "N/A"
              }
              bg="bg-emerald-50"
            />
          </div>

          {/* All-time stats */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-navy-50 md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold text-navy-800 mb-3">
              All-Time Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-navy-400">Total transactions recorded</span>
                <span className="font-semibold text-navy-800">
                  {transactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">All-time expenses</span>
                <span className="font-semibold text-rose-500">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.type === "expense")
                      .reduce((s, t) => s + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-400">All-time income</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.type === "income")
                      .reduce((s, t) => s + t.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-navy-50">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-[11px] font-medium text-navy-400">{label}</p>
      <p className="text-base font-bold text-navy-800 mt-0.5">{value}</p>
    </div>
  );
}
