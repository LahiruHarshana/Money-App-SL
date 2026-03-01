"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Transaction,
  type Category,
  type Account,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_ACCOUNTS,
} from "@/lib/constants";
import { generateId } from "@/lib/utils";

interface FinanceState {
  // Data
  transactions: Transaction[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  accounts: Account[];
  selectedMonth: number; // 0-11
  selectedYear: number;

  // Actions - Transactions
  addTransaction: (
    tx: Omit<Transaction, "id" | "createdAt">
  ) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Categories
  addCategory: (cat: Omit<Category, "id" | "order">) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (type: "expense" | "income", categories: Category[]) => void;

  // Actions - Accounts
  updateAccountBalance: (id: string, amount: number) => void;

  // Actions - Navigation
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;

  // Computed helpers
  getMonthlyTransactions: () => Transaction[];
  getMonthlyExpenses: () => number;
  getMonthlyIncome: () => number;
  getBalance: () => number;
  getCategoryById: (id: string) => Category | undefined;
  getAccountById: (id: string) => Account | undefined;
}

const now = new Date();

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
      incomeCategories: DEFAULT_INCOME_CATEGORIES,
      accounts: DEFAULT_ACCOUNTS,
      selectedMonth: now.getMonth(),
      selectedYear: now.getFullYear(),

      // ── Transaction Actions ────────────────────────────────
      addTransaction: (tx) => {
        const newTx: Transaction = {
          ...tx,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const newAccounts = state.accounts.map((acc) => {
            if (tx.type === "expense" && acc.id === tx.accountId) {
              return { ...acc, balance: acc.balance - tx.amount };
            }
            if (tx.type === "income" && acc.id === tx.accountId) {
              return { ...acc, balance: acc.balance + tx.amount };
            }
            if (tx.type === "transfer") {
              if (acc.id === tx.accountId) {
                return { ...acc, balance: acc.balance - tx.amount };
              }
              if (acc.id === tx.toAccountId) {
                return { ...acc, balance: acc.balance + tx.amount };
              }
            }
            return acc;
          });

          return {
            transactions: [newTx, ...state.transactions],
            accounts: newAccounts,
          };
        });
      },

      deleteTransaction: (id) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === id);
        if (!tx) return;

        set((s) => {
          // Reverse the balance effect
          const newAccounts = s.accounts.map((acc) => {
            if (tx.type === "expense" && acc.id === tx.accountId) {
              return { ...acc, balance: acc.balance + tx.amount };
            }
            if (tx.type === "income" && acc.id === tx.accountId) {
              return { ...acc, balance: acc.balance - tx.amount };
            }
            if (tx.type === "transfer") {
              if (acc.id === tx.accountId) {
                return { ...acc, balance: acc.balance + tx.amount };
              }
              if (acc.id === tx.toAccountId) {
                return { ...acc, balance: acc.balance - tx.amount };
              }
            }
            return acc;
          });

          return {
            transactions: s.transactions.filter((t) => t.id !== id),
            accounts: newAccounts,
          };
        });
      },

      // ── Category Actions ───────────────────────────────────
      addCategory: (cat) => {
        const newCat: Category = {
          ...cat,
          id: generateId(),
          order:
            cat.type === "expense"
              ? get().expenseCategories.length
              : get().incomeCategories.length,
        };

        set((state) => {
          if (cat.type === "expense") {
            return {
              expenseCategories: [...state.expenseCategories, newCat],
            };
          }
          return {
            incomeCategories: [...state.incomeCategories, newCat],
          };
        });

        return newCat;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          incomeCategories: state.incomeCategories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          expenseCategories: state.expenseCategories.filter(
            (c) => c.id !== id
          ),
          incomeCategories: state.incomeCategories.filter(
            (c) => c.id !== id
          ),
        }));
      },

      reorderCategories: (type, categories) => {
        const normalized = categories.map((cat, index) => ({
          ...cat,
          order: index,
        }));

        set(() => {
          if (type === "expense") {
            return { expenseCategories: normalized };
          }
          return { incomeCategories: normalized };
        });
      },

      // ── Account Actions ────────────────────────────────────
      updateAccountBalance: (id, amount) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, balance: amount } : a
          ),
        }));
      },

      // ── Navigation Actions ─────────────────────────────────
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),

      // ── Computed Helpers ───────────────────────────────────
      getMonthlyTransactions: () => {
        const { transactions, selectedMonth, selectedYear } = get();
        return transactions.filter((tx) => {
          const d = new Date(tx.date);
          return (
            d.getMonth() === selectedMonth &&
            d.getFullYear() === selectedYear
          );
        });
      },

      getMonthlyExpenses: () => {
        return get()
          .getMonthlyTransactions()
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + tx.amount, 0);
      },

      getMonthlyIncome: () => {
        return get()
          .getMonthlyTransactions()
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + tx.amount, 0);
      },

      getBalance: () => {
        return get().getMonthlyIncome() - get().getMonthlyExpenses();
      },

      getCategoryById: (id) => {
        const s = get();
        return (
          s.expenseCategories.find((c) => c.id === id) ||
          s.incomeCategories.find((c) => c.id === id)
        );
      },

      getAccountById: (id) => {
        return get().accounts.find((a) => a.id === id);
      },
    }),
    {
      name: "money-app-storage",
    }
  )
);
