'use client';

import React from 'react';
import { X, Clock, Phone, MapPin, Sparkles, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { CanteenConfig } from '@/types/canteen';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanteenConfig;
}

export function InfoModal({ isOpen, onClose, config }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {config.canteen.name}
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              {config.canteen.school}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-600">
          {/* How it works */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              🚀 Nasıl Çalışır? (3 Kolay Adım)
            </h3>
            <div className="space-y-2.5">
              <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Menüyü Seç</h4>
                  <p className="text-slate-500 mt-0.5">
                    İstediğin tostu, içeceği ve ekstra sosları seçip sepete ekle.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Teslim Saatini Belirle</h4>
                  <p className="text-slate-500 mt-0.5">
                    Teneffüs saatine göre teslim alma zamanını ve ödeme şeklini seç.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">WhatsApp ile İlet</h4>
                  <p className="text-slate-500 mt-0.5">
                    Hazırlanan sipariş metnini WhatsApp üzerinden tek tıkla kantinciye gönder. Sıra beklemeden teslim al!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">İletişim & Konum</h4>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Çalışma Saatleri: {config.canteen.workingHours.open} - {config.canteen.workingHours.close}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: +{config.canteen.whatsapp}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gerze Meslek Yüksekokulu Kantin Alanı</span>
            </div>
          </div>

          {/* Developer Attribution */}
          <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  Yazılım Geliştirici
                </span>
                <span className="font-bold text-slate-100 text-xs">
                  {config.canteen.developer.name}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800 font-semibold">
              Gerze MYO
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Anladım, Menüye Dön
          </button>
        </div>
      </div>
    </div>
  );
}
