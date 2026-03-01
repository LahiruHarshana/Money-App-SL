import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/bottom-nav";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalliPotha - Personal Finance Tracker",
  description: "Track your expenses and income in Sri Lankan Rupees. A modern personal finance app built for Sri Lanka.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SalliPotha",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#047857", // emerald-700
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden bg-gray-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-[100vw] overflow-x-hidden min-h-screen flex text-slate-900 bg-gray-50`}
      >
        <Sidebar />
        {/* Main Content Area */}
        {/* Mobile: takes full width, pb-20 for bottom nav. Desktop: remains full width but md:pl-64 gives room for sidebar. */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-20 md:pb-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
