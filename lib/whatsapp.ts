import { CartItem, StudentInfo, CanteenConfig } from '@/types/canteen';

/**
 * Generate a unique pseudo-order ID without a central database
 * Format: KNT-YYYYMMDD-XXXX (e.g., KNT-20261006-8F42)
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KNT-${year}${month}${day}-${randomPart}`;
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currency: string = '₺'): string {
  return `${amount.toLocaleString('tr-TR')} ${currency}`;
}

/**
 * Build professional, structured WhatsApp order message
 */
export function buildWhatsAppMessage(
  config: CanteenConfig,
  items: CartItem[],
  student: StudentInfo,
  orderId: string
): string {
  const currency = config.currency || '₺';
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Header
  let msg = `🛒 *YENİ KANTİN SİPARİŞİ*\n`;
  msg += `📍 *${config.canteen.name}*\n`;
  msg += `--------------------------------\n\n`;

  // Student Details
  msg += `👤 *ÖĞRENCİ:* ${student.fullName.trim()}\n`;
  if (student.studentNumber?.trim()) {
    msg += `🎓 *Öğrenci No:* ${student.studentNumber.trim()}\n`;
  }
  msg += `🔢 *Sipariş No:* ${orderId}\n`;
  msg += `⏰ *Teslim Zamanı:* ${student.pickupTime}\n`;

  // Payment
  const paymentText =
    student.paymentMethod === 'pos'
      ? '💳 POS / Kredi-Banka Kartı (Kantine gelince ödenecek)'
      : '💵 Nakit (Kantine gelince ödenecek)';
  msg += `💳 *Ödeme:* ${paymentText}\n\n`;

  msg += `--------------------------------\n`;
  msg += `🍔 *SİPARİŞ LİSTESİ*\n\n`;

  // Items
  items.forEach((item, index) => {
    msg += `• ${item.quantity}x *${item.product.name}* (${formatCurrency(item.totalPrice, currency)})\n`;

    // Extras
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      item.selectedExtras.forEach((extra) => {
        const extraPrice = extra.price > 0 ? ` (+${formatCurrency(extra.price, currency)})` : '';
        msg += `   + ${extra.name}${extraPrice}\n`;
      });
    }

    // Item note
    if (item.note && item.note.trim()) {
      msg += `   * Özel İstek: ${item.note.trim()}\n`;
    }

    if (index < items.length - 1) {
      msg += `\n`;
    }
  });

  // General note
  if (student.generalNote && student.generalNote.trim()) {
    msg += `\n--------------------------------\n`;
    msg += `📝 *GENEL NOT:*\n${student.generalNote.trim()}\n`;
  }

  // Footer & Total
  msg += `\n--------------------------------\n`;
  msg += `💰 *TOPLAM TUTAR: ${formatCurrency(totalAmount, currency)}*\n`;
  msg += `--------------------------------\n`;
  msg += `_Bu sipariş ${config.canteen.school} kantin web uygulaması ile oluşturuldu._`;

  return msg;
}

/**
 * Generate clickable WhatsApp URL with encoded message
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  // Clean phone number: remove spaces, +, -, etc.
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
