'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  User,
  Clock,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Zap,
  Sparkles,
} from 'lucide-react';
import { CartItem, CanteenConfig, StudentInfo } from '@/types/canteen';
import { generateOrderId, buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  config: CanteenConfig;
  onOrderCompleted: () => void;
}

const PRESET_TIMES = [
  'Hemen (10-15 dk)',
  'Gelecek Teneffüs',
  '10:50 (2. Teneffüs)',
  '12:30 (Öğle Arası)',
  '13:50 (Öğleden Sonra)',
  'Ders Çıkışı',
];

function saveOrderToHistory(
  orderId: string,
  items: CartItem[],
  totalAmount: number,
  pickupTime: string,
  paymentMethod: string
) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('gerze_order_history') || '[]');
    const now = new Date();
    const newRecord = {
      id: orderId,
      date: now.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: now.getTime(),
      items: [...items],
      totalPrice: totalAmount,
      pickupTime,
      paymentMethod: paymentMethod === 'pos' ? 'POS / Kart' : 'Nakit',
    };
    const updated = [newRecord, ...existing].slice(0, 30);
    localStorage.setItem('gerze_order_history', JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  config,
  onOrderCompleted,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gerze_student_name') || '';
    }
    return '';
  });
  const [studentNumber, setStudentNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gerze_student_no') || '';
    }
    return '';
  });

  // Pickup time: presets or custom
  const [pickupTime, setPickupTime] = useState<string>('Hemen (10-15 dk)');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTimeText, setCustomTimeText] = useState('');

  // Payment: cash or POS card
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'pos'>('cash');
  const [generalNote, setGeneralNote] = useState('');

  // Submission / Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    orderId: string;
    waUrl: string;
  } | null>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const currency = config.currency || '₺';

  const finalPickupTime = isCustomTime
    ? (customTimeText.trim() || 'Hemen (10-15 dk)')
    : pickupTime;

  const handleSendOrder = () => {
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Sepetinizde ürün bulunmamaktadır.');
      return;
    }

    if (isCustomTime && !customTimeText.trim()) {
      setErrorMsg('Lütfen teslim almak istediğiniz saati yazınız.');
      return;
    }

    // Save student details in browser for instant 15-second next order!
    if (typeof window !== 'undefined') {
      localStorage.setItem('gerze_student_name', fullName.trim());
      if (studentNumber.trim()) {
        localStorage.setItem('gerze_student_no', studentNumber.trim());
      }
    }

    setIsSubmitting(true);

    const studentInfo: StudentInfo = {
      fullName: fullName.trim(),
      studentNumber: studentNumber.trim() || undefined,
      pickupTime: finalPickupTime,
      paymentMethod,
      generalNote: generalNote.trim() || undefined,
    };

    const orderId = generateOrderId();
    const rawMessage = buildWhatsAppMessage(config, items, studentInfo, orderId);
    const waUrl = buildWhatsAppUrl(config.canteen.whatsapp, rawMessage);

    // Save to order history in localStorage
    saveOrderToHistory(orderId, items, totalAmount, finalPickupTime, paymentMethod);

    setTimeout(() => {
      setSuccessInfo({ orderId, waUrl });
      setIsSubmitting(false);

      // Open WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      onOrderCompleted();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scaleIn border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-900 text-sm sm:text-base">
                  Hızlı Sipariş (15-30 sn)
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Sıra Bekleme Yok
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Bilgileri onayla, WhatsApp mesajın hazır olarak açılsın
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Screen */}
          {successInfo ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">WhatsApp Açıldı!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Sipariş No: <strong className="text-slate-800">{successInfo.orderId}</strong>
                </p>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  WhatsApp uygulamasında mesaj otomatik olarak yüklendi. Siparişin kantine iletilmesi için <strong>WhatsApp üzerindeki Gönder butonuna basınız.</strong>
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={successInfo.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Tekrar WhatsApp&apos;ı Aç</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Tamam, Kapat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Student Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ad Soyad</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {fullName && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      ✓ Hatırlandı
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-slate-900 font-medium"
                    autoFocus={!fullName}
                  />
                  <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="Öğrenci No (İsteğe bağlı)"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              {/* Step 2: Flexible Pickup Time */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teslim Alma Zamanı</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    İstediğin saati seç veya yaz
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PRESET_TIMES.map((preset) => {
                    const isSelected = !isCustomTime && pickupTime === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setIsCustomTime(false);
                          setPickupTime(preset);
                        }}
                        className={`py-2 px-2.5 rounded-xl text-left font-medium transition-all text-xs border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}

                  {/* Custom Option Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomTime(true)}
                    className={`py-2 px-2.5 rounded-xl text-left font-medium transition-all text-xs border sm:col-span-3 ${
                      isCustomTime
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    }`}
                  >
                    ✏️ Farklı / Özel Bir Saat Belirle
                  </button>
                </div>

                {/* Custom Time Input Box */}
                {isCustomTime && (
                  <div className="pt-1 animate-fadeIn">
                    <input
                      type="text"
                      value={customTimeText}
                      onChange={(e) => setCustomTimeText(e.target.value)}
                      placeholder="Örn: 12:15'te geleceğim / 3. ders bitiminde / 20 dk sonra"
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-emerald-500 bg-white focus:outline-hidden text-slate-900 font-medium"
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Kantine ne zaman uğrayabileceğini dilediğin gibi belirtebilirsin.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method (Nakit or POS) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ödeme Şekli (Kantine Gelince)</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">💵 Nakit</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Kantine gelince nakit
                      </div>
                    </div>
                  </button>

                  {/* POS */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pos')}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'pos'
                        ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">💳 POS / Kart</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Temassız POS cihazı
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 4: Optional General Note */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Özel İstek veya Not (İsteğe bağlı)</span>
                </label>
                <input
                  type="text"
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  placeholder="Örn: Paket yapılsın, arkadaşımla beraber alacağız..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-slate-900"
                />
              </div>

              {/* Compact Order Recap */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 text-xs">
                  <span>Sepet ({items.length} çeşit)</span>
                  <span className="text-emerald-700 font-black">
                    {totalAmount.toLocaleString('tr-TR')} {currency}
                  </span>
                </div>
                <div className="max-h-20 overflow-y-auto space-y-0.5 text-[11px] text-slate-600">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span className="truncate pr-2">
                        {i.quantity}x {i.product.name}
                      </span>
                      <span className="font-semibold text-slate-800 shrink-0">
                        {i.totalPrice.toLocaleString('tr-TR')} {currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer / WhatsApp CTA Button */}
        {!successInfo && (
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Toplam Tutar
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900">
                {totalAmount.toLocaleString('tr-TR')} {currency}
              </span>
            </div>

            <button
              disabled={isSubmitting}
              onClick={handleSendOrder}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-60 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sipariş Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Hemen WhatsApp ile Gönder</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
