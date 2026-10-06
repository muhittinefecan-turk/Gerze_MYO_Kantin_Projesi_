'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown, Flame, Clock, Zap, Sparkles } from 'lucide-react';
import { CanteenConfig } from '@/types/canteen';

interface HeroSectionProps {
  config: CanteenConfig;
  onScrollToMenu: () => void;
  onOpenAiAssistant?: () => void;
}

export function HeroSection({
  config,
  onScrollToMenu,
  onOpenAiAssistant,
}: HeroSectionProps) {
  const brandName = config.canteen.name || 'Gerze MYO Kantin';
  const [typedTitle, setTypedTitle] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i <= brandName.length) {
        setTypedTitle(brandName.slice(0, i));
      } else {
        setIsDone(true);
        clearInterval(timer);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [brandName]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center animate-fadeIn">
        {/* Animated Pill Badge with Typewriter Brand Name */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-300 mb-4 backdrop-blur-xs shadow-sm">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
          <span className="tracking-wide text-white">
            {typedTitle || brandName}
            {!isDone && <span className="inline-block w-0.5 h-3 bg-emerald-400 ml-0.5 animate-pulse" />}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-300">Ön Sipariş Sistemi</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
          Teneffüste Sıra Bekleme, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Siparişin Zille Hazır Olsun!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Tostunu, sandviçini ve içeceğini seç, teslim zamanını belirle; WhatsApp ile anında ilet.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onScrollToMenu}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Menüye Göz At</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>🎲 Ne Yesem? Karar Ver</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Teslimat: Teneffüs Saatlerinde</span>
          </div>
        </div>
      </div>
    </section>
  );
}
