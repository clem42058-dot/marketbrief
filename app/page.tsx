"use client";
import { useEffect, useState, useCallback } from "react";

const SECTOR_LABELS: Record<string, string> = {
  tech: "Tech", finance: "Marchés", crypto: "Crypto",
  energy: "Énergie", macro: "Macro", company: "Entreprises",
};

const KEYWORDS: Record<string, string> = {
  bitcoin: "crypto", crypto: "crypto", ethereum: "crypto", btc: "crypto", eth: "crypto",
  nvidia: "tech", apple: "tech", tesla: "tech", microsoft: "tech", google: "tech", meta: "tech", amazon: "tech",
  fed: "macro", "federal reserve": "macro", inflation: "macro", gdp: "macro", recession: "macro", "interest rate": "macro",
  oil: "energy", opec: "energy", brent: "energy", gas: "energy",
  earnings: "company", merger: "company", acquisition: "company", ipo: "company", dividend: "company",
  nasdaq: "finance", "s&p": "finance", dow: "finance", stock: "finance", bond: "finance", yield: "finance",
};

function getSector(text: string): string {
  const lower = text.toLowerCase();
  for (const [kw, sector] of Object.entries(KEYWORDS)) {
    if (lower.includes(kw)) return sector;
  }
  return "macro";
}

function getImpact(text: string): { icon: string; label: string; bg: string; text: string } {
  const lower = text.toLowerCase();
  const pos = ["surges","jumps","rises","gains","beats","record","growth","rally","soars","climbs","rebounds","higher","profit","strong"];
  const neg = ["falls","drops","slumps","loses","misses","crash","recession","fears","decline","lower","loss","weak","cut","warns","crisis"];
  if (pos.some(w => lower.includes(w))) return { icon: "📈", label: "Positif", bg: "bg-emerald-50", text: "text-emerald-700" };
  if (neg.some(w => lower.includes(w))) return { icon: "📉", label: "Négatif", bg: "bg-red-50", text: "text-red-600" };
  return { icon: "⚖️", label: "Neutre", bg: "bg-slate-100", text: "text-slate-500" };
}

function getImportance(text: string): { level: 0 | 1 | 2; label: string; icon: string; bg: string; text: string } {
  const lower = text.toLowerCase();
  const breaking = ["breaking","fed","federal reserve","crash","crisis","emergency","urgent","collapse","rate decision"];
  const important = ["inflation","earnings","record","ipo","merger","acquisition","gdp","jobs","bitcoin","nvidia","apple","tesla"];
  if (breaking.some(w => lower.includes(w))) return { level: 2, label: "Breaking", icon: "🔥", bg: "bg-red-500", text: "text-white" };
  if (important.some(w => lower.includes(w))) return { level: 1, label: "Important", icon: "📊", bg: "bg-amber-400", text: "text-white" };
  return { level: 0, label: "Normal", icon: "📰", bg: "bg-slate-200", text: "text-slate-600" };
}

interface Article { title: string; description: string; url: string; source: { name: string }; publishedAt: string; }
interface NewsItem {
  title: string; summary: string; url: string; source: string;
  sector: string; impact: ReturnType<typeof getImpact>;
  importance: ReturnType<typeof getImportance>; time: string; minutesAgo: number;
}
type Tab = "home" | "markets" | "favorites";

const FAVS = ["NVDA", "AAPL", "TSLA", "BTC", "ETH"];
const FAV_KEYWORDS: Record<string, string[]> = {
  NVDA: ["nvidia"], AAPL: ["apple"], TSLA: ["tesla"],
  BTC: ["bitcoin", "btc"], ETH: ["ethereum", "eth"],
};

const MARKETS = [
  { name: "S&P 500", sub: "US", val: 5248.39, prev: 5226.00 },
  { name: "NASDAQ", sub: "US Tech", val: 16421.80, prev: 16278.00 },
  { name: "CAC 40", sub: "France", val: 7912.55, prev: 7929.00 },
  { name: "DAX", sub: "Allemagne", val: 18134.20, prev: 18078.00 },
];
const CRYPTOS = [
  { name: "Bitcoin", sub: "BTC", val: 95140, prev: 93100, unit: "$" },
  { name: "Ethereum", sub: "ETH", val: 3182, prev: 3200, unit: "$" },
  { name: "Solana", sub: "SOL", val: 172, prev: 168, unit: "$" },
];

function Spark({ up }: { up: boolean }) {
  const color = up ? "#16a34a" : "#dc2626";
  const points = up
    ? "0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,4 64,2"
    : "0,2 8,6 16,4 24,8 32,6 40,12 48,10 56,14 64,18";
  return (
    <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [activeFav, setActiveFav] = useState("NVDA");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [lastUpdateDisplay, setLastUpdateDisplay] = useState("");
  const [isPremium] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [notifSent, setNotifSent] = useState(false);

  useEffect(() => {
    if (!lastUpdate) return;
    const tick = () => {
      const mins = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
      if (mins < 1) setLastUpdateDisplay("à l'instant");
      else if (mins < 60) setLastUpdateDisplay(`il y a ${mins} min`);
      else setLastUpdateDisplay(`il y a ${Math.floor(mins / 60)}h`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [lastUpdate]);

  useEffect(() => {
    if (notifSent) return;
    const timer = setTimeout(() => {
      if ("Notification" in window) {
        Notification.requestPermission().then(perm => {
          if (perm === "granted") {
            new Notification("MarketBrief 📊", {
              body: "3 informations importantes peuvent impacter les marchés aujourd'hui.",
              icon: "/favicon.ico",
            });
          }
        });
      }
      setNotifSent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifSent]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      const raw: NewsItem[] = (data.articles || [])
        .filter((a: Article) => a.title && a.description && !a.title.includes("[Removed]"))
        .slice(0, isPremium ? 15 : 10)
        .map((a: Article) => {
          const text = a.title + " " + (a.description || "");
          const mins = Math.floor((Date.now() - new Date(a.publishedAt).getTime()) / 60000);
          const time = mins < 60 ? `${mins}min` : `${Math.floor(mins / 60)}h`;
          return {
            title: a.title,
            summary: (a.description || "").slice(0, 140) + "…",
            url: a.url,
            source: a.source.name,
            sector: getSector(text),
            impact: getImpact(text),
            importance: getImportance(text),
            time,
            minutesAgo: mins,
          };
        });
      raw.sort((a, b) => b.importance.level - a.importance.level);
      setNews(raw);
      setLastUpdate(new Date());
   } catch (error) {
    console.error("Erreur fetch:", error);
    setNews([]);
    }
    setLoading(false);
    setRefreshing(false);
    if (!isPremium) setShowAd(s => !s);
  }, [isPremium]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const favNews = news.filter(n =>
    FAV_KEYWORDS[activeFav]?.some(kw => (n.title + n.summary).toLowerCase().includes(kw))
  );
  const breakingCount = news.filter(n => n.importance.level === 2).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-start justify-center py-0 sm:py-6 px-0 sm:px-2">
      <div className="w-full max-w-sm bg-white sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col" style={{ minHeight: "100svh" }}>

        <div className="bg-slate-900 px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight leading-none">
                Market<span className="text-sky-400">Brief</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button onClick={fetchNews} disabled={false}
                className="flex items-center gap-1.5 text-slate-300 text-xs border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 active:scale-95 transition disabled:opacity-50">
                <span className={refreshing ? "animate-spin inline-block" : "inline-block"}>↻</span>
                <span>{refreshing ? "Chargement…" : "Refresh"}</span>
              </button>
              {lastUpdateDisplay && (
                <span className="text-slate-600 text-[10px]">Mise à jour {lastUpdateDisplay}</span>
              )}
            </div>
          </div>
          {breakingCount > 0 && (
            <div className="mt-2 flex items-center gap-2 bg-red-900/40 border border-red-700/50 rounded-xl px-3 py-1.5">
              <span className="text-sm">🔥</span>
              <span className="text-red-300 text-xs font-medium">{breakingCount} Breaking News aujourd'hui</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900 flex border-b border-slate-800 flex-shrink-0">
          {(["home", "markets", "favorites"] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setSelected(null); }}
              className={`flex-1 py-2.5 text-xs font-medium transition border-b-2 ${tab === t ? "text-sky-400 border-sky-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
              {t === "home" ? "Accueil" : t === "markets" ? "Marchés" : "Favoris"}
            </button>
          ))}
        </div>

        {showAd && !isPremium && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-xs text-center shadow-2xl">
              <p className="text-xs text-slate-400 mb-1">Publicité</p>
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 mb-3">
                <p className="text-white font-bold text-lg">Trade smarter</p>
                <p className="text-sky-100 text-xs mt-1">Ouvrez un compte démo gratuit</p>
              </div>
              <button onClick={() => setShowAd(false)} className="bg-slate-900 text-white text-sm px-6 py-2 rounded-full w-full mb-2">Fermer</button>
              <p className="text-xs text-sky-500 cursor-pointer" onClick={() => setShowAd(false)}>Passer à Premium pour supprimer les pubs →</p>
            </div>
          </div>
        )}

        {tab === "home" && (
          <div className="flex-1 bg-slate-50 overflow-y-auto">
            {selected ? (
              <div className="bg-white p-4">
                <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sky-500 text-sm mb-4">← Retour</button>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selected.importance.bg} ${selected.importance.text}`}>
                    {selected.importance.icon} {selected.importance.label}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{SECTOR_LABELS[selected.sector] || "Macro"}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selected.impact.bg} ${selected.impact.text}`}>
                    {selected.impact.icon} {selected.impact.label}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 leading-snug mb-3">{selected.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{selected.summary}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-5">
                  <span className="font-medium text-slate-600">{selected.source}</span>
                  <span>·</span>
                  <span>Publié il y a {selected.time}</span>
                </div>
                <a href={selected.url} target="_blank" rel="noopener noreferrer"
                  className="block text-center bg-sky-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-sky-600 transition shadow-sm">
                  Lire l'article complet →
                </a>
              </div>
            ) : loading ? (
              <div className="flex flex-col gap-2.5 p-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 animate-pulse border border-slate-100">
                    <div className="flex gap-2 mb-2.5"><div className="h-5 w-20 bg-slate-200 rounded-full"></div><div className="h-5 w-14 bg-slate-100 rounded-full"></div></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-1.5"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6 mb-2.5"></div>
                    <div className="flex justify-between"><div className="h-3 w-16 bg-slate-100 rounded-full"></div><div className="h-3 w-20 bg-slate-100 rounded-full"></div></div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <span className="text-4xl mb-3">📡</span>
                <p className="text-slate-600 font-medium mb-1">Impossible de charger les news</p>
                <p className="text-slate-400 text-sm mb-4">Vérifie ta connexion internet</p>
                <button onClick={fetchNews} className="bg-sky-500 text-white px-5 py-2 rounded-full text-sm">Réessayer</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {news.map((n, i) => (
                  <div key={i} onClick={() => setSelected(n)}
                    className={`bg-white rounded-xl border p-3 cursor-pointer hover:shadow-md active:scale-95 transition-all ${n.importance.level === 2 ? "border-red-300 ring-1 ring-red-200" : n.importance.level === 1 ? "border-amber-200" : "border-slate-200"}`}>
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.importance.bg} ${n.importance.text}`}>
                        {n.importance.icon} {n.importance.label}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{SECTOR_LABELS[n.sector] || "Macro"}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug mb-1.5 line-clamp-2">{n.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2 line-clamp-2">{n.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${n.impact.bg} ${n.impact.text}`}>
                        {n.impact.icon} {n.impact.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{n.source} · {n.time}</span>
                    </div>
                  </div>
                ))}
                {!isPremium && (
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3 text-center mt-1">
                    <p className="text-xs text-sky-700 font-medium mb-1">✨ Passe à Premium</p>
                    <p className="text-xs text-sky-500">+5 news · Sans pub · 2,99€/mois</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "markets" && (
          <div className="flex-1 bg-slate-50 overflow-y-auto p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2 mt-1">Indices boursiers</p>
            <div className="flex flex-col gap-2 mb-4">
              {MARKETS.map((m, i) => {
                const chg = ((m.val - m.prev) / m.prev) * 100;
                const up = chg >= 0;
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-slate-800">{m.name}</p><p className="text-xs text-slate-400">{m.sub}</p></div>
                    <div className="flex items-center gap-3">
                      <Spark up={up} />
                      <div className="text-right min-w-[70px]">
                        <p className="text-sm font-bold text-slate-800">{m.val.toLocaleString("fr-FR")}</p>
                        <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>{up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">Crypto</p>
            <div className="flex flex-col gap-2">
              {CRYPTOS.map((m, i) => {
                const chg = ((m.val - m.prev) / m.prev) * 100;
                const up = chg >= 0;
                return (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-slate-800">{m.name}</p><p className="text-xs text-slate-400">{m.sub}/USD</p></div>
                    <div className="flex items-center gap-3">
                      <Spark up={up} />
                      <div className="text-right min-w-[80px]">
                        <p className="text-sm font-bold text-slate-800">{m.val.toLocaleString("fr-FR")} {m.unit}</p>
                        <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>{up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "favorites" && (
          <div className="flex-1 bg-slate-50 overflow-y-auto p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2 mt-1">Mes actifs suivis</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {FAVS.map(f => (
                <button key={f} onClick={() => setActiveFav(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition active:scale-95 ${activeFav === f ? "bg-sky-500 text-white border-sky-500 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}>
                  {f}
                </button>
              ))}
            </div>
            {loading ? (
              <p className="text-center text-slate-400 text-xs py-10">Chargement…</p>
            ) : favNews.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="text-slate-500 text-sm font-medium">Aucune news pour {activeFav}</p>
                <p className="text-slate-400 text-xs mt-1">Essaie de rafraîchir</p>
              </div>
            ) : favNews.map((n, i) => (
              <div key={i} onClick={() => { setSelected(n); setTab("home"); }}
                className="bg-white rounded-xl border border-slate-200 p-3 mb-2 cursor-pointer hover:border-slate-400 active:scale-95 transition-all">
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.importance.bg} ${n.importance.text}`}>{n.importance.icon} {n.importance.label}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{SECTOR_LABELS[n.sector]}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug mb-1.5 line-clamp-2">{n.title}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${n.impact.text}`}>{n.impact.icon} {n.impact.label}</span>
                  <span className="text-xs text-slate-400">{n.source} · {n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPremium && (
          <div className="bg-slate-100 border-t border-slate-200 px-3 py-2 flex items-center justify-between flex-shrink-0">
            <span className="text-slate-400 text-[10px]">Pub</span>
            <span className="text-xs text-slate-500 font-medium">📣 Ouvrez un compte trading gratuit</span>
            <span className="text-sky-500 text-[10px] cursor-pointer">✕</span>
          </div>
        )}

        <div className="bg-white border-t border-slate-200 flex py-2 flex-shrink-0">
          {([
            { id: "home" as Tab, label: "Accueil", svgPath: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></> },
            { id: "markets" as Tab, label: "Marchés", svgPath: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></> },
            { id: "favorites" as Tab, label: "Favoris", svgPath: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
          ]).map(({ id, label, svgPath }) => (
            <button key={id} onClick={() => { setTab(id); setSelected(null); }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition active:scale-95 ${tab === id ? "text-sky-500" : "text-slate-400"}`}>
              <svg width="20" height="20" fill={id === "favorites" && tab === id ? "#0ea5e9" : "none"} viewBox="0 0 24 24" stroke={tab === id ? "#0ea5e9" : "#94a3b8"} strokeWidth="2">
                {svgPath}
              </svg>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}