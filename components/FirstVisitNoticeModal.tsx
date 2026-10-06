'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Heart, CheckCircle, GraduationCap, X, Coffee } from 'lucide-react';
import { CanteenConfig } from '@/types/canteen';

interface FirstVisitNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanteenConfig;
}

export function FirstVisitNoticeModal({
  isOpen,
  onClose,
  config,
}: FirstVisitNoticeModalProps) {
  if (!isOpen) return null;

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gerze_project_notice_seen', 'true');
      localStorage.setItem('gerze_student_project_notice_v2', 'true');
    }
    onClose();
  };

  const logoUrl = config.canteen.logo || '/image.png';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm shrink-0 p-1 flex items-center justify-center">
              <Image
                src={logoUrl}
                alt={`${config.canteen.school} Logo`}
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Öğrenci Katkı Projesi
                </span>
              </div>
              <h2 className="font-black text-base sm:text-lg text-slate-900 tracking-tight mt-0.5">
                Hoş Geldiniz! 🎓
              </h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Text */}
        <div className="p-5 pt-2 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Gerze MYO Kantin Ön Sipariş Sistemi</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Bu web uygulaması; ders aralarında ve teneffüslerde kantindeki kalabalık ve sıra yoğunluğunu önlemek, öğrencilerin ders çıkışında siparişlerini zille birlikte sıcacık teslim almalarını sağlamak amacıyla <strong>öğrenciler tarafından kantinimize katkı ve destek projesi</strong> olarak gönüllü geliştirilmiştir.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Nasıl Faydalanabilirsiniz?
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  1
                </span>
                <span>
                  Menüden istediğin tostu, içeceği ve ekstra sosları seçip sepete ekle.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  2
                </span>
                <span>
                  Teslim alma saatini kendi ders veya teneffüs saatine göre belirle (15 saniyede sipariş).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                  3
                </span>
                <span>
                  Sipariş metnini WhatsApp üzerinden kantinciye ilet; teneffüste hiç sıra beklemeden teslim al!
                </span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Geliştirici: <strong>{config.canteen.developer.name}</strong></span>
            <span className="text-emerald-700 font-bold">{config.canteen.school}</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleDismiss}
            className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Anladım, Harika! Menüye Geç</span>
          </button>
        </div>
      </div>
    </div>
  );
}
