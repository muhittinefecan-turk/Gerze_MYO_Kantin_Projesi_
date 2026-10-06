'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Clock, MapPin, Code, Heart, Sparkles } from 'lucide-react';
import { CanteenConfig } from '@/types/canteen';

interface FooterProps {
  config: CanteenConfig;
  onOpenNotice?: () => void;
}

export function Footer({ config, onOpenNotice }: FooterProps) {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Canteen & School Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-700 shadow-sm shrink-0 p-1 flex items-center justify-center">
                <Image
                  src={config.canteen.logo || '/image.png'}
                  alt={config.canteen.name}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">
                  {config.canteen.name}
                </h3>
                <span className="text-[10px] text-emerald-400 font-medium">
                  Ön Sipariş Platformu
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {config.canteen.school}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {config.canteen.description}
            </p>
          </div>

          {/* Working Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase text-xs">
              Çalışma Saatleri & İletişim
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Hafta İçi: {config.canteen.workingHours.open} - {config.canteen.workingHours.close}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${config.canteen.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: +{config.canteen.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gerze MYO Yerleşkesi / Sinop</span>
              </li>
            </ul>
          </div>

          {/* Developer Credit */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase text-xs">
              Geliştirici Bilgisi
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geliştirici (Developer):</span>
              </div>
              <p className="text-emerald-400 font-bold text-sm">
                {config.canteen.developer.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {config.canteen.developer.title} · {config.canteen.school}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Öğrencilerin teneffüslerde sıra beklemeden hızlı sipariş vermesi için tasarlanmıştır.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {config.canteen.school} · {config.canteen.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {onOpenNotice && (
              <>
                <button
                  type="button"
                  onClick={onOpenNotice}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  🎓 Öğrenci Katkı Projesi Bildirimi
                </button>
                <span>·</span>
              </>
            )}
            <span>Öğrenci Dostu WhatsApp Ön Sipariş Platformu</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
