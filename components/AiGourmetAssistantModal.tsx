'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  X,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Compass,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { ProductItem, CartItem, CanteenConfig } from '@/types/canteen';

interface AiGourmetAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CanteenConfig;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  addToast: (text: string, type?: 'success' | 'warning') => void;
}

type MoodType = 'fast' | 'exam' | 'hungry' | 'sleepy' | 'sweet' | 'budget';
type BudgetType = 'low' | 'mid' | 'high' | 'any';
type ComboType = 'combo' | 'food_only' | 'drink_only';

interface RecommendationResult {
  mainProduct: ProductItem;
  secondaryProduct?: ProductItem;
  totalPrice: number;
  matchScore: number;
  title: string;
  reasoning: string;
  tag: string;
}

const MOODS: { id: MoodType; emoji: string; title: string; desc: string }[] = [
  {
    id: 'exam',
    emoji: '📚',
    title: 'Vize & Final Çalışıyorum',
    desc: 'Zihin açan, odaklanma ve enerji veren lezzetler',
  },
  {
    id: 'hungry',
    emoji: '🦁',
    title: 'Kurt Gibi Açım',
    desc: 'Maksimum doyuruculuk, sağlam porsiyon',
  },
  {
    id: 'fast',
    emoji: '🏃',
    title: 'Teneffüste Koşturmaca',
    desc: 'Hemen alıp derse yetişebileceğim pratik seçimler',
  },
  {
    id: 'sleepy',
    emoji: '☕',
    title: 'Ayılmam Lazım / Uykum Var',
    desc: 'Gözlerimi açacak kafein ve canlandırıcı tatlar',
  },
  {
    id: 'sweet',
    emoji: '🍰',
    title: 'Tatlı / Moral Krizindeyim',
    desc: 'Dopamin deposu, motivasyonumu katlayacak tatlar',
  },
  {
    id: 'budget',
    emoji: '🪙',
    title: 'Öğrenci F/P Bütçesi',
    desc: 'En az paraya en yüksek lezzet ve tokluk',
  },
];

const BUDGETS: { id: BudgetType; label: string; range: string }[] = [
  { id: 'low', label: 'Ekonomik', range: '≤ 35 ₺' },
  { id: 'mid', label: 'Standart', range: '35 - 75 ₺' },
  { id: 'high', label: 'Zengin Menü', range: '75 ₺+' },
  { id: 'any', label: 'Fark Etmez', range: 'Limitsiz' },
];

const COMBOS: { id: ComboType; label: string; icon: string }[] = [
  { id: 'combo', label: 'Tam Menü (Yiyecek + İçecek)', icon: '🥪🥤' },
  { id: 'food_only', label: 'Sadece Yiyecek / Tost', icon: '🍔' },
  { id: 'drink_only', label: 'Sadece İçecek', icon: '☕' },
];

export function AiGourmetAssistantModal(props: AiGourmetAssistantModalProps) {
  if (!props.isOpen) return null;
  return <AiGourmetAssistantModalContent {...props} />;
}

function AiGourmetAssistantModalContent({
  onClose,
  config,
  onAddToCart,
  addToast,
}: AiGourmetAssistantModalProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>('hungry');
  const [selectedBudget, setSelectedBudget] = useState<BudgetType>('mid');
  const [selectedCombo, setSelectedCombo] = useState<ComboType>('combo');

  // Decision animation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const analysisLogMessages = [
    '🥗 Günün taze menüsü ve fırın lezzetleri taranıyor...',
    '🥪 Seçtiğin duruma ve bütçene en uygun kombinasyonlar taranıyor...',
    '⚡ En iyi fiyat/performans lezzet eşleşmesi belirleniyor...',
    '✨ Harika bir menü senin için hazırlandı!',
  ];

  // Logic to produce recommendation based on selection
  const computeRecommendation = () => {
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    const stepInterval = setInterval(() => {
      setAnalysisStepIndex((prev) => {
        if (prev < analysisLogMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 280);

    setTimeout(() => {
      clearInterval(stepInterval);

      const available = config.products.filter((p) => p.available !== false);
      const foods = available.filter(
        (p) => p.category === 'tost' || p.category === 'sandvic' || p.category === 'atistirmalik'
      );
      const drinks = available.filter(
        (p) => p.category === 'sicak-icecek' || p.category === 'soguk-icecek'
      );
      const sweets = available.filter((p) => p.category === 'tatli');

      let mainProduct: ProductItem;
      let secondaryProduct: ProductItem | undefined;
      let title = 'Günün Özel Lezzet Seçimi';
      let reasoning = '';
      let tag = 'F/P Şampiyonu';

      if (selectedMood === 'exam') {
        mainProduct =
          foods.find((p) => p.id === 'karisik-tost') ||
          foods.find((p) => p.id === 'kasarli-tost') ||
          foods[0];
        secondaryProduct =
          drinks.find((p) => p.id === 'taze-demleme-cay') ||
          drinks.find((p) => p.id === 'filtre-kahve') ||
          drinks[0];
        title = 'Vize & Final Zihin Açıcı Menü';
        reasoning =
          'Sınav ve ders hazırlığında yüksek protein ve enerji dengesi şart. Sıcak çıtır tost ve taze Rize çayı odağını yüksek tutup ders çalışırken enerjini korur!';
        tag = 'Sınav Kurtarıcısı';
      } else if (selectedMood === 'hungry') {
        mainProduct =
          foods.find((p) => p.id === 'ayvalik-tostu') ||
          foods.find((p) => p.id === 'tavuk-doner-durum') ||
          foods[0];
        secondaryProduct =
          drinks.find((p) => p.id === 'yayik-ayran') ||
          drinks.find((p) => p.id === 'kutu-kola') ||
          drinks[0];
        title = 'Maksimum Doyurucu Menü';
        reasoning =
          'Açlığını en hızlı ve en lezzetli şekilde yatıştıracak menü! Bol malzemeli özel tost ve serinletici ayran akşama kadar tok kalmanı sağlayacak.';
        tag = 'Maksimum Tokluk';
      } else if (selectedMood === 'sleepy') {
        if (selectedCombo === 'drink_only') {
          mainProduct = drinks.find((p) => p.id === 'filtre-kahve') || drinks[0];
        } else {
          mainProduct =
            foods.find((p) => p.id === 'kasarli-pogaca') ||
            foods.find((p) => p.id === 'gevrek-simit') ||
            foods[0];
          secondaryProduct = drinks.find((p) => p.id === 'filtre-kahve') || drinks[0];
        }
        title = 'Göz Açıcı Kafein & Atıştırmalık';
        reasoning =
          'Derste uyuklamaya son! Taze demlenmiş mis kokulu filtre kahve ve sıcacık atıştırmalık, enerjini hızlıca yerine getirir.';
        tag = 'Ekstra Enerji';
      } else if (selectedMood === 'sweet') {
        mainProduct =
          sweets.find((p) => p.id === 'islak-kek') ||
          foods.find((p) => p.id === 'kasarli-tost') ||
          available[0];
        secondaryProduct =
          drinks.find((p) => p.id === 'taze-demleme-cay') ||
          drinks.find((p) => p.id === 'sicak-cikolata') ||
          drinks[0];
        title = 'Tatlı & Keyif Molası';
        reasoning =
          'Günün yorgunluğunu unutturacak harika bir mola. Bol çikolata soslu nefis ıslak kek ve sıcacık çay eşleşmesi moralini anında yükseltir.';
        tag = 'Keyif & Tatlı';
      } else if (selectedMood === 'budget') {
        mainProduct =
          foods.find((p) => p.id === 'gevrek-simit') ||
          foods.find((p) => p.id === 'kasarli-pogaca') ||
          foods[0];
        secondaryProduct =
          drinks.find((p) => p.id === 'taze-demleme-cay') ||
          drinks.find((p) => p.id === 'dogal-maden-suyu') ||
          drinks[0];
        title = 'Kampüsün Efsane F/P Menüsü';
        reasoning =
          'Cebini düşünen öğrenci klasiği! Taze fırından gevrek simit ve ince belli bardakta taze çay; minimum bütçeyle maksimum keyif.';
        tag = 'Öğrenci Dostu F/P';
      } else {
        mainProduct =
          foods.find((p) => p.id === 'soguk-sandvic') ||
          foods.find((p) => p.id === 'kasarli-tost') ||
          foods[0];
        secondaryProduct =
          drinks.find((p) => p.id === 'fuse-tea-seftali') ||
          drinks.find((p) => p.id === 'su-500ml') ||
          drinks[0];
        title = 'Hızlı Al & Koş Teneffüs Menüsü';
        reasoning =
          'Teneffüs ziline az kaldı! Hazırlanması ve tüketimi son derece pratik doyurucu sandviç ve serinletici içecek. Hemen teslim al, sırayı unut.';
        tag = 'Ultra Hızlı';
      }

      if (selectedCombo === 'food_only') {
        secondaryProduct = undefined;
      } else if (selectedCombo === 'drink_only') {
        mainProduct = secondaryProduct || drinks[0] || available[0];
        secondaryProduct = undefined;
      }

      const mainPrice = mainProduct.discountPrice ?? mainProduct.price;
      const secPrice = secondaryProduct
        ? (secondaryProduct.discountPrice ?? secondaryProduct.price)
        : 0;
      const totalPrice = mainPrice + secPrice;

      setResult({
        mainProduct,
        secondaryProduct,
        totalPrice,
        matchScore: Math.floor(Math.random() * 4) + 96,
        title,
        reasoning,
        tag,
      });

      setIsAnalyzing(false);
    }, 1100);
  };

  const handleAddRecommendationToCart = () => {
    if (!result) return;

    onAddToCart({
      product: result.mainProduct,
      quantity: 1,
      selectedExtras: [],
      note: 'Özel Menü Seçimi',
      unitPrice: result.mainProduct.discountPrice ?? result.mainProduct.price,
      totalPrice: result.mainProduct.discountPrice ?? result.mainProduct.price,
    });

    if (result.secondaryProduct) {
      setTimeout(() => {
        onAddToCart({
          product: result.secondaryProduct!,
          quantity: 1,
          selectedExtras: [],
          note: 'Menü İçecek Eşleşmesi',
          unitPrice: result.secondaryProduct!.discountPrice ?? result.secondaryProduct!.price,
          totalPrice: result.secondaryProduct!.discountPrice ?? result.secondaryProduct!.price,
        });
      }, 50);
    }

    addToast('Önerilen menü sepete eklendi! 🎉');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-md font-black">
              <Compass className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg tracking-tight text-white">
                  Ne Yesem? Karar Sihirbazı
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Hızlı Menü Seçici
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kararsız mısın? Moduna ve bütçene göre sana en uygun lezzeti bulalım!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {!result && !isAnalyzing && (
            <>
              {/* Step 1: Mood */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between">
                  <span>1. Şu anki durumun ve ruh halin ne?</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MOODS.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMood(m.id)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-600'
                        }`}
                      >
                        <div className="text-xl mb-1">{m.emoji}</div>
                        <div className="font-bold text-xs leading-snug">{m.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                          {m.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Budget */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-900 text-xs sm:text-sm">
                  2. Hedef bütçen ne kadar?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BUDGETS.map((b) => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBudget(b.id)}
                        className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div>{b.label}</div>
                        <div className="text-[10px] font-normal opacity-80">{b.range}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Combo Type */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-900 text-xs sm:text-sm">
                  3. Ne tür bir menü istiyorsun?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {COMBOS.map((c) => {
                    const isSelected = selectedCombo === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCombo(c.id)}
                        className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Analysis Simulation */}
          {isAnalyzing && (
            <div className="py-12 px-4 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <div className="w-full h-full rounded-full flex items-center justify-center bg-slate-900 text-amber-400">
                  <Utensils className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  En Uygun Menü Hazırlanıyor...
                </h3>
                <p className="text-xs text-emerald-700 font-semibold min-h-5 animate-pulse">
                  {analysisLogMessages[analysisStepIndex]}
                </p>
              </div>

              <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-300"
                  style={{
                    width: `${((analysisStepIndex + 1) / analysisLogMessages.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Recommendation Result Screen */}
          {result && !isAnalyzing && (
            <div className="space-y-4 animate-scaleIn">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {result.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Sana Özel Lezzet Uyumu: %{result.matchScore}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-black bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-xs">
                  {result.tag}
                </span>
              </div>

              {/* Recommended Items Grid */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Önerilen Menü:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                      <Image
                        src={result.mainProduct.image}
                        alt={result.mainProduct.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {result.mainProduct.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {result.mainProduct.description}
                      </p>
                      <div className="text-emerald-700 font-black text-xs mt-1">
                        {(result.mainProduct.discountPrice ?? result.mainProduct.price).toLocaleString(
                          'tr-TR'
                        )}{' '}
                        {config.currency}
                      </div>
                    </div>
                  </div>

                  {result.secondaryProduct && (
                    <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex gap-3 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                        <Image
                          src={result.secondaryProduct.image}
                          alt={result.secondaryProduct.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {result.secondaryProduct.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {result.secondaryProduct.description}
                        </p>
                        <div className="text-emerald-700 font-black text-xs mt-1">
                          {(
                            result.secondaryProduct.discountPrice ??
                            result.secondaryProduct.price
                          ).toLocaleString('tr-TR')}{' '}
                          {config.currency}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chef Recommendation Note */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 space-y-1.5 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Şefin Tavsiyesi & Gurme Notu:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{result.reasoning}&rdquo;
                </p>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 font-bold text-xs text-slate-900">
                <span>Toplam Menü Fiyatı:</span>
                <span className="text-base font-black text-emerald-700">
                  {result.totalPrice.toLocaleString('tr-TR')} {config.currency}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5">
          {!result && !isAnalyzing ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={computeRecommendation}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Bana En Uygun Menüyü Bul</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : result && !isAnalyzing ? (
            <>
              <button
                type="button"
                onClick={computeRecommendation}
                className="py-2.5 px-3.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                title="Başka bir öneri üret"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Farklı Öneri</span>
              </button>
              <button
                type="button"
                onClick={handleAddRecommendationToCart}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Menüyü Sepete Ekle</span>
              </button>
            </>
          ) : (
            <div className="w-full text-center text-xs text-slate-400 font-medium py-1">
              Menü hazırlanıyor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
