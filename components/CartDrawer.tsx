'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types/canteen';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: string;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

function CartRow({
  item,
  currency,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItem;
  currency: string;
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
}) {
  const [imgSrc, setImgSrc] = React.useState(item.product.image);

  return (
    <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-xs">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={imgSrc}
            alt={item.product.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            onError={() => {
              setImgSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {item.product.name}
            </h4>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-slate-400 hover:text-rose-500 p-1 -mr-1 transition-colors"
              title="Ürünü Kaldır"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Extras */}
          {item.selectedExtras && item.selectedExtras.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.selectedExtras.map((extra) => (
                <span
                  key={extra.id}
                  className="inline-block text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md"
                >
                  +{extra.name} {extra.price > 0 ? `(${extra.price} ${currency})` : ''}
                </span>
              ))}
            </div>
          )}

          {/* Custom Note */}
          {item.note && (
            <p className="mt-1 text-[11px] text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md inline-block">
              📝 Not: {item.note}
            </p>
          )}

          {/* Quantity & Price */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-100 px-1.5 py-0.5 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-slate-900 min-w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-slate-900">
                {item.totalPrice.toLocaleString('tr-TR')} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-lg">Sipariş Sepetim</h2>
              <p className="text-xs text-slate-500 font-medium">
                {totalItemCount > 0 ? `${totalItemCount} adet ürün seçildi` : 'Sepetiniz boş'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                title="Sepeti Temizle"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Sepetiniz Boş</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                Kantin menüsünden dilediğin tost, sandviç veya içecekleri seçip sepete ekleyebilirsin.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Menüye Göz At
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                currency={currency}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/90 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="font-semibold text-slate-800">
                  {totalAmount.toLocaleString('tr-TR')} {currency}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>WhatsApp Ön Sipariş Hizmeti</span>
                <span>Ücretsiz</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Genel Toplam</span>
                <span>{totalAmount.toLocaleString('tr-TR')} {currency}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <span>Siparişi Tamamla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
