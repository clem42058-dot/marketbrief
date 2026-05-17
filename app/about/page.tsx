import Link from "next/link";

export const metadata = {
  title: "À propos – MarketBrief",
  description: "MarketBrief est votre briefing financier quotidien. Découvrez les marchés en 2 minutes chaque matin.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-sky-500 text-sm mb-8 inline-block hover:text-sky-600">← Retour à l'app</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Market<span className="text-sky-500">Brief</span></h1>
        <p className="text-slate-500 text-lg mb-10">L'actu financière en 2 minutes.</p>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Notre mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">MarketBrief est une application web gratuite conçue pour permettre à n'importe qui — investisseur débutant, trader ou simplement curieux — de comprendre les marchés financiers en moins de 2 minutes chaque matin.</p>
          <p className="text-slate-600 leading-relaxed">Nous croyons que l'information financière doit être accessible, claire et rapide. Pas besoin d'un abonnement Bloomberg à 2 000€ par mois pour savoir ce qui se passe sur les marchés aujourd'hui.</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Ce que fait MarketBrief</h2>
          <ul className="space-y-3">
            {["📰 Agrège les 10 actualités financières les plus importantes du jour","🔥 Classe les news par niveau d'importance : Breaking, Important, Normal","📈 Indique l'impact sur les marchés : Positif, Négatif ou Neutre","📊 Affiche les indices boursiers en temps réel : S&P 500, NASDAQ, CAC 40, DAX","₿ Suit les cryptomonnaies : Bitcoin, Ethereum, Solana","⭐ Permet de filtrer les news par action favorite : NVDA, AAPL, TSLA, BTC, ETH","🌍 Interface disponible en français et en anglais","🌙 Mode sombre pour confort de lecture"].map((item, i) => (
              <li key={i} className="text-slate-600">{item}</li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Pourquoi MarketBrief ?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">Les grandes plateformes financières comme Bloomberg ou CNBC sont conçues pour des professionnels. Elles sont complexes, coûteuses et surchargées d'informations. MarketBrief prend le contre-pied total : un seul écran, 10 news maximum, un chargement instantané.</p>
          <p className="text-slate-600 leading-relaxed">Notre objectif est simple : vous permettre d'ouvrir l'app chaque matin pendant votre café, de lire les news les plus importantes en 2 minutes, et de commencer votre journée avec une vision claire des marchés.</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Technologie</h2>
          <p className="text-slate-600 leading-relaxed">MarketBrief est construit avec Next.js et déployé sur Vercel. Les actualités sont récupérées via NewsAPI depuis des sources fiables comme Reuters, Bloomberg et le Financial Times. Les données de marché proviennent de Yahoo Finance en temps réel.</p>
        </section>
        <section className="bg-sky-50 border border-sky-200 rounded-2xl p-6 text-center">
          <p className="text-slate-700 font-medium mb-2">Des questions ou suggestions ?</p>
          <Link href="/contact" className="text-sky-500 hover:text-sky-600 font-medium">Contactez-nous →</Link>
        </section>
        <div className="mt-10 pt-6 border-t border-slate-200 flex gap-4 text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-500">Accueil</Link>
          <Link href="/contact" className="hover:text-sky-500">Contact</Link>
          <Link href="/blog" className="hover:text-sky-500">Blog</Link>
          <Link href="/privacy" className="hover:text-sky-500">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}