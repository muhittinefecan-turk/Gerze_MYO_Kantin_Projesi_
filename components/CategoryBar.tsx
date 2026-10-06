'use client';

import React from 'react';
import { CategoryItem } from '@/types/canteen';
import {
  Flame,
  UtensilsCrossed,
  Coffee,
  CupSoda,
  Cookie,
  CakeSlice,
  LayoutGrid,
  Search,
  X,
} from 'lucide-react';

interface CategoryBarProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts: Record<string, number>;
  searchQuery?: string;
  onClearSearch?: () => void;
  isAutoSelected?: boolean;
}

// Icon mapper
function getCategoryIcon(iconName?: string) {
  switch (iconName) {
    case 'Flame':
      return <Flame className="w-4 h-4" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'Coffee':
      return <Coffee className="w-4 h-4" />;
    case 'CupSoda':
      return <CupSoda className="w-4 h-4" />;
    case 'Cookie':
      return <Cookie className="w-4 h-4" />;
    case 'CakeSlice':
      return <CakeSlice className="w-4 h-4" />;
    default:
      return <UtensilsCrossed className="w-4 h-4" />;
  }
}

export function CategoryBar({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery = '',
  onClearSearch,
  isAutoSelected = false,
}: CategoryBarProps) {
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Search Notice / Active Filter info if searching */}
        {isSearching && (
          <div className="flex items-center justify-between pb-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                &ldquo;<span className="font-bold text-slate-900">{searchQuery}</span>&rdquo; için{' '}
                <strong className="text-emerald-700">{totalCount}</strong> sonuç bulundu
              </span>
              {isAutoSelected && (
                <span className="ml-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold animate-fadeIn hidden sm:inline">
                  ⚡ Otomatik Kategori
                </span>
              )}
            </div>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-100 px-2 py-0.5 rounded-md transition-colors"
              >
                <span>Aramayı Sıfırla</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -my-1">
          {/* All Items Button */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-95 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{isSearching ? 'Tüm Eşleşmeler' : 'Tüm Menü'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-bold ${
                activeCategory === 'all'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Category List */}
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = activeCategory === cat.id;
            const hasMatches = count > 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                    : isSearching && !hasMatches
                    ? 'bg-slate-50 text-slate-400 hover:bg-slate-100 opacity-60'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {getCategoryIcon(cat.iconName)}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ml-0.5 font-bold ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : isSearching && hasMatches
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
