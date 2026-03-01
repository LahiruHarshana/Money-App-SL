<div align="center">

# 💰 MoneySL

### Personal Finance Tracker — built for clarity, speed, and simplicity

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=flat-square)](https://zustand-demo.pmnd.rs)

</div>

---

## ✨ Overview

**MoneySL** is a modern, mobile-first personal finance tracker that helps you stay on top of your money — track expenses, log income, manage multiple accounts, and visualise spending patterns, all from one clean interface.

Data is stored **entirely on-device** using `localStorage` — no account, no server, no privacy compromise.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Monthly summary cards for Expenses, Income & Balance at a glance |
| ➕ **Add Transactions** | Log expenses, income, and account transfers with a single tap |
| 🏦 **Multi-Account** | Track balances across multiple accounts simultaneously |
| 🗂️ **Smart Categories** | Custom categories with icons & colours; reorder via drag-and-drop |
| 📅 **Month Navigator** | Browse any past or future month's data instantly |
| 📈 **Charts** | Visual breakdown of spending & income by category |
| 📋 **Reports** | Monthly stats — total spend, income, average daily spend & more |
| 🔄 **Transfers** | Move money between accounts with full history |
| 💾 **Offline-first** | All data persists in the browser — works without internet |
| 📱 **PWA-ready** | Installable on mobile for a native app feel |
| 🖥️ **Responsive** | Side navigation on desktop, bottom nav on mobile |

---

## 🛠 Tech Stack

```
Framework      →  Next.js 16 (App Router)
UI Library     →  React 19
Language       →  TypeScript 5
Styling        →  Tailwind CSS 4
State          →  Zustand 5 (with persist middleware)
Icons          →  Lucide React
Date Handling  →  date-fns
Drag & Drop    →  @dnd-kit/core + @dnd-kit/sortable
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx            # Dashboard (home)
│   ├── charts/page.tsx     # Category spending charts
│   ├── reports/page.tsx    # Monthly financial reports
│   ├── profile/page.tsx    # Profile & settings
│   ├── layout.tsx          # Root layout with nav
│   └── globals.css         # Global styles
│
├── components/
│   ├── add-transaction-modal.tsx   # Expense / Income / Transfer form
│   ├── summary-cards.tsx           # Balance overview cards
│   ├── recent-transactions.tsx     # Grouped transaction list
│   ├── month-selector.tsx          # Month / year navigation
│   ├── bottom-nav.tsx              # Mobile bottom navigation
│   └── sidebar.tsx                 # Desktop sidebar navigation
│
├── store/
│   └── finance-store.ts    # Zustand global store (persisted)
│
└── lib/
    ├── constants.ts         # Default categories, accounts, icon map
    └── utils.ts             # Helpers — formatCurrency, cn, generateId
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/money-app.git
cd money-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the optimised production bundle |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## 🎨 App Pages

### 🏠 Dashboard
The home screen shows your current month's **Expenses**, **Income**, and **Balance** as gradient cards, an account strip with live balances, and a grouped list of recent transactions. Tap **+** to add a new transaction.

### 📈 Charts
Visual breakdown of the selected month's spending and income aggregated by category. Each category shows its icon, colour, amount and percentage share.

### 📋 Reports
Tabular monthly summary including total transactions, average expense per transaction, average daily spending, and income totals — all auto-calculated from your data.

### 👤 Profile
Manage custom expense and income categories — set a name, pick an icon and colour. Drag categories to reorder them. Delete categories no longer needed.

---

## 🔒 Privacy

MoneySL is **100% client-side**. Your financial data never leaves your device. It is stored in `localStorage` via Zustand's persist middleware and is cleared only when you clear your browser data.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/amazing-feature`
3. Commit your changes — `git commit -m 'feat: add amazing feature'`
4. Push to the branch — `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ using **Next.js** · **React** · **Tailwind CSS**

</div>
