'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { ProductItem, CartExtra, CartItem } from '@/types/canteen';

interface ProductModalProps {
  product: ProductItem | null;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

interface ProductModalInnerProps {
  product: ProductItem;
  currency: string;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

function ProductModalInner({
  product,
  currency,
  onClose,
  onAddToCart,
}: ProductModalInnerProps) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<CartExtra[]>([]);
  const [note, setNote] = useState('');

  const basePrice = product.discountPrice ?? product.price;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra: { id: string; name: string; price: number }) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((item) => item.id === extra.id);
      if (exists) {
        return prev.filter((item) => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleConfirm = () => {
    onAddToCart({
      product,
      quantity,
      selectedExtras,
      note: note.trim(),
      unitPrice,
      totalPrice,
    });
    onClose();
  };

  return (
    <div
      className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slideUp sm:animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        aria-label="Kapat"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div className="relative h-48 sm:h-56 w-full bg-slate-100 shrink-0">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-xs">
            {product.category.toUpperCase()}
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight drop-shadow-sm">
            {product.name}
          </h2>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
        <p className="text-sm text-slate-600 leading-relaxed">
          {product.description}
        </p>

        {/* Extras Section */}
        {product.extras && product.extras.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ekstra Seçenekler
              </h3>
              <span className="text-[11px] text-slate-400">İsteğe bağlı</span>
            </div>

            <div className="space-y-2">
              {product.extras.map((extra) => {
                const isChecked = selectedExtras.some((item) => item.id === extra.id);
                return (
                  <label
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium">{extra.name}</span>
                    </div>

                    <span className="text-xs font-bold text-slate-900">
                      {extra.price > 0 ? `+${extra.price} ${currency}` : 'Ücretsiz'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Note Section */}
        {product.allowNote && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ürüne Özel İstek / Not
              </h3>
              <span className="text-[11px] text-slate-400">Opsiyonel</span>
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Az kızarmış olsun, domates olmasın, şekersiz..."
              maxLength={80}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-sm font-bold text-slate-800">Adet</span>
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 disabled:opacity-40 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-black text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Footer CTA */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-500 font-medium">Toplam</span>
          <span className="text-lg sm:text-xl font-black text-slate-900">
            {totalPrice.toLocaleString('tr-TR')} {currency}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sepete Ekle</span>
        </button>
      </div>
    </div>
  );
}

export function ProductModal({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <ProductModalInner
        key={product.id}
        product={product}
        currency={currency}
        onClose={onClose}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
