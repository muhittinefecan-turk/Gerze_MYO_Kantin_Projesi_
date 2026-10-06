'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  History,
  ShoppingBag,
  RotateCcw,
  Calendar,
  Trash2,
  Heart,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { CartItem, ProductItem, CanteenConfig } from '@/types/canteen';

export interface PastOrder {
  id: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  totalPrice: number;
  pickupTime: string;
  paymentMethod: string;
}

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanteenConfig;
  onReorder: (items: CartItem[]) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  addToast: (text: string, type?: 'success' | 'warning') => void;
}

export function OrderHistoryModal({
  isOpen,
  onClose,
  config,
  onReorder,
  onAddToCart,
  addToast,
}: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  // Load from localStorage on open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const savedHistory = localStorage.getItem('gerze_order_history');
          if (savedHistory) {
            setOrders(JSON.parse(savedHistory));
          }

          const savedFavs = localStorage.getItem('gerze_favorite_items');
          if (savedFavs) {
            setFavoriteIds(JSON.parse(savedFavs));
          }
        } catch {
          // Ignore JSON errors
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const currency = config.currency || '₺';

  // Clear entire history
  const handleClearHistory = () => {
    if (confirm('Tüm geçmiş sipariş listesini temizlemek istediğinize emin misiniz?')) {
      localStorage.removeItem('gerze_order_history');
      setOrders([]);
      addToast('Sipariş geçmişi temizlendi.');
    }
  };

  // Re-order a whole past order
  const handleReorderAll = (pastOrder: PastOrder) => {
    onReorder(pastOrder.items);
    addToast(`${pastOrder.items.length} çeşit ürün sepete eklendi! 🛒`);
    onClose();
  };

  // Toggle favorite product
  const toggleFavoriteProduct = (productId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('gerze_favorite_items', JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteProducts = config.products.filter((p) =>
    favoriteIds.includes(p.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-slate-200 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                Sipariş Geçmişim & Favoriler
              </h2>
              <p className="text-[11px] text-slate-500">
                Eski siparişlerini tek tıkla tekrar sepete ekle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geçmiş Siparişler ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'favorites'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Favori Ürünlerim ({favoriteProducts.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'history' ? (
            orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <History className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Henüz geçmiş siparişiniz bulunmuyor
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Sipariş verdikçe burada otomatik listelenecek. Böylece her teneffüste tek tıkla aynı siparişi verebileceksiniz.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
                  <span>Toplam {orders.length} sipariş kaydı bulundu</span>
                  <button
                    onClick={handleClearHistory}
                    className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Geçmişi Temizle</span>
                  </button>
                </div>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {order.date}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                        {order.id}
                      </span>
                    </div>

                    {/* Order items brief */}
                    <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-100">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-[11px]"
                        >
                          <span className="font-medium text-slate-800 truncate pr-2">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-slate-500 shrink-0">
                            {item.totalPrice.toLocaleString('tr-TR')} {currency}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Teslim: {order.pickupTime}
                        </span>
                        <span className="font-black text-sm text-emerald-700">
                          {order.totalPrice.toLocaleString('tr-TR')} {currency}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleReorderAll(order)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Tekrar Sepete Ekle</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Favorites Tab */
            favoriteProducts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Favori ürünün yok
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Menüdeki ürün kartlarının üzerindeki kalp simgesine tıklayarak sevdiklerini buraya ekleyebilirsin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {favoriteProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 justify-between"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {p.name}
                      </h4>
                      <span className="font-black text-emerald-700 text-xs">
                        {(p.discountPrice ?? p.price).toLocaleString('tr-TR')} {currency}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleFavoriteProduct(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Favorilerden çıkar"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onAddToCart({
                            product: p,
                            quantity: 1,
                            selectedExtras: [],
                            note: '',
                            unitPrice: p.discountPrice ?? p.price,
                            totalPrice: p.discountPrice ?? p.price,
                          });
                          addToast(`${p.name} sepete eklendi.`);
                        }}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                        title="Sepete Ekle"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
