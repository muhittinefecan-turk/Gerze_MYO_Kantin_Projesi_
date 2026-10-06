import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e293b',
};

export const metadata: Metadata = {
  title: 'Gerze MYO Kantin - WhatsApp Ön Sipariş',
  description: 'Gerze Meslek Yüksekokulu Kantini WhatsApp ön sipariş ve menü yönetim web uygulaması. Geliştirici: Muhittin Efecan Türk.',
  openGraph: {
    title: 'Gerze MYO Kantin - WhatsApp Ön Sipariş',
    description: 'Sıra beklemeden kantin menüsünü seç, WhatsApp üzerinden anında siparişini ilet.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerze MYO Kantin - WhatsApp Ön Sipariş',
    description: 'Gerze Meslek Yüksekokulu Kantini WhatsApp ön sipariş ve menü yönetim uygulaması.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
