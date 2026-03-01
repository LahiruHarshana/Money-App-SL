import {
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Smartphone,
  Home,
  GraduationCap,
  Heart,
  Plane,
  Shirt,
  Film,
  Gift,
  Coffee,
  Fuel,
  Stethoscope,
  Baby,
  Dumbbell,
  PiggyBank,
  Banknote,
  CreditCard,
  Wallet,
  Building2,
  TrendingUp,
  Landmark,
  HandCoins,
  Bus,
  type LucideIcon,
} from "lucide-react";

// ── Category Types ─────────────────────────────────────────
export type TransactionType = "expense" | "income" | "transfer";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  order: number;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  toAccountId?: string; // for transfers
  amount: number;
  note: string;
  date: string; // ISO date string
  createdAt: string;
}

// ── Icon Registry ──────────────────────────────────────────
export const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Smartphone,
  Home,
  GraduationCap,
  Heart,
  Plane,
  Shirt,
  Film,
  Gift,
  Coffee,
  Fuel,
  Stethoscope,
  Baby,
  Dumbbell,
  PiggyBank,
  Banknote,
  CreditCard,
  Wallet,
  Building2,
  TrendingUp,
  Landmark,
  HandCoins,
  Bus,
};

export const ICON_GROUPS = {
  "Daily Life": ["ShoppingCart", "Utensils", "Coffee", "Fuel", "Bus", "Car"],
  "Bills & Home": ["Home", "Zap", "Smartphone", "CreditCard"],
  "Health & Family": ["Heart", "Stethoscope", "Baby", "Dumbbell"],
  Entertainment: ["Film", "Gift", "Plane", "Shirt"],
  Finance: [
    "Banknote",
    "PiggyBank",
    "Wallet",
    "Building2",
    "TrendingUp",
    "Landmark",
    "HandCoins",
    "GraduationCap",
  ],
};

// ── Color Swatches ─────────────────────────────────────────
export const COLOR_SWATCHES = [
  "#f43f5e", // rose
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#64748b", // slate
  "#78716c", // stone
];

// ── Default Categories (Sri Lanka Market) ──────────────────
export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: "exp-1", name: "Groceries / Keells", icon: "ShoppingCart", color: "#10b981", type: "expense", order: 0 },
  { id: "exp-2", name: "Tuk-Tuk / Transport", icon: "Car", color: "#f59e0b", type: "expense", order: 1 },
  { id: "exp-3", name: "Food & Dining", icon: "Utensils", color: "#ef4444", type: "expense", order: 2 },
  { id: "exp-4", name: "CEB / Water Bills", icon: "Zap", color: "#3b82f6", type: "expense", order: 3 },
  { id: "exp-5", name: "Mobile Reloads", icon: "Smartphone", color: "#8b5cf6", type: "expense", order: 4 },
  { id: "exp-6", name: "Rent / Housing", icon: "Home", color: "#64748b", type: "expense", order: 5 },
  { id: "exp-7", name: "Education", icon: "GraduationCap", color: "#06b6d4", type: "expense", order: 6 },
  { id: "exp-8", name: "Healthcare", icon: "Stethoscope", color: "#f43f5e", type: "expense", order: 7 },
  { id: "exp-9", name: "Entertainment", icon: "Film", color: "#d946ef", type: "expense", order: 8 },
  { id: "exp-10", name: "Clothing", icon: "Shirt", color: "#ec4899", type: "expense", order: 9 },
  { id: "exp-11", name: "Fuel / Petrol", icon: "Fuel", color: "#78716c", type: "expense", order: 10 },
  { id: "exp-12", name: "Gifts & Donations", icon: "Gift", color: "#a855f7", type: "expense", order: 11 },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: "inc-1", name: "Salary", icon: "Banknote", color: "#10b981", type: "income", order: 0 },
  { id: "inc-2", name: "Freelance", icon: "TrendingUp", color: "#3b82f6", type: "income", order: 1 },
  { id: "inc-3", name: "Business", icon: "Building2", color: "#6366f1", type: "income", order: 2 },
  { id: "inc-4", name: "Interest", icon: "Landmark", color: "#f59e0b", type: "income", order: 3 },
  { id: "inc-5", name: "Gifts Received", icon: "HandCoins", color: "#ec4899", type: "income", order: 4 },
  { id: "inc-6", name: "Other Income", icon: "Wallet", color: "#64748b", type: "income", order: 5 },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "acc-1", name: "Wallet", icon: "Wallet", balance: 0 },
  { id: "acc-2", name: "Commercial Bank", icon: "Building2", balance: 0 },
  { id: "acc-3", name: "Sampath Bank", icon: "Landmark", balance: 0 },
  { id: "acc-4", name: "Savings", icon: "PiggyBank", balance: 0 },
];
