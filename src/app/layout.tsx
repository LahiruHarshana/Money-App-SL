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
  title: "MoneySL - Personal Finance Tracker",
  description:
    "Track your expenses and income in Sri Lankan Rupees. A modern personal finance app built for Sri Lanka.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoneySL",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f1d4e",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-full overflow-x-hidden`}
      >
        <Sidebar />
        {/* Mobile: centered max-w-lg with bottom-nav padding */}
        {/* Desktop: offset by sidebar, remaining width fills viewport */}
        <main className="w-full max-w-lg mx-auto min-h-screen pb-24 overflow-x-hidden md:max-w-none md:mx-0 md:ml-64 md:w-[calc(100%-16rem)] md:pb-6">
          <div className="md:max-w-6xl md:mx-auto md:px-2">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
