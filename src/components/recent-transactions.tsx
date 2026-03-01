"use client";

import { useFinanceStore } from "@/store/finance-store";
import { ICON_MAP } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Trash2, ArrowRightLeft, Receipt } from "lucide-react";

interface RecentTransactionsProps {
  limit?: number;
}

export default function RecentTransactions({ limit = 10 }: RecentTransactionsProps) {
  const getMonthlyTransactions = useFinanceStore(
    (s) => s.getMonthlyTransactions
  );
  const getCategoryById = useFinanceStore((s) => s.getCategoryById);
  const getAccountById = useFinanceStore((s) => s.getAccountById);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const transactions = getMonthlyTransactions().slice(0, limit);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-navy-50 flex items-center justify-center mb-4">
          <Receipt className="w-10 h-10 text-navy-300" />
        </div>
        <h3 className="text-base font-semibold text-navy-700 mb-1">
          No transactions yet
        </h3>
        <p className="text-sm text-navy-400 max-w-[240px] md:max-w-sm">
          Tap the <span className="text-emerald-600 font-semibold">+</span> button to add your first expense or income.
        </p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, typeof transactions> = {};
  transactions.forEach((tx) => {
    const dateKey = tx.date.split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(tx);
  });

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([dateKey, txs]) => (
        <div key={dateKey}>
          <p className="text-[11px] md:text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2 px-1">
            {format(new Date(dateKey), "EEEE, MMM d")}
          </p>
          <div className="space-y-2">
            {txs.map((tx) => {
              const category = getCategoryById(tx.categoryId);
              const account = getAccountById(tx.accountId);
              const IconComponent =
                tx.type === "transfer"
                  ? ArrowRightLeft
                  : category
                  ? ICON_MAP[category.icon] || Receipt
                  : Receipt;
              const iconColor =
                tx.type === "transfer" ? "#3b82f6" : category?.color || "#64748b";

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 bg-white rounded-2xl p-3 md:px-5 md:py-4 shadow-sm border border-navy-50 group hover:border-navy-100 md:hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: iconColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-semibold text-navy-800 truncate">
                      {tx.type === "transfer"
                        ? "Transfer"
                        : category?.name || "Unknown"}
                    </p>
                    <p className="text-[11px] text-navy-400 truncate">
                      {tx.note || account?.name || ""}
                      {tx.type === "transfer" && tx.toAccountId && (
                        <>
                          {" "}
                          {account?.name} → {getAccountById(tx.toAccountId)?.name}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm md:text-base font-bold",
                        tx.type === "expense"
                          ? "text-rose-500"
                          : tx.type === "income"
                          ? "text-emerald-600"
                          : "text-blue-500"
                      )}
                    >
                      {tx.type === "expense" ? "-" : tx.type === "income" ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 text-navy-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
