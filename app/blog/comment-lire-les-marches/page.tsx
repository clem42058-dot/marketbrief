import Link from "next/link";

export const metadata = {
  title: "Comment lire les marchés financiers quand on débute ? – MarketBrief",
  description: "Indices boursiers, variations en pourcentage, volumes… Voici tout ce qu'il faut savoir pour lire les marchés sans se perdre.",
};

export default function Article1() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="text-sky-500 text-sm mb-8 inline-block hover:text-sky-600">← Retour au blog</Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full">Débutant</span>
          <span className="text-xs text-slate-400">2 mai 2026 · 5 min de lecture</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">Comment lire les marchés financiers quand on débute ?</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">Indices boursiers, variations en pourcentage, volumes… Voici tout ce qu'il faut savoir pour lire les marchés sans se perdre.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Qu'est-ce qu'un indice boursier ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">Un indice boursier est un indicateur qui mesure la performance d'un ensemble d'actions. Il fonctionne comme un thermomètre de l'économie. Quand il monte, cela signifie que les entreprises qui le composent valent globalement plus. Quand il baisse, c'est l'inverse.</p>
        <p className="text-slate-600 leading-relaxed mb-4">Les indices les plus connus sont le S&P 500 aux États-Unis, qui regroupe les 500 plus grandes entreprises américaines, le NASDAQ qui se concentre sur les valeurs technologiques, et le CAC 40 en France qui suit les 40 plus grandes entreprises françaises cotées en bourse.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Que signifie une variation en pourcentage ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">Quand vous voyez +1,5% à côté du S&P 500, cela signifie que l'indice a gagné 1,5% par rapport à la clôture de la veille. Une variation de +5% est considérée comme très forte. Une chute de -10% en une journée est ce qu'on appelle un krach boursier.</p>
        <p className="text-slate-600 leading-relaxed mb-4">En temps normal, les marchés bougent de 0,5% à 1,5% par jour. Au-delà, quelque chose d'important s'est produit : une décision de banque centrale, une guerre, ou de très bons ou très mauvais résultats d'entreprise.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Les secteurs de la bourse</h2>
        <p className="text-slate-600 leading-relaxed mb-4">La bourse est organisée en secteurs. La technologie regroupe des entreprises comme Apple, Microsoft et NVIDIA. L'énergie comprend les compagnies pétrolières. La finance regroupe les banques et assurances. La santé comprend les laboratoires pharmaceutiques.</p>
        <p className="text-slate-600 leading-relaxed mb-4">Quand le pétrole monte, les actions du secteur énergie montent en général. Quand les taux d'intérêt baissent, les actions tech ont tendance à progresser. Comprendre ces liens vous permet de mieux interpréter les news financières.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Comment utiliser MarketBrief pour suivre les marchés</h2>
        <p className="text-slate-600 leading-relaxed mb-4">MarketBrief classe chaque actualité par secteur et indique son impact potentiel sur les marchés. Une news marquée 📈 Positif suggère qu'elle pourrait faire monter les prix. Une news 📉 Négatif pourrait avoir l'effet inverse. L'indicateur ⚖️ Neutre signifie que l'impact est incertain.</p>
        <p className="text-slate-600 leading-relaxed mb-6">En consultant MarketBrief chaque matin, vous développerez progressivement votre compréhension des marchés et saurez anticiper les mouvements importants de la journée.</p>
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mt-8">
          <p className="font-semibold text-slate-800 mb-2">📱 Retrouvez les marchés en temps réel</p>
          <p className="text-slate-600 text-sm mb-3">MarketBrief affiche les prix du S&P 500, NASDAQ, CAC 40 et des cryptos en direct, gratuitement.</p>
          <Link href="/" className="text-sky-500 hover:text-sky-600 font-medium text-sm">Ouvrir MarketBrief →</Link>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 flex gap-4 text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-500">Accueil</Link>
          <Link href="/blog" className="hover:text-sky-500">Blog</Link>
          <Link href="/contact" className="hover:text-sky-500">Contact</Link>
        </div>
      </div>
    </div>
  );
}