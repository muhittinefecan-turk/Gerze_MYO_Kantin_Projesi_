'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, SlidersHorizontal, Ban, Heart } from 'lucide-react';
import { ProductItem } from '@/types/canteen';

interface ProductCardProps {
  product: ProductItem;
  currency: string;
  onOpenDetail: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
  disabled?: boolean;
  searchQuery?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

function HighlightText({ text, query }: { text: string; query?: string }) {
  if (!query || !query.trim()) return <>{text}</>;

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-200/90 text-amber-950 font-bold px-0.5 rounded-xs"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function ProductCard({
  product,
  currency,
  onOpenDetail,
  onQuickAdd,
  disabled = false,
  searchQuery = '',
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = React.useState(product.image);
  const hasExtras = product.extras && product.extras.length > 0;
  const hasNotes = product.allowNote;
  const needsModal = hasExtras || hasNotes;
  const isAvailable = product.available && !disabled;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;

    if (needsModal) {
      onOpenDetail(product);
    } else {
      onQuickAdd(product);
    }
  };

  return (
    <div
      onClick={() => isAvailable && onOpenDetail(product)}
      className={`group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 ${
        !isAvailable ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300'
      }`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300 ${
            isAvailable ? 'group-hover:scale-105' : ''
          }`}
          referrerPolicy="no-referrer"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
          }}
        />

        {/* Gradient Shadow for Overlay Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {!product.available ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-xs">
              <Ban className="w-3 h-3" />
              TÜKENDİ
            </span>
          ) : (
            product.badge && (
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                {product.badge}
              </span>
            )
          )}
        </div>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 hover:bg-white text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all shadow-xs backdrop-blur-xs active:scale-90"
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            aria-label={isFavorite ? `${product.name} Favorilerden Çıkar` : `${product.name} Favorilere Ekle`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>
        )}

        {/* Extras / Note Pill */}
        {isAvailable && hasExtras && (
          <div className="absolute bottom-2 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white">
              <SlidersHorizontal className="w-2.5 h-2.5" />
              Özelleştirilebilir
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            <HighlightText text={product.name} query={searchQuery} />
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 min-h-8">
            <HighlightText text={product.description} query={searchQuery} />
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                  {product.discountPrice.toLocaleString('tr-TR')} {currency}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {product.price.toLocaleString('tr-TR')} {currency}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {product.price.toLocaleString('tr-TR')} {currency}
              </span>
            )}
          </div>

          {/* Action Button */}
          {isAvailable ? (
            <button
              onClick={handleAction}
              className={`flex items-center justify-center rounded-xl p-2 sm:px-3 sm:py-2 text-xs font-bold transition-all active:scale-90 ${
                needsModal
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
              title={needsModal ? 'Seçenekleri Gör' : 'Hızlı Ekle'}
              aria-label={needsModal ? `${product.name} Seçenekleri Gör` : `${product.name} Sepete Ekle`}
            >
              {needsModal ? (
                <>
                  <span className="hidden sm:inline mr-1">Seçenekler</span>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline mr-1">Ekle</span>
                  <Plus className="w-4 h-4" />
                </>
              )}
            </button>
          ) : !product.available ? (
            <span className="text-xs font-bold text-rose-600 py-1.5 px-2.5 bg-rose-50 border border-rose-200 rounded-lg">
              Tükendi
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 py-1.5 px-2.5 bg-slate-100 rounded-lg">
              Kantin Kapalı
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
