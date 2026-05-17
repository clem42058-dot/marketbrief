import Link from "next/link";

export const metadata = {
  title: "Contact – MarketBrief",
  description: "Contactez l'équipe MarketBrief par email, Instagram ou X.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-sky-500 text-sm mb-8 inline-block hover:text-sky-600">← Retour à l'app</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Nous contacter</h1>
        <p className="text-slate-500 text-lg mb-10">Une question, une suggestion ou un bug ? On vous répond rapidement.</p>
        <div className="grid gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📧</div>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">Email</p>
              <p className="text-slate-500 text-sm mb-1">Pour toute question générale ou signalement de bug</p>
              <a href="mailto:clem42058@gmail.com" className="text-sky-500 hover:text-sky-600 font-medium text-sm">clem42058@gmail.com</a>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📸</div>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">Instagram</p>
              <p className="text-slate-500 text-sm mb-1">Suivez-nous pour les news financières du jour en vidéo</p>
              <a href="https://instagram.com/marketbrief_off" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 font-medium text-sm">@marketbrief_off</a>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">𝕏</div>
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">X (Twitter)</p>
              <p className="text-slate-500 text-sm mb-1">Actualités et alertes marchés en temps réel</p>
              <a href="https://x.com/Marketbrief_app" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 font-medium text-sm">@Marketbrief_app</a>
            </div>
          </div>
        </div>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "MarketBrief est-il gratuit ?", a: "Oui, MarketBrief est entièrement gratuit. Une version Premium est disponible pour supprimer les publicités et accéder à plus de news." },
              { q: "D'où viennent les actualités ?", a: "Les news proviennent de médias financiers reconnus comme Reuters, Bloomberg et le Financial Times, filtrées automatiquement par pertinence." },
              { q: "Comment sont calculés les indicateurs d'impact ?", a: "Un algorithme analyse le contenu de chaque article et détermine si la news est positive, négative ou neutre pour les marchés financiers." },
              { q: "Les données de marché sont-elles en temps réel ?", a: "Oui, les prix des indices et des cryptomonnaies sont mis à jour en temps réel via Yahoo Finance." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="font-medium text-slate-800 mb-1">{item.q}</p>
                <p className="text-slate-500 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="pt-6 border-t border-slate-200 flex gap-4 text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-500">Accueil</Link>
          <Link href="/about" className="hover:text-sky-500">À propos</Link>
          <Link href="/blog" className="hover:text-sky-500">Blog</Link>
          <Link href="/privacy" className="hover:text-sky-500">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}