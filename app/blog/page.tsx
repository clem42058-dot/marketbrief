import Link from "next/link";

export const metadata = {
  title: "Blog Finance – MarketBrief",
  description: "Articles et guides pour comprendre les marchés financiers, la bourse, les cryptomonnaies et l'économie mondiale.",
};

const articles = [
  { slug: "comment-lire-les-marches", title: "Comment lire les marchés financiers quand on débute ?", description: "Indices boursiers, variations en pourcentage, volumes… Voici tout ce qu'il faut savoir pour lire les marchés sans se perdre.", category: "Débutant", date: "2 mai 2026", readTime: "5 min" },
  { slug: "comprendre-la-fed", title: "Comprendre la Fed et son impact sur vos investissements", description: "La Réserve fédérale américaine est l'institution la plus influente des marchés mondiaux. Voici pourquoi chacune de ses décisions vous concerne.", category: "Macro", date: "1 mai 2026", readTime: "6 min" },
  { slug: "bitcoin-or-numerique", title: "Bitcoin : pourquoi on l'appelle l'or numérique ?", description: "Le Bitcoin est souvent comparé à l'or. Cette analogie est-elle justifiée ? Analyse des similarités et des différences entre les deux actifs.", category: "Crypto", date: "30 avril 2026", readTime: "7 min" },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link href="/" className="text-sky-500 text-sm mb-8 inline-block hover:text-sky-600">← Retour à l'app</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Finance</h1>
        <p className="text-slate-500 text-lg mb-10">Guides et analyses pour comprendre les marchés financiers simplement.</p>
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-sky-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full">{article.category}</span>
                <span className="text-xs text-slate-400">{article.date} · {article.readTime} de lecture</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">{article.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{article.description}</p>
              <p className="text-sky-500 text-sm font-medium mt-3">Lire l'article →</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200 flex gap-4 text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-500">Accueil</Link>
          <Link href="/about" className="hover:text-sky-500">À propos</Link>
          <Link href="/contact" className="hover:text-sky-500">Contact</Link>
          <Link href="/privacy" className="hover:text-sky-500">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}