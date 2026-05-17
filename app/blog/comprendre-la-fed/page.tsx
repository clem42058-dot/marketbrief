import Link from "next/link";

export const metadata = {
  title: "Comprendre la Fed et son impact sur vos investissements – MarketBrief",
  description: "La Réserve fédérale américaine est l'institution la plus influente des marchés mondiaux. Voici pourquoi chacune de ses décisions vous concerne.",
};

export default function Article2() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/blog" className="text-sky-500 text-sm mb-8 inline-block hover:text-sky-600">← Retour au blog</Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">Macro</span>
          <span className="text-xs text-slate-400">1 mai 2026 · 6 min de lecture</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">Comprendre la Fed et son impact sur vos investissements</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">La Réserve fédérale américaine est l'institution la plus influente des marchés mondiaux. Voici pourquoi chacune de ses décisions vous concerne directement.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Qu'est-ce que la Fed ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">La Federal Reserve, ou Fed, est la banque centrale des États-Unis. Fondée en 1913, elle joue un rôle crucial dans l'économie mondiale en contrôlant la politique monétaire américaine. Son objectif principal est double : maintenir la stabilité des prix en contrôlant l'inflation, et favoriser le plein emploi.</p>
        <p className="text-slate-600 leading-relaxed mb-4">Son président actuel, Jerome Powell, est l'une des personnes les plus suivies de la planète finance. Chaque mot qu'il prononce lors des conférences de presse peut faire bouger les marchés de plusieurs points de pourcentage en quelques secondes.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Comment la Fed influence les marchés ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">L'outil principal de la Fed est le taux directeur, aussi appelé taux des Fed funds. En augmentant ce taux, la Fed rend l'emprunt d'argent plus cher, ce qui ralentit l'économie et fait baisser l'inflation. En baissant ce taux, elle stimule l'économie en rendant le crédit moins coûteux.</p>
        <p className="text-slate-600 leading-relaxed mb-4">Quand la Fed baisse ses taux, les actions ont tendance à monter car les entreprises peuvent emprunter moins cher pour investir. À l'inverse, une hausse des taux pèse généralement sur les bourses, en particulier sur les valeurs technologiques très endettées.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Pourquoi la Fed est-elle si suivie en 2026 ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">En 2026, la Fed se retrouve dans une position délicate. Le conflit en Iran a fait exploser les prix du pétrole, relançant les risques inflationnistes. Dans ce contexte, la Fed hésite entre maintenir ses taux pour contenir l'inflation ou les baisser pour soutenir une économie qui montre des signes de ralentissement.</p>
        <p className="text-slate-600 leading-relaxed mb-4">Cette incertitude explique pourquoi chaque réunion du comité de politique monétaire de la Fed, le FOMC, est scrutée par des millions d'investisseurs dans le monde entier.</p>
        <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Comment rester informé des décisions de la Fed ?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">Les réunions du FOMC ont lieu environ 8 fois par an. MarketBrief signale automatiquement toutes les actualités liées à la Fed avec le badge 🔥 Breaking, car ces informations ont un impact immédiat et significatif sur l'ensemble des marchés financiers mondiaux.</p>
        <p className="text-slate-600 leading-relaxed mb-6">En consultant MarketBrief chaque matin, vous ne raterez jamais une décision importante de la Fed et comprendrez mieux pourquoi les marchés réagissent comme ils le font.</p>
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mt-8">
          <p className="font-semibold text-slate-800 mb-2">🔥 Ne ratez plus les news Breaking</p>
          <p className="text-slate-600 text-sm mb-3">MarketBrief classe automatiquement les décisions de la Fed et les actualités macro en Breaking News.</p>
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