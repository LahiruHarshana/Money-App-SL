"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinanceStore } from "@/store/finance-store";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MonthSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFinanceStore();

  const goPrev = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goNext = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="flex items-center gap-1 md:gap-3">
      <button
        onClick={goPrev}
        className="p-1 md:p-1.5 rounded-lg hover:bg-navy-100/60 active:scale-95 transition-all"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-navy-600" />
      </button>
      <div className="text-center min-w-[90px] md:min-w-[130px]">
        <h2 className="text-xs md:text-sm font-bold text-navy-800 tracking-tight">
          {MONTHS[selectedMonth]}
        </h2>
        <p className="text-[10px] md:text-[11px] text-navy-400 font-medium">{selectedYear}</p>
      </div>
      <button
        onClick={goNext}
        className="p-1 md:p-1.5 rounded-lg hover:bg-navy-100/60 active:scale-95 transition-all"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-navy-600" />
      </button>
    </div>
  );
}
