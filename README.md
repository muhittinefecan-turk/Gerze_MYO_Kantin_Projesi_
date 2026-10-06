# Gerze Meslek Yüksekokulu Kantini - WhatsApp Ön Sipariş Web Uygulaması

> **Geliştirici (Developer):** Muhittin Efecan Türk  
> **Kurum:** Sinop Üniversitesi Gerze Meslek Yüksekokulu Kantini  
> **Mimari:** Sıfır Veritabanı (No-DB), `config.json` ile Yönetilen, Doğrudan WhatsApp İletişimli Hızlı Web Uygulaması

---

## 🎯 Temel Akış
```
ÖĞRENCİ ──▶ WEB UYGULAMASI ──▶ SEPET & ÖZELLEŞTİRME ──▶ WHATSAPP ──▶ KANTİNCİ
```

1. **Öğrenci** web sitesine girer (masadaki QR koddan veya linkten).
2. Tost, sandviç, içecek menüsünü inceler; ketçap/mayonez gibi ekstralarını ve özel notunu ekler.
3. Teneffüs saatine göre **Teslim Zamanı** ve **Ödeme Şekli (Nakit / QR)** seçer.
4. **"WhatsApp ile Sipariş Ver"** butonuna basar.
5. WhatsApp hazır, profesyonelce biçimlendirilmiş sipariş metniyle açılır; öğrenci gönderir, kantinci hazırlar!

---

## 🚀 Cloudflare Pages ile Hızlı Canlıya Alma (Quick Deploy)

Bu uygulama veritabanı (D1, Postgres vb.) gerektirmediği için Cloudflare'e 1 dakika içinde ücretsiz dağıtılabilir.

### Yöntem 1: Cloudflare Pages Git Entegrasyonu (Önerilen)
1. Kodları GitHub veya GitLab deponuza gönderin (`git push`).
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** sekmesine gidin.
3. Deponuzu bağlayın.
4. Yapılandırma ayarlarını seçin:
   - **Framework preset:** `Next.js`
   - **Build command:** `npx @cloudflare/next-on-pages` (veya `npm run build`)
   - **Build output directory:** `.vercel/output/static` (veya statik export için `out`)
5. **Save and Deploy** butonuna basın.

### Yöntem 2: Wrangler CLI ile Tek Komutla Deploy
```bash
# Bağımlılıkları yükleyin
npm install

# Cloudflare Pages'e canlıya alın
npx wrangler pages deploy
```

---

## ⚙️ `config.json` ile Menü ve Ayar Yönetimi

Kantinci veya yönetici herhangi bir kod yazmadan `config.json` dosyasını düzenleyebilir:

- **Fiyat Değiştirme:** `"price": 75`
- **İndirim Tanımlama:** `"discountPrice": 70`
- **Ürün Tükendi Yapma:** `"available": false` (Sitede otomatik gri ve TÜKENDİ olur)
- **Kantini Siparişe Kapatma:** `"settings": { "ordersEnabled": false }`
- **WhatsApp Numarası Değiştirme:** `"whatsapp": "905XXXXXXXXX"`
- **Duyuru Güncelleme:** `"announcement": { "enabled": true, "text": "Bugün tostlarda kampanya!" }`
- **Çalışma Saatleri:** `"workingHours": { "open": "08:00", "close": "17:30" }`
- **QR / IBAN Bilgileri:** `"iban"`, `"accountName"`, `"qrImage"`

---

## 📱 WhatsApp Mesaj Formatı

```
🛒 *YENİ KANTİN SİPARİŞİ*
📍 *Gerze MYO Kantini*
━━━━━━━━━━━━━━━━

👤 *ÖĞRENCİ:* Muhittin Efecan Türk
🎓 *Öğrenci No:* 230105042
🔢 *Sipariş No:* KNT-20261006-8F42
⏰ *Teslim Zamanı:* 12:30 (Öğle Arası)
💳 *Ödeme:* 💵 Nakit (Kantine gelince ödenecek)

━━━━━━━━━━━━━━━━
🍔 *SİPARİŞ LİSTESİ*

2x Kaşarlı Tost (120 ₺)
   └ + Ketçap
   └ + Mayonez
   └ 📝 Özel İstek: Az kızarmış olsun.

1x Büyük Ayran (300ml) (18 ₺)

━━━━━━━━━━━━━━━━
📝 *GENEL NOT:*
12:30'da teslim alacağım.

━━━━━━━━━━━━━━━━
💰 *TOPLAM TUTAR: 138 ₺*
━━━━━━━━━━━━━━━━
_Bu sipariş Sinop Üniversitesi Gerze Meslek Yüksekokulu kantin web uygulaması ile oluşturuldu._
```
