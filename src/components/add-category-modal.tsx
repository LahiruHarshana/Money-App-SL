"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ICON_MAP,
  ICON_GROUPS,
  COLOR_SWATCHES,
  type TransactionType,
  type Category,
} from "@/lib/constants";
import { useFinanceStore } from "@/store/finance-store";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  initialType?: TransactionType;
  initialCategory?: Category | null;
}

export default function AddCategoryModal({
  open,
  onClose,
  initialType = "expense",
  initialCategory,
}: AddCategoryModalProps) {
  const [activeTab, setActiveTab] = useState<TransactionType>(
    initialCategory ? initialCategory.type : initialType
  );
  const [name, setName] = useState(initialCategory ? initialCategory.name : "");
  const [selectedIcon, setSelectedIcon] = useState(
    initialCategory ? initialCategory.icon : "ShoppingCart"
  );
  const [selectedColor, setSelectedColor] = useState(
    initialCategory ? initialCategory.color : COLOR_SWATCHES[0]
  );

  const addCategory = useFinanceStore((s) => s.addCategory);
  const updateCategory = useFinanceStore((s) => s.updateCategory);

  useEffect(() => {
    if (open) {
      if (initialCategory) {
        setActiveTab(initialCategory.type);
        setName(initialCategory.name);
        setSelectedIcon(initialCategory.icon);
        setSelectedColor(initialCategory.color);
      } else {
        setActiveTab(initialType);
        setName("");
        setSelectedIcon("ShoppingCart");
        setSelectedColor(COLOR_SWATCHES[0]);
      }
    }
  }, [open, initialType, initialCategory]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    if (initialCategory) {
      updateCategory(initialCategory.id, {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type: activeTab,
      });
    } else {
      addCategory({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        type: activeTab,
      });
    }

    onClose();
  }, [
    name,
    selectedIcon,
    selectedColor,
    activeTab,
    addCategory,
    updateCategory,
    initialCategory,
    onClose,
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-white animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-safe-top pb-3 border-b border-navy-50 mt-4">
        <button
          onClick={onClose}
          className="text-base font-semibold text-navy-600 hover:text-navy-800 transition-colors"
        >
          Cancel
        </button>
        <h2 className="text-lg font-bold text-navy-800">
          {initialCategory ? "Edit category" : "Add category"}
        </h2>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="p-1 rounded-xl text-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="w-6 h-6" strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe-bottom">
        <div className="p-5 space-y-6">
          {/* Type Selector (Radio style) */}
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setActiveTab("expense")}
              className="flex items-center gap-2 group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  activeTab === "expense"
                    ? "border-amber-400"
                    : "border-navy-300 group-hover:border-navy-400"
                )}
              >
                {activeTab === "expense" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === "expense" ? "text-navy-900" : "text-navy-500"
                )}
              >
                Expense
              </span>
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className="flex items-center gap-2 group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  activeTab === "income"
                    ? "border-amber-400"
                    : "border-navy-300 group-hover:border-navy-400"
                )}
              >
                {activeTab === "income" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeTab === "income" ? "text-navy-900" : "text-navy-500"
                )}
              >
                Income
              </span>
            </button>
          </div>

          {/* Icon & Name Input Area */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex shrink-0 items-center justify-center transition-colors"
              style={{ backgroundColor: `${selectedColor}` }}
            >
              {ICON_MAP[selectedIcon] && (() => {
                const Icon = ICON_MAP[selectedIcon];
                return <Icon className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div className="flex-1 bg-navy-50/70 rounded-xl px-4 py-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Please enter the category name"
                className="w-full bg-transparent text-sm text-navy-800 placeholder-navy-300 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-3 px-2">
              {COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check className="w-5 h-5 text-white/90" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-navy-50 my-6" />

          {/* Icon Groups */}
          <div className="space-y-6">
            {Object.entries(ICON_GROUPS).map(([group, icons]) => (
              <div key={group}>
                <h3 className="text-sm font-medium text-navy-800 mb-4 px-2">
                  {group}
                </h3>
                <div className="grid grid-cols-5 gap-y-6 gap-x-2">
                  {icons.map((iconName) => {
                    const Icon = ICON_MAP[iconName];
                    if (!Icon) return null;
                    const isSelected = selectedIcon === iconName;
                    return (
                      <button
                        key={iconName}
                        onClick={() => setSelectedIcon(iconName)}
                        className="flex flex-col items-center justify-center group"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-navy-800 scale-110"
                              : "bg-navy-50 group-hover:bg-navy-100"
                          )}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{
                              color: isSelected ? "#ffffff" : "#475569",
                            }}
                            strokeWidth={isSelected ? 2 : 1.5}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
