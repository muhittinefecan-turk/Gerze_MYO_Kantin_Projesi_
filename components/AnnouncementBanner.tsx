'use client';

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBannerProps {
  announcement?: {
    enabled: boolean;
    text: string;
    type?: 'info' | 'promo' | 'warning';
  };
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || !announcement.enabled || !announcement.text || dismissed) {
    return null;
  }

  const bgStyles = {
    promo: 'bg-emerald-900 text-emerald-50 border-emerald-800',
    warning: 'bg-amber-900 text-amber-50 border-amber-800',
    info: 'bg-slate-900 text-slate-100 border-slate-800',
  }[announcement.type || 'info'];

  return (
    <div className={`relative px-4 py-2.5 text-xs sm:text-sm font-medium border-b ${bgStyles} transition-all`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
          <p className="truncate sm:whitespace-normal">
            {announcement.text}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors shrink-0 text-slate-300 hover:text-white"
          aria-label="Duyuruyu Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
