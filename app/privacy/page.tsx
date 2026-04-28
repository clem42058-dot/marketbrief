export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-slate-700">
      <h1 className="text-2xl font-bold mb-2">Politique de Confidentialité</h1>
      <p className="text-slate-400 text-sm mb-8">Dernière mise à jour : avril 2026</p>
      <p className="mb-4">MarketBrief ne collecte aucune donnée personnelle. L'application affiche des actualités financières publiques via NewsAPI.</p>
      <h2 className="font-semibold text-lg mb-2">Données collectées</h2>
      <p className="mb-4">Aucune donnée nominative n'est collectée. La langue de votre navigateur est détectée localement pour adapter l'interface.</p>
      <h2 className="font-semibold text-lg mb-2">Publicités</h2>
      <p className="mb-4">L'application affiche des publicités pour financer son fonctionnement. Ces publicités ne collectent pas vos données personnelles.</p>
      <h2 className="font-semibold text-lg mb-2">Contact</h2>
      <p>Pour toute question : <a href="mailto:contact@marketbrief.app" className="text-sky-500">contact@marketbrief.app</a></p>
    </div>
  );
}