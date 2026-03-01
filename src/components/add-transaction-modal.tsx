"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowRightLeft, ChevronDown, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ICON_MAP,
  ICON_GROUPS,
  COLOR_SWATCHES,
  type TransactionType,
} from "@/lib/constants";
import { useFinanceStore } from "@/store/finance-store";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { key: TransactionType; label: string }[] = [
  { key: "expense", label: "Expense" },
  { key: "income", label: "Income" },
  { key: "transfer", label: "Transfer" },
];

export default function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [toAccount, setToAccount] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAccounts, setShowAccounts] = useState(false);
  const [showToAccounts, setShowToAccounts] = useState(false);
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");
  const [quickCategoryIcon, setQuickCategoryIcon] = useState("ShoppingCart");
  const [quickCategoryColor, setQuickCategoryColor] = useState(
    COLOR_SWATCHES[0]
  );

  const expenseCategories = useFinanceStore((s) => s.expenseCategories);
  const incomeCategories = useFinanceStore((s) => s.incomeCategories);
  const accounts = useFinanceStore((s) => s.accounts);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const addCategory = useFinanceStore((s) => s.addCategory);

  const categories =
    activeTab === "expense"
      ? [...expenseCategories].sort((a, b) => a.order - b.order)
      : [...incomeCategories].sort((a, b) => a.order - b.order);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setNote("");
      setSelectedCategory("");
      setSelectedAccount(accounts[0]?.id || "");
      setToAccount(accounts[1]?.id || "");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setActiveTab("expense");
    }
  }, [open, accounts]);

  // Set default category when tab changes
  useEffect(() => {
    setSelectedCategory("");
  }, [activeTab]);

  const handleSubmit = useCallback(() => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (activeTab === "transfer") {
      if (!selectedAccount || !toAccount || selectedAccount === toAccount) return;
      addTransaction({
        type: "transfer",
        categoryId: "",
        accountId: selectedAccount,
        toAccountId: toAccount,
        amount: amountNum,
        note,
        date: new Date(selectedDate).toISOString(),
      });
    } else {
      if (!selectedCategory) return;
      addTransaction({
        type: activeTab,
        categoryId: selectedCategory,
        accountId: selectedAccount,
        amount: amountNum,
        note,
        date: new Date(selectedDate).toISOString(),
      });
    }

    onClose();
  }, [
    amount,
    activeTab,
    selectedCategory,
    selectedAccount,
    toAccount,
    note,
    selectedDate,
    addTransaction,
    onClose,
  ]);

  const resetQuickAdd = useCallback(() => {
    setQuickCategoryName("");
    setQuickCategoryIcon("ShoppingCart");
    setQuickCategoryColor(COLOR_SWATCHES[0]);
  }, []);

  const handleQuickAddCategory = useCallback(() => {
    if (activeTab === "transfer") return;
    if (!quickCategoryName.trim()) return;

    const newCategory = addCategory({
      name: quickCategoryName.trim(),
      icon: quickCategoryIcon,
      color: quickCategoryColor,
      type: activeTab,
    });

    setSelectedCategory(newCategory.id);
    setShowQuickAddCategory(false);
    resetQuickAdd();
  }, [
    activeTab,
    quickCategoryName,
    quickCategoryIcon,
    quickCategoryColor,
    addCategory,
    resetQuickAdd,
  ]);

  const selectedAccountObj = accounts.find((a) => a.id === selectedAccount);
  const toAccountObj = accounts.find((a) => a.id === toAccount);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold text-navy-800">New Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-navy-50 text-navy-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-5 bg-navy-50 rounded-xl p-1 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === tab.key
                  ? tab.key === "expense"
                    ? "bg-rose-500 text-white shadow-sm"
                    : tab.key === "income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-blue-500 text-white shadow-sm"
                  : "text-navy-400 hover:text-navy-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-200px)] px-5 pb-5 space-y-4">
          {/* Amount Input */}
          <div className="bg-navy-50/50 rounded-2xl p-4">
            <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
              Amount (LKR)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-navy-300">Rs.</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 text-3xl font-bold text-navy-900 bg-transparent outline-none placeholder-navy-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoFocus
              />
            </div>
          </div>

          {/* Account Selector */}
          {activeTab === "transfer" ? (
            <div className="space-y-3">
              {/* From Account */}
              <div className="relative">
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
                  From Account
                </label>
                <button
                  onClick={() => {
                    setShowAccounts(!showAccounts);
                    setShowToAccounts(false);
                  }}
                  className="w-full flex items-center justify-between bg-navy-50/50 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2">
                    {selectedAccountObj && ICON_MAP[selectedAccountObj.icon] && (
                      <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                        {(() => {
                          const Icon = ICON_MAP[selectedAccountObj.icon];
                          return <Icon className="w-4 h-4 text-navy-600" />;
                        })()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-navy-700">
                      {selectedAccountObj?.name || "Select account"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-navy-400" />
                </button>
                {showAccounts && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-navy-100 z-10 overflow-hidden">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccount(acc.id);
                          setShowAccounts(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 p-3 hover:bg-navy-50 transition-colors text-left",
                          acc.id === selectedAccount && "bg-emerald-50"
                        )}
                      >
                        {ICON_MAP[acc.icon] && (() => {
                          const Icon = ICON_MAP[acc.icon];
                          return (
                            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-navy-600" />
                            </div>
                          );
                        })()}
                        <span className="text-sm font-medium text-navy-700">{acc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transfer Arrow */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              {/* To Account */}
              <div className="relative">
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
                  To Account
                </label>
                <button
                  onClick={() => {
                    setShowToAccounts(!showToAccounts);
                    setShowAccounts(false);
                  }}
                  className="w-full flex items-center justify-between bg-navy-50/50 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2">
                    {toAccountObj && ICON_MAP[toAccountObj.icon] && (
                      <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                        {(() => {
                          const Icon = ICON_MAP[toAccountObj.icon];
                          return <Icon className="w-4 h-4 text-navy-600" />;
                        })()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-navy-700">
                      {toAccountObj?.name || "Select account"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-navy-400" />
                </button>
                {showToAccounts && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-navy-100 z-10 overflow-hidden">
                    {accounts
                      .filter((a) => a.id !== selectedAccount)
                      .map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            setToAccount(acc.id);
                            setShowToAccounts(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2 p-3 hover:bg-navy-50 transition-colors text-left",
                            acc.id === toAccount && "bg-blue-50"
                          )}
                        >
                          {ICON_MAP[acc.icon] && (() => {
                            const Icon = ICON_MAP[acc.icon];
                            return (
                              <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-navy-600" />
                              </div>
                            );
                          })()}
                          <span className="text-sm font-medium text-navy-700">{acc.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Account row */}
              <div className="relative">
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
                  Account
                </label>
                <button
                  onClick={() => setShowAccounts(!showAccounts)}
                  className="w-full flex items-center justify-between bg-navy-50/50 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2">
                    {selectedAccountObj && ICON_MAP[selectedAccountObj.icon] && (
                      <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                        {(() => {
                          const Icon = ICON_MAP[selectedAccountObj.icon];
                          return <Icon className="w-4 h-4 text-navy-600" />;
                        })()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-navy-700">
                      {selectedAccountObj?.name || "Select account"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-navy-400" />
                </button>
                {showAccounts && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-navy-100 z-10 overflow-hidden">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          setSelectedAccount(acc.id);
                          setShowAccounts(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 p-3 hover:bg-navy-50 transition-colors text-left",
                          acc.id === selectedAccount && "bg-emerald-50"
                        )}
                      >
                        {ICON_MAP[acc.icon] && (() => {
                          const Icon = ICON_MAP[acc.icon];
                          return (
                            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-navy-600" />
                            </div>
                          );
                        })()}
                        <span className="text-sm font-medium text-navy-700">{acc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Grid */}
              <div>
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const Icon = ICON_MAP[cat.icon];
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all border-2",
                          isSelected
                            ? "border-current bg-opacity-10 scale-[1.02]"
                            : "border-transparent hover:bg-navy-50"
                        )}
                        style={
                          isSelected
                            ? {
                                borderColor: cat.color,
                                backgroundColor: `${cat.color}10`,
                              }
                            : undefined
                        }
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          {Icon && (
                            <Icon
                              className="w-5 h-5"
                              style={{ color: cat.color }}
                            />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-navy-600 text-center leading-tight line-clamp-2">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowQuickAddCategory(true)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed border-navy-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-navy-50">
                      <Plus className="w-5 h-5 text-navy-400" />
                    </div>
                    <span className="text-[10px] font-medium text-navy-500 text-center leading-tight line-clamp-2">
                      Add New
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Note */}
          <div>
            <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full bg-navy-50/50 rounded-xl p-3 text-sm text-navy-800 outline-none placeholder-navy-300 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-navy-50/50 rounded-xl p-3 text-sm text-navy-800 outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              (activeTab !== "transfer" && !selectedCategory)
            }
            className={cn(
              "w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]",
              activeTab === "expense"
                ? "bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25"
                : activeTab === "income"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25"
            )}
          >
            {activeTab === "expense"
              ? "Add Expense"
              : activeTab === "income"
              ? "Add Income"
              : "Transfer"}
          </button>
        </div>
      </div>

      {showQuickAddCategory && activeTab !== "transfer" && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => {
              setShowQuickAddCategory(false);
              resetQuickAdd();
            }}
          />

          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[88vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-navy-50">
              <div>
                <h3 className="text-base font-bold text-navy-800">New Category</h3>
                <p className="text-[11px] text-navy-400 font-medium">
                  {activeTab === "expense" ? "Expense" : "Income"} category
                </p>
              </div>
              <button
                onClick={() => {
                  setShowQuickAddCategory(false);
                  resetQuickAdd();
                }}
                className="p-2 rounded-xl hover:bg-navy-50 text-navy-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(88vh-140px)] px-5 py-4 space-y-4">
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${quickCategoryColor}15` }}
                  >
                    {ICON_MAP[quickCategoryIcon] && (() => {
                      const Icon = ICON_MAP[quickCategoryIcon];
                      return (
                        <Icon
                          className="w-7 h-7"
                          style={{ color: quickCategoryColor }}
                        />
                      );
                    })()}
                  </div>
                  <p className="text-xs font-semibold text-navy-700">
                    {quickCategoryName || "Category Name"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
                  Category Name
                </label>
                <input
                  type="text"
                  value={quickCategoryName}
                  onChange={(e) => setQuickCategoryName(e.target.value)}
                  placeholder="e.g., Tuition Class"
                  className="w-full bg-navy-50/50 rounded-xl p-3 text-sm text-navy-800 outline-none placeholder-navy-300 focus:ring-2 focus:ring-emerald-500/30"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2 block">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      onClick={() => setQuickCategoryColor(color)}
                      className={cn(
                        "w-9 h-9 rounded-xl transition-all flex items-center justify-center",
                        quickCategoryColor === color
                          ? "ring-2 ring-offset-2 scale-105"
                          : "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: color,
                        // @ts-expect-error: Tailwind ring-color custom property
                        "--tw-ring-color": color,
                      }}
                    >
                      {quickCategoryColor === color && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2 block">
                  Icon
                </label>
                <div className="space-y-3">
                  {Object.entries(ICON_GROUPS).map(([group, icons]) => (
                    <div key={group}>
                      <p className="text-[11px] font-medium text-navy-300 mb-2">
                        {group}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {icons.map((iconName) => {
                          const Icon = ICON_MAP[iconName];
                          if (!Icon) return null;
                          return (
                            <button
                              key={iconName}
                              onClick={() => setQuickCategoryIcon(iconName)}
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                                quickCategoryIcon === iconName
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-transparent bg-navy-50 hover:bg-navy-100"
                              )}
                            >
                              <Icon
                                className="w-5 h-5"
                                style={{
                                  color:
                                    quickCategoryIcon === iconName
                                      ? quickCategoryColor
                                      : "#64748b",
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-navy-50">
              <button
                onClick={handleQuickAddCategory}
                disabled={!quickCategoryName.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
