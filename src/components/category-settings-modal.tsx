"use client";

import { useState } from "react";
import { ArrowLeft, Settings2, MinusCircle, Pencil, Menu, Plus } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ICON_MAP, type TransactionType, type Category } from "@/lib/constants";
import { useFinanceStore } from "@/store/finance-store";
import AddCategoryModal from "./add-category-modal";

interface CategorySettingsModalProps {
    open: boolean;
    onClose: () => void;
    initialTab?: TransactionType;
}

// Separate component for sortable items
function SortableCategoryItem({
    cat,
    onDelete,
    onEdit,
}: {
    cat: Category;
    onDelete: (id: string, name: string) => void;
    onEdit: (cat: Category) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cat.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
    };

    const Icon = ICON_MAP[cat.icon];

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center px-5 py-3.5 gap-4 group transition-colors bg-white w-full",
                isDragging ? "bg-navy-50" : "hover:bg-navy-50/50"
            )}
        >
            <button
                onClick={() => onDelete(cat.id, cat.name)}
                className="text-rose-500 hover:text-rose-600 transition-colors shrink-0"
            >
                <MinusCircle className="w-6 h-6" fill="#f43f5e" stroke="#ffffff" />
            </button>

            <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: cat.color }}
            >
                {Icon && <Icon className="w-5 h-5 text-white" />}
            </div>

            <div className="flex-1">
                <span className="text-sm font-medium text-navy-900">{cat.name}</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <button
                    onClick={() => onEdit(cat)}
                    className="text-navy-400 hover:text-navy-600 transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    {...attributes}
                    {...listeners}
                    className="text-navy-400 hover:text-navy-600 cursor-grab active:cursor-grabbing transition-colors touch-none"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default function CategorySettingsModal({
    open,
    onClose,
    initialTab = "expense",
}: CategorySettingsModalProps) {
    const [activeTab, setActiveTab] = useState<TransactionType>(initialTab);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const expenseCategories = useFinanceStore((s) => s.expenseCategories);
    const incomeCategories = useFinanceStore((s) => s.incomeCategories);
    const deleteCategory = useFinanceStore((s) => s.deleteCategory);
    const reorderCategories = useFinanceStore((s) => s.reorderCategories);

    const categories =
        activeTab === "expense"
            ? [...expenseCategories].sort((a, b) => a.order - b.order)
            : [...incomeCategories].sort((a, b) => a.order - b.order);

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the "${name}" category?`)) {
            deleteCategory(id);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setShowAddCategory(true);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex((cat) => cat.id === active.id);
            const newIndex = categories.findIndex((cat) => cat.id === over.id);

            const newItems = arrayMove(categories, oldIndex, newIndex);
            reorderCategories(activeTab as "expense" | "income", newItems);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[140] flex flex-col bg-white animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-safe-top pb-3 mt-4">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-xl hover:bg-navy-50 text-navy-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-medium text-navy-800">Category settings</h2>
                <button className="p-2 -mr-2 rounded-xl hover:bg-navy-50 text-navy-800 transition-colors">
                    <Settings2 className="w-6 h-6" />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-5 mb-4">
                <div className="flex bg-navy-50/80 rounded-xl p-1">
                    {(["expense", "income"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize",
                                activeTab === tab
                                    ? "bg-navy-900 text-amber-400 shadow-sm"
                                    : "text-navy-600 hover:text-navy-900"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category List */}
            <div className="flex-1 overflow-y-auto pb-32">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="divide-y divide-navy-50">
                        <SortableContext
                            items={categories.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {categories.map((cat) => (
                                <SortableCategoryItem
                                    key={cat.id}
                                    cat={cat}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            </div>

            {/* Sticky Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-safe-bottom pointer-events-none">
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setShowAddCategory(true);
                    }}
                    className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy-900 font-medium text-base shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] pointer-events-auto"
                >
                    <Plus className="w-5 h-5" />
                    Add category
                </button>
            </div>

            <AddCategoryModal
                open={showAddCategory}
                onClose={() => {
                    setShowAddCategory(false);
                    setEditingCategory(null);
                }}
                initialType={activeTab}
                initialCategory={editingCategory}
            />
        </div>
    );
}
