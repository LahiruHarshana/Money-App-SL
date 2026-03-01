"use client";

import { useFinanceStore } from "@/store/finance-store";
import { ICON_MAP } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { PieChart, TrendingDown, TrendingUp } from "lucide-react";

export default function ChartsPage() {
  const getMonthlyTransactions = useFinanceStore((s) => s.getMonthlyTransactions);
  const getCategoryById = useFinanceStore((s) => s.getCategoryById);
  const getMonthlyExpenses = useFinanceStore((s) => s.getMonthlyExpenses);
  const getMonthlyIncome = useFinanceStore((s) => s.getMonthlyIncome);

  const transactions = getMonthlyTransactions();
  const totalExpenses = getMonthlyExpenses();
  const totalIncome = getMonthlyIncome();

  // Aggregate expenses by category
  const expenseByCategory: Record<string, { name: string; icon: string; color: string; amount: number }> = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      const cat = getCategoryById(tx.categoryId);
      if (!cat) return;
      if (!expenseByCategory[cat.id]) {
        expenseByCategory[cat.id] = {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          amount: 0,
        };
      }
      expenseByCategory[cat.id].amount += tx.amount;
    });

  const expenseEntries = Object.values(expenseByCategory).sort(
    (a, b) => b.amount - a.amount
  );

  // Aggregate income by category
  const incomeByCategory: Record<string, { name: string; icon: string; color: string; amount: number }> = {};
  transactions
    .filter((tx) => tx.type === "income")
    .forEach((tx) => {
      const cat = getCategoryById(tx.categoryId);
      if (!cat) return;
      if (!incomeByCategory[cat.id]) {
        incomeByCategory[cat.id] = {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          amount: 0,
        };
      }
      incomeByCategory[cat.id].amount += tx.amount;
    });

  const incomeEntries = Object.values(incomeByCategory).sort(
    (a, b) => b.amount - a.amount
  );

  const isEmpty = transactions.length === 0;

  return (
    <div className="pt-safe md:pt-0">
      <header className="px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-navy-900 tracking-tight">
          Charts
        </h1>
        <p className="text-xs text-navy-400 font-medium">Spending breakdown</p>
      </header>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 rounded-3xl bg-navy-50 flex items-center justify-center mb-4">
            <PieChart className="w-10 h-10 text-navy-300" />
          </div>
          <h3 className="text-base font-semibold text-navy-700 mb-1">
            No data yet
          </h3>
          <p className="text-sm text-navy-400 max-w-[240px]">
            Add some transactions to see your spending breakdown here.
          </p>
        </div>
      ) : (
        <div className="px-4 space-y-6 mt-2 md:px-8 md:mt-4">
          {/* Desktop: chart & breakdowns side-by-side */}
          <div className="md:grid md:grid-cols-5 md:gap-6 md:space-y-0 space-y-6">
            {/* Visual Ring Chart */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-navy-50 md:col-span-2 md:self-start">
              <h3 className="hidden md:block text-xs font-bold text-navy-800 uppercase tracking-wider mb-4">Expense Distribution</h3>
              <div className="flex items-center justify-center mb-4 md:mb-0">
                <DonutChart entries={expenseEntries} total={totalExpenses} />
              </div>
            </div>

            {/* Breakdowns column */}
            <div className="md:col-span-3 space-y-6">

              {/* Expense Breakdown */}
              {expenseEntries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                      Expenses Breakdown
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {expenseEntries.map((entry) => {
                      const Icon = ICON_MAP[entry.icon];
                      const pct = totalExpenses > 0 ? (entry.amount / totalExpenses) * 100 : 0;
                      return (
                        <div
                          key={entry.name}
                          className="bg-white rounded-2xl p-3 shadow-sm border border-navy-50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${entry.color}15` }}
                            >
                              {Icon && (
                                <Icon className="w-5 h-5" style={{ color: entry.color }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-navy-800 truncate">
                                  {entry.name}
                                </p>
                                <p className="text-sm font-bold text-navy-800 shrink-0 ml-2">
                                  {formatCurrency(entry.amount)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-navy-50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: entry.color,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] font-semibold text-navy-400 shrink-0 w-10 text-right">
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Income Breakdown */}
              {incomeEntries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                      Income Breakdown
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {incomeEntries.map((entry) => {
                      const Icon = ICON_MAP[entry.icon];
                      const pct = totalIncome > 0 ? (entry.amount / totalIncome) * 100 : 0;
                      return (
                        <div
                          key={entry.name}
                          className="bg-white rounded-2xl p-3 shadow-sm border border-navy-50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${entry.color}15` }}
                            >
                              {Icon && (
                                <Icon className="w-5 h-5" style={{ color: entry.color }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-navy-800 truncate">
                                  {entry.name}
                                </p>
                                <p className="text-sm font-bold text-emerald-600 shrink-0 ml-2">
                                  {formatCurrency(entry.amount)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-navy-50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: entry.color,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] font-semibold text-navy-400 shrink-0 w-10 text-right">
                                  {pct.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>{/* end breakdowns column */}
          </div>{/* end desktop grid */}
        </div>
      )}
    </div>
  );
}

// Simple CSS-only donut chart
function DonutChart({
  entries,
  total,
}: {
  entries: { name: string; color: string; amount: number }[];
  total: number;
}) {
  if (entries.length === 0 || total === 0) {
    return (
      <div className="w-48 h-48 md:w-52 md:h-52 rounded-full border-[16px] border-navy-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-navy-800">Rs. 0</p>
          <p className="text-[11px] text-navy-400 font-medium">Total</p>
        </div>
      </div>
    );
  }

  // Build conic gradient
  const { stops } = entries.reduce((acc, entry) => {
    const pct = (entry.amount / total) * 100;
    const end = acc.accumulated + pct;
    acc.stops.push(`${entry.color} ${acc.accumulated}% ${end}%`);
    acc.accumulated = end;
    return acc;
  }, { accumulated: 0, stops: [] as string[] });

  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div
      className="w-48 h-48 md:w-52 md:h-52 rounded-full flex items-center justify-center relative"
      style={{ background: gradient }}
    >
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-navy-800">
            {formatCurrency(total)}
          </p>
          <p className="text-[11px] text-navy-400 font-medium">Total Spent</p>
        </div>
      </div>
    </div>
  );
}
