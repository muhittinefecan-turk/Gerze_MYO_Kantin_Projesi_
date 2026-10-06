import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
          404
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-sm text-slate-600 mb-6">
          Aradığınız menü veya sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          Kantin Menüsüne Dön
        </Link>
      </div>
    </div>
  );
}
