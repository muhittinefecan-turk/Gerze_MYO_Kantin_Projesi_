'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface StickyCartBarProps {
  totalCount: number;
  totalPrice: number;
  currency: string;
  onOpenCart: () => void;
}

export function StickyCartBar({
  totalCount,
  totalPrice,
  currency,
  onOpenCart,
}: StickyCartBarProps) {
  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden animate-slideUp">
      <button
        onClick={onOpenCart}
        className="w-full flex items-center justify-between p-3.5 px-5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-950/30 border border-slate-800 active:scale-98 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center ring-2 ring-slate-900">
              {totalCount}
            </span>
          </div>

          <div className="text-left">
            <span className="text-xs text-slate-400 block font-medium">Siparişi Gör</span>
            <span className="text-sm font-black text-white">
              {totalCount} Ürün Sepette
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-black text-emerald-400">
            {totalPrice.toLocaleString('tr-TR')} {currency}
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </button>
    </div>
  );
}
