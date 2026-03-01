"use client";

import { useEffect, useState } from "react";
import { useFinanceStore } from "@/store/finance-store";
import { ICON_MAP, ICON_GROUPS, COLOR_SWATCHES, type Category } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  Settings,
  Palette,
  Tag,
  Wallet,
  Plus,
  Check,
  ArrowLeft,
  GripHorizontal,
  Minus,
  Pencil,
} from "lucide-react";

type ProfileView = "main" | "categories" | "add-category";

export default function ProfilePage() {
  const [view, setView] = useState<ProfileView>("main");
  const [editingType, setEditingType] = useState<"expense" | "income">("expense");

  if (view === "categories") {
    return (
      <CategoryManagement
        initialType={editingType}
        onTypeChange={setEditingType}
        onBack={() => setView("main")}
        onAddNew={() => setView("add-category")}
      />
    );
  }

  if (view === "add-category") {
    return (
      <AddCategoryScreen
        type={editingType}
        onBack={() => setView("categories")}
      />
    );
  }

  return (
    <div className="pt-safe md:pt-0">
      <header className="px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-navy-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-navy-400 font-medium">
          Manage your preferences
        </p>
      </header>

      <div className="px-4 mt-4 space-y-3 md:px-8 md:mt-6 md:max-w-2xl">
        {/* Profile card */}
        <div className="bg-gradient-to-br from-navy-700 to-navy-900 rounded-3xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold">
              M
            </div>
            <div>
              <h2 className="text-lg font-bold">MoneySL User</h2>
              <p className="text-sm text-white/60">Sri Lanka</p>
            </div>
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-white rounded-2xl shadow-sm border border-navy-50 overflow-hidden">
          <button
            onClick={() => {
              setEditingType("expense");
              setView("categories");
            }}
            className="w-full flex items-center gap-3 p-4 hover:bg-navy-50/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <Tag className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-800">
                Expense Categories
              </p>
              <p className="text-[11px] text-navy-400">
                Manage expense categories
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-navy-300" />
          </button>

          <div className="h-px bg-navy-50 mx-4" />

          <button
            onClick={() => {
              setEditingType("income");
              setView("categories");
            }}
            className="w-full flex items-center gap-3 p-4 hover:bg-navy-50/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-800">
                Income Categories
              </p>
              <p className="text-[11px] text-navy-400">
                Manage income categories
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-navy-300" />
          </button>

          <div className="h-px bg-navy-50 mx-4" />

          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
              <Palette className="w-5 h-5 text-navy-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-800">
                Currency: LKR (Rs.)
              </p>
              <p className="text-[11px] text-navy-400">
                Sri Lankan Rupee
              </p>
            </div>
          </div>

          <div className="h-px bg-navy-50 mx-4" />

          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-800">App Version</p>
              <p className="text-[11px] text-navy-400">MoneySL v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category Management Screen ─────────────────────────────
function CategoryManagement({
  initialType,
  onTypeChange,
  onBack,
  onAddNew,
}: {
  initialType: "expense" | "income";
  onTypeChange: (type: "expense" | "income") => void;
  onBack: () => void;
  onAddNew: () => void;
}) {
  const [activeType, setActiveType] = useState<"expense" | "income">(
    initialType
  );

  const expenseCategories = useFinanceStore((s) => s.expenseCategories);
  const incomeCategories = useFinanceStore((s) => s.incomeCategories);
  const deleteCategory = useFinanceStore((s) => s.deleteCategory);
  const reorderCategories = useFinanceStore((s) => s.reorderCategories);

  useEffect(() => {
    setActiveType(initialType);
  }, [initialType]);

  const categories =
    activeType === "expense"
      ? [...expenseCategories].sort((a, b) => a.order - b.order)
      : [...incomeCategories].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(categories, oldIndex, newIndex);
    reorderCategories(activeType, reordered);
  };

  return (
    <div className="w-full overflow-x-hidden pt-safe md:pt-0 animate-scale-in">
      <header className="flex items-center gap-3 px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-navy-50 text-navy-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-navy-900 tracking-tight">
            Category Settings
          </h1>
          <p className="text-xs text-navy-400 font-medium">
            Manage category order and visibility
          </p>
        </div>
      </header>

      <div className="w-full px-4 md:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="p-1 rounded-2xl bg-navy-100 flex w-full overflow-hidden">
            {(["expense", "income"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveType(tab);
                  onTypeChange(tab);
                }}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all",
                  activeType === tab
                    ? tab === "expense"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-emerald-500 text-white shadow-sm"
                    : "text-navy-500 hover:text-navy-700"
                )}
              >
                {tab === "expense" ? "Expense" : "Income"}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs font-medium text-navy-400 px-1">
            {categories.length} categories
          </p>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 pt-3 pb-24 overflow-x-hidden">
        <div className="mx-auto w-full max-w-3xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map((cat) => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 w-full overflow-x-hidden touch-pan-y">
                {categories.map((cat) => (
                  <SortableCategoryItem
                    key={cat.id}
                    category={cat}
                    onDelete={deleteCategory}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 w-full border-t border-navy-100 bg-white/90 backdrop-blur-sm">
        <div className="w-full px-4 md:px-8 py-3">
          <div className="mx-auto w-full max-w-3xl">
            <button
              onClick={onAddNew}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-[0.99]"
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableCategoryItem({
  category,
  onDelete,
}: {
  category: Category;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = ICON_MAP[category.icon];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full max-w-full flex items-center gap-2.5 bg-white rounded-2xl p-3 shadow-sm border border-navy-100",
        isDragging && "opacity-80 shadow-lg"
      )}
    >
      <button
        onClick={() => onDelete(category.id)}
        className="w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shrink-0 transition-colors"
        aria-label={`Delete ${category.name}`}
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-3 overflow-hidden">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {Icon && (
            <Icon className="w-5 h-5" style={{ color: category.color }} />
          )}
        </div>

        <p className="text-sm font-semibold text-navy-800 truncate">
          {category.name}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-2 rounded-lg text-navy-300 hover:text-navy-500 hover:bg-navy-50 transition-colors"
          aria-label={`Edit ${category.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-lg text-navy-300 hover:text-navy-600 hover:bg-navy-50 transition-colors cursor-grab active:cursor-grabbing touch-none"
          aria-label={`Reorder ${category.name}`}
          style={{ touchAction: "none" }}
        >
          <GripHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ── Add Category Screen ────────────────────────────────────
function AddCategoryScreen({
  type,
  onBack,
}: {
  type: "expense" | "income";
  onBack: () => void;
}) {
  const addCategory = useFinanceStore((s) => s.addCategory);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingCart");
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0]);

  const handleSave = () => {
    if (!name.trim()) return;
    addCategory({
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      type,
    });
    onBack();
  };

  return (
    <div className="pt-safe md:pt-0 animate-scale-in">
      <header className="flex items-center gap-3 px-4 pt-4 pb-3 md:px-8 md:pt-8 md:pb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-navy-50 text-navy-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-navy-900 tracking-tight">
            New Category
          </h1>
          <p className="text-xs text-navy-400 font-medium">
            {type === "expense" ? "Expense" : "Income"} category
          </p>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-6 md:px-8">
        {/* Preview */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${selectedColor}15` }}
            >
              {ICON_MAP[selectedIcon] &&
                (() => {
                  const Icon = ICON_MAP[selectedIcon];
                  return (
                    <Icon className="w-8 h-8" style={{ color: selectedColor }} />
                  );
                })()}
            </div>
            <p className="text-sm font-semibold text-navy-700">
              {name || "Category Name"}
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-1 block">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Tuk-Tuk Rides"
            className="w-full bg-white rounded-xl p-3 text-sm text-navy-800 outline-none border border-navy-100 focus:ring-2 focus:ring-emerald-500/30 placeholder-navy-300"
          />
        </div>

        {/* Color Selector */}
        <div>
          <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2 block">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-9 h-9 rounded-xl transition-all flex items-center justify-center",
                  selectedColor === color
                    ? "ring-2 ring-offset-2 scale-110"
                    : "hover:scale-105"
                )}
                style={{
                  backgroundColor: color,
                  // @ts-expect-error: Tailwind ring-color custom property
                  "--tw-ring-color": color,
                }}
              >
                {selectedColor === color && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Selector */}
        <div>
          <label className="text-[11px] font-semibold text-navy-400 uppercase tracking-wider mb-2 block">
            Icon
          </label>
          <div className="space-y-4">
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
                        onClick={() => setSelectedIcon(iconName)}
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-all border-2",
                          selectedIcon === iconName
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-transparent bg-navy-50 hover:bg-navy-100"
                        )}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color:
                              selectedIcon === iconName
                                ? selectedColor
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          Save Category
        </button>
      </div>
    </div>
  );
}
