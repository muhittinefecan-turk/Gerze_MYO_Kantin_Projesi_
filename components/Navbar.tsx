'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Info, Search, X, Compass, History } from 'lucide-react';
import { CanteenConfig } from '@/types/canteen';

interface NavbarProps {
  config: CanteenConfig;
  cartCount: number;
  cartTotal: number;
  canteenStatus: { isOpen: boolean; message: string };
  onOpenCart: () => void;
  onOpenInfo: () => void;
  onOpenAiAssistant?: () => void;
  onOpenHistory?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({
  config,
  cartCount,
  cartTotal,
  canteenStatus,
  onOpenCart,
  onOpenInfo,
  onOpenAiAssistant,
  onOpenHistory,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const status = canteenStatus;
  const logoUrl = config.canteen.logo || '/image.png';

  // Typewriter animation for title
  const targetTitle = config.canteen.name || 'Gerze MYO Kantini';
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= targetTitle.length) {
        setDisplayedTitle(targetTitle.slice(0, currentIdx));
        currentIdx++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 45); // ~650ms smooth gentle typewriter

    return () => clearInterval(interval);
  }, [targetTitle]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Info with High-Resolution Crest Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Logo Container - CSS Selector 1 */}
            <div className="relative w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs shrink-0 p-1 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt={`${config.canteen.school} Logo`}
                fill
                className="object-contain p-0.5 transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            {/* Brand Title Block - CSS Selector 2 */}
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight flex items-center animate-fadeIn">
                  <span className="truncate">{displayedTitle || targetTitle}</span>
                  {!isTypingDone && (
                    <span className="inline-block w-0.5 h-3 sm:h-4 bg-emerald-500 ml-0.5 shrink-0 animate-pulse" />
                  )}
                </h1>
                
                {/* Live Open / Closed indicator on Tablet/Desktop */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shrink-0 ${
                    status.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{status.isOpen ? 'Açık' : 'Kapalı'}</span>
                </span>
              </div>

              {/* Subtitle & Mobile Live Status Dot */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`sm:hidden inline-flex items-center gap-1 px-1 py-0.2 rounded-full text-[9px] font-bold shrink-0 ${
                    status.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{status.isOpen ? 'Açık' : 'Kapalı'}</span>
                </span>

                <p className="text-[10px] sm:text-xs text-slate-500 truncate font-medium">
                  {config.canteen.school}
                </p>
              </div>
            </div>
          </div>

          {/* Search Box on Desktop / Tablet */}
          <div className="hidden md:flex items-center relative flex-1 max-w-xs lg:max-w-sm mx-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tost, sandviç, içecek ara..."
              className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-sm pl-9.5 pr-8 py-2 rounded-xl border border-transparent focus:border-emerald-600 focus:outline-hidden transition-all text-slate-900 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Actions - Mobile Compact, Desktop Full */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Menu Decision Wizard Button */}
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                title="Ne Yesem? Hızlı Menü Seçici"
                className="flex items-center gap-1 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-amber-900 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-300/80 shadow-2xs transition-all active:scale-95"
              >
                <Compass className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="hidden md:inline">Ne Yesem?</span>
              </button>
            )}

            {/* Order History & Favorites Button */}
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                title="Geçmiş Siparişlerim & Favoriler"
                className="p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <History className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden lg:inline">Geçmişim</span>
              </button>
            )}

            {/* Info Button */}
            <button
              onClick={onOpenInfo}
              title="Kantin ve Proje Bilgisi"
              className="p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold hidden xs:flex"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Hakkında</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 shrink-0 ${
                cartCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="Sepeti Görüntüle"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                    {cartCount}
                  </span>
                )}
              </div>
              
              <span className="hidden sm:inline">Sepet</span>
              {cartCount > 0 && (
                <span className="font-black border-l border-emerald-500/50 pl-1.5 sm:pl-2 hidden xs:inline">
                  {cartTotal.toLocaleString('tr-TR')} {config.currency}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tost, sandviç, içecek ara..."
              className="w-full bg-slate-100 focus:bg-white text-xs pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-emerald-600 focus:outline-hidden transition-all text-slate-900 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
