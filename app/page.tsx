"use client";
import { useEffect, useState, useCallback } from "react";
import OneSignal from "react-onesignal";

const TRANSLATIONS = {
  fr: {
    home: "Accueil", markets: "Marchés", favorites: "Favoris", settings: "Réglages",
    refresh: "Refresh", loading: "Chargement…", updatedAt: "Mise à jour",
    breakingNews: "Breaking News aujourd'hui",
    readMore: "Lire l'article complet →", back: "← Retour",
    publishedAgo: "Publié il y a", noNews: "Impossible de charger les news",
    checkConnection: "Vérifie ta connexion internet", retry: "Réessayer",
    noFavNews: "Aucune news pour", tryRefresh: "Essaie de rafraîchir",
    indices: "Indices boursiers", crypto: "Crypto",
    myAssets: "Mes actifs suivis", premium: "✨ Passe à Premium",
    premiumSub: "+5 news · Sans pub · 2,99€/mois",
    ad: "Pub", adText: "📣 Ouvrez un compte trading gratuit",
    privacy: "Politique de confidentialité", legal: "Mentions légales",
    settingsTitle: "Réglages", appearance: "Apparence", darkMode: "Mode sombre",
    darkModeDesc: "Interface sombre pour les yeux", language: "Langue",
    languageDesc: "Choisir la langue de l'interface",
    settingsInfo: "Les réglages sont sauvegardés automatiquement.",
    close: "Fermer", discoverPremium: "Découvrir Premium",
  },
  en: {
    home: "Home", markets: "Markets", favorites: "Favorites", settings: "Settings",
    refresh: "Refresh", loading: "Loading…", updatedAt: "Updated",
    breakingNews: "Breaking News today",
    readMore: "Read full article →", back: "← Back",
    publishedAgo: "Published", noNews: "Unable to load news",
    checkConnection: "Check your internet connection", retry: "Retry",
    noFavNews: "No news for", tryRefresh: "Try refreshing",
    indices: "Stock indices", crypto: "Crypto",
    myAssets: "My tracked assets", premium: "✨ Go Premium",
    premiumSub: "+5 news · No ads · €2.99/month",
    ad: "Ad", adText: "📣 Open a free demo trading account",
    privacy: "Privacy Policy", legal: "Terms of Use",
    settingsTitle: "Settings", appearance: "Appearance", darkMode: "Dark mode",
    darkModeDesc: "Easy on the eyes", language: "Language",
    languageDesc: "Choose interface language",
    settingsInfo: "Settings are saved automatically.",
    close: "Close", discoverPremium: "Discover Premium",
  },
};

const SECTOR_LABELS: Record<string, Record<string, string>> = {
  fr: { tech: "Tech", finance: "Marchés", crypto: "Crypto", energy: "Énergie", macro: "Macro", company: "Entreprises" },
  en: { tech: "Tech", finance: "Markets", crypto: "Crypto", energy: "Energy", macro: "Macro", company: "Companies" },
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

function getImpact(text: string): { icon: string; label: Record<string, string>; bg: string; text: string } {
  const lower = text.toLowerCase();
  const pos = ["surges","jumps","rises","gains","beats","record","growth","rally","soars","climbs","rebounds","higher","profit","strong"];
  const neg = ["falls","drops","slumps","loses","misses","crash","recession","fears","decline","lower","loss","weak","cut","warns","crisis"];
  if (pos.some(w => lower.includes(w))) return { icon: "📈", label: { fr: "Positif", en: "Positive" }, bg: "bg-emerald-50", text: "text-emerald-700" };
  if (neg.some(w => lower.includes(w))) return { icon: "📉", label: { fr: "Négatif", en: "Negative" }, bg: "bg-red-50", text: "text-red-600" };
  return { icon: "⚖️", label: { fr: "Neutre", en: "Neutral" }, bg: "bg-slate-100", text: "text-slate-500" };
}

function getImportance(text: string): { level: 0 | 1 | 2; label: Record<string, string>; icon: string; bg: string; text: string } {
  const lower = text.toLowerCase();
  const breaking = ["breaking","fed","federal reserve","crash","crisis","emergency","urgent","collapse","rate decision"];
  const important = ["inflation","earnings","record","ipo","merger","acquisition","gdp","jobs","bitcoin","nvidia","apple","tesla"];
  if (breaking.some(w => lower.includes(w))) return { level: 2, label: { fr: "Breaking", en: "Breaking" }, icon: "🔥", bg: "bg-red-500", text: "text-white" };
  if (important.some(w => lower.includes(w))) return { level: 1, label: { fr: "Important", en: "Important" }, icon: "📊", bg: "bg-amber-400", text: "text-white" };
  return { level: 0, label: { fr: "Normal", en: "Normal" }, icon: "📰", bg: "bg-slate-200", text: "text-slate-600" };
}

interface Article { title: string; description: string; url: string; source: { name: string }; publishedAt: string; }
interface NewsItem {
  title: string; summary: string; url: string; source: string;
  sector: string; impact: ReturnType<typeof getImpact>;
  importance: ReturnType<typeof getImportance>; time: string; minutesAgo: number;
}
interface MarketItem { symbol: string; price: number; prev: number; }
type Tab = "home" | "markets" | "favorites" | "settings";
type Lang = "fr" | "en";

const FAVS = ["NVDA", "AAPL", "TSLA", "BTC", "ETH"];
const FAV_KEYWORDS: Record<string, string[]> = {
  NVDA: ["nvidia"], AAPL: ["apple"], TSLA: ["tesla"],
  BTC: ["bitcoin", "btc"], ETH: ["ethereum", "eth"],
};

const SYMBOL_LABELS: Record<string, { name: string; sub: string; unit: string }> = {
  "^GSPC":   { name: "S&P 500",  sub: "US",       unit: "" },
  "^IXIC":   { name: "NASDAQ",   sub: "US Tech",   unit: "" },
  "^FCHI":   { name: "CAC 40",   sub: "France",    unit: "" },
  "^GDAXI":  { name: "DAX",      sub: "Allemagne", unit: "" },
  "BTC-USD": { name: "Bitcoin",  sub: "BTC/USD",   unit: "$" },
  "ETH-USD": { name: "Ethereum", sub: "ETH/USD",   unit: "$" },
  "SOL-USD": { name: "Solana",   sub: "SOL/USD",   unit: "$" },
};

function Spark({ up }: { up: boolean }) {
  const color = up ? "#16a34a" : "#dc2626";
  const points = up ? "0,18 8,14 16,16 24,10 32,12 40,6 48,8 56,4 64,2" : "0,2 8,6 16,4 24,8 32,6 40,12 48,10 56,14 64,18";
  return (
    <svg width="64" height="20" viewBox="0 0 64 20" fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function SettingsIcon({ active, dark }: { active: boolean; dark: boolean }) {
  const color = active ? "#0ea5e9" : dark ? "#6b7280" : "#94a3b8";
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [activeFav, setActiveFav] = useState("NVDA");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [lastUpdateDisplay, setLastUpdateDisplay] = useState("");
  const [isPremium] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");

  const t = TRANSLATIONS[lang];

  // ✅ ONESIGNAL — initialisation au démarrage
  useEffect(() => {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      notifyButton: { enable: true },
      allowLocalhostAsSecureOrigin: true,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const savedDark = localStorage.getItem("mb_dark");
    const savedLang = localStorage.getItem("mb_lang");
    if (savedDark) setDark(savedDark === "true");
    if (savedLang) setLang(savedLang as Lang);
  }, []);

  useEffect(() => { localStorage.setItem("mb_dark", String(dark)); }, [dark]);
  useEffect(() => { localStorage.setItem("mb_lang", lang); }, [lang]);

  useEffect(() => {
    if (!lastUpdate) return;
    const tick = () => {
      const mins = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
      if (mins < 1) setLastUpdateDisplay(lang === "fr" ? "à l'instant" : "just now");
      else if (mins < 60) setLastUpdateDisplay(`${lang === "fr" ? "il y a" : ""} ${mins} min${lang === "en" ? " ago" : ""}`);
      else setLastUpdateDisplay(`${Math.floor(mins / 60)}h ago`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [lastUpdate, lang]);

  const fetchMarkets = useCallback(async () => {
    setLoadingMarkets(true);
    try {
      const res = await fetch("/api/markets");
      const data = await res.json();
      setMarkets(data);
    } catch { setMarkets([]); }
    setLoadingMarkets(false);
  }, []);

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
            url: a.url, source: a.source.name,
            sector: getSector(text), impact: getImpact(text),
            importance: getImportance(text), time, minutesAgo: mins,
          };
        });
      raw.sort((a, b) => b.importance.level - a.importance.level);
      setNews(raw);
      setLastUpdate(new Date());
    } catch { setNews([]); }
    setLoading(false);
    setRefreshing(false);
    if (!isPremium) setShowAd(s => !s);
  }, [isPremium]);

  useEffect(() => { fetchNews(); fetchMarkets(); }, [fetchNews, fetchMarkets]);

  const favNews = news.filter(n => FAV_KEYWORDS[activeFav]?.some(kw => (n.title + n.summary).toLowerCase().includes(kw)));
  const breakingCount = news.filter(n => n.importance.level === 2).length;
  const indices = markets.filter(m => ["^GSPC","^IXIC","^FCHI","^GDAXI"].includes(m.symbol));
  const cryptos = markets.filter(m => ["BTC-USD","ETH-USD","SOL-USD"].includes(m.symbol));

  const bg = dark ? "bg-gray-950" : "bg-slate-50";
  const card = dark ? "bg-gray-900 border-gray-700" : "bg-white border-slate-200";
  const cardHover = dark ? "hover:border-gray-500" : "hover:border-slate-400";
  const textPrimary = dark ? "text-gray-100" : "text-slate-800";
  const textSecondary = dark ? "text-gray-400" : "text-slate-400";
  const navBg = dark ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200";

  const NAV_ITEMS = [
    {
      id: "home" as Tab, label: t.home,
      icon: (active: boolean) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#0ea5e9" : dark ? "#6b7280" : "#94a3b8"} strokeWidth="2">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      ),
    },
    {
      id: "markets" as Tab, label: t.markets,
      icon: (active: boolean) => (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#0ea5e9" : dark ? "#6b7280" : "#94a3b8"} strokeWidth="2">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
          <polyline points="16 7 22 7 22 13"/>
        </svg>
      ),
    },
    {
      id: "favorites" as Tab, label: t.favorites,
      icon: (active: boolean) => (
        <svg width="20" height="20" fill={active ? "#0ea5e9" : "none"} viewBox="0 0 24 24" stroke={active ? "#0ea5e9" : dark ? "#6b7280" : "#94a3b8"} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      id: "settings" as Tab, label: t.settings,
      icon: (active: boolean) => <SettingsIcon active={active} dark={dark} />,
    },
  ];

  return (
    <div className={`min-h-screen ${dark ? "bg-gray-950" : "bg-gradient-to-b from-slate-900 to-slate-800"} flex items-start justify-center py-0 sm:py-6 px-0 sm:px-2`}>
      <div className={`w-full max-w-sm ${dark ? "bg-gray-950" : "bg-white"} sm:rounded-3xl overflow-hidden shadow-2xl border ${dark ? "border-gray-800" : "border-slate-200"} flex flex-col`} style={{ minHeight: "100svh" }}>

        {/* HEADER */}
        <div className="bg-slate-900 px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight leading-none">
                Market<span className="text-sky-400">Brief</span>
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                {new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button onClick={() => { fetchNews(); fetchMarkets(); }}
                className="flex items-center gap-1.5 text-slate-300 text-xs border border-slate-700 bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 active:scale-95 transition">
                <span className={refreshing ? "animate-spin inline-block" : "inline-block"}>↻</span>
                <span>{refreshing ? t.loading : t.refresh}</span>
              </button>
              {lastUpdateDisplay && <span className="text-slate-600 text-[10px]">{t.updatedAt} {lastUpdateDisplay}</span>}
            </div>
          </div>
          {breakingCount > 0 && (
            <div className="mt-2 flex items-center gap-2 bg-red-900/40 border border-red-700/50 rounded-xl px-3 py-1.5">
              <span className="text-sm">🔥</span>
              <span className="text-red-300 text-xs font-medium">{breakingCount} {t.breakingNews}</span>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="bg-slate-900 flex border-b border-slate-800 flex-shrink-0">
          {NAV_ITEMS.map(({ id, label }) => (
            <button key={id} onClick={() => { setTab(id); setSelected(null); }}
              className={`flex-1 py-2.5 text-xs font-medium transition border-b-2 ${tab === id ? "text-sky-400 border-sky-400" : "text-slate-500 border-transparent hover:text-slate-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* PUB PLEIN ÉCRAN */}
        {showAd && !isPremium && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 w-full max-w-xs text-center shadow-2xl">
              <p className="text-xs text-slate-400 mb-1">{t.ad}</p>
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl p-6 mb-3">
                <p className="text-white font-bold text-lg">Trade smarter</p>
                <p className="text-sky-100 text-xs mt-1">{t.adText}</p>
              </div>
              <button onClick={() => setShowAd(false)} className="bg-slate-900 text-white text-sm px-6 py-2 rounded-full w-full mb-2">
                {t.close}
              </button>
            </div>
          </div>
        )}

        {/* HOME */}
        {tab === "home" && (
          <div className={`flex-1 ${bg} overflow-y-auto`}>
            {selected ? (
              <div className={`${dark ? "bg-gray-900" : "bg-white"} p-4`}>
                <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sky-500 text-sm mb-4">{t.back}</button>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selected.importance.bg} ${selected.importance.text}`}>{selected.importance.icon} {selected.importance.label[lang]}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${dark ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-600"}`}>{SECTOR_LABELS[lang][selected.sector] || "Macro"}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selected.impact.bg} ${selected.impact.text}`}>{selected.impact.icon} {selected.impact.label[lang]}</span>
                </div>
                <h2 className={`text-base font-semibold leading-snug mb-3 ${textPrimary}`}>{selected.title}</h2>
                <p className={`text-sm leading-relaxed mb-4 ${textSecondary}`}>{selected.summary}</p>
                <div className={`flex items-center gap-2 text-xs mb-5 ${textSecondary}`}>
                  <span className={`font-medium ${dark ? "text-gray-200" : "text-slate-600"}`}>{selected.source}</span>
                  <span>·</span>
                  <span>{t.publishedAgo} {selected.time}</span>
                </div>
                <a href={selected.url} target="_blank" rel="noopener noreferrer"
                  className="block text-center bg-sky-500 text-white text-sm font-medium py-3 rounded-xl hover:bg-sky-600 transition shadow-sm">
                  {t.readMore}
                </a>
              </div>
            ) : loading ? (
              <div className="flex flex-col gap-2.5 p-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`${card} rounded-xl p-3 animate-pulse`}>
                    <div className="flex gap-2 mb-2.5"><div className="h-5 w-20 bg-slate-200 rounded-full"></div><div className="h-5 w-14 bg-slate-100 rounded-full"></div></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-1.5"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6 mb-2.5"></div>
                  </div>
                ))}
              </div>
            ) : news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <span className="text-4xl mb-3">📡</span>
                <p className={`font-medium mb-1 ${textPrimary}`}>{t.noNews}</p>
                <p className={`text-sm mb-4 ${textSecondary}`}>{t.checkConnection}</p>
                <button onClick={fetchNews} className="bg-sky-500 text-white px-5 py-2 rounded-full text-sm">{t.retry}</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {news.map((n, i) => (
                  <div key={i} onClick={() => setSelected(n)}
                    className={`${card} rounded-xl border p-3 cursor-pointer hover:shadow-md active:scale-95 transition-all ${cardHover} ${n.importance.level === 2 ? "border-red-300 ring-1 ring-red-200" : n.importance.level === 1 ? "border-amber-200" : ""}`}>
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.importance.bg} ${n.importance.text}`}>{n.importance.icon} {n.importance.label[lang]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-gray-800 text-gray-400" : "bg-slate-100 text-slate-500"}`}>{SECTOR_LABELS[lang][n.sector] || "Macro"}</span>
                    </div>
                    <p className={`text-xs font-semibold leading-snug mb-1.5 line-clamp-2 ${textPrimary}`}>{n.title}</p>
                    <p className={`text-xs leading-relaxed mb-2 line-clamp-2 ${textSecondary}`}>{n.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${n.impact.bg} ${n.impact.text}`}>{n.impact.icon} {n.impact.label[lang]}</span>
                      <span className={`text-xs font-medium ${textSecondary}`}>{n.source} · {n.time}</span>
                    </div>
                  </div>
                ))}
                {!isPremium && (
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-3 text-center mt-1">
                    <p className="text-xs text-sky-700 font-medium mb-1">{t.premium}</p>
                    <p className="text-xs text-sky-500">{t.premiumSub}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MARCHÉS */}
        {tab === "markets" && (
          <div className={`flex-1 ${bg} overflow-y-auto p-3`}>
            <p className={`text-xs font-semibold uppercase tracking-wider px-1 mb-2 mt-1 ${textSecondary}`}>{t.indices}</p>
            <div className="flex flex-col gap-2 mb-4">
              {loadingMarkets ? [...Array(4)].map((_, i) => (
                <div key={i} className={`${card} rounded-xl p-3 animate-pulse`}>
                  <div className="flex justify-between"><div className="h-4 w-20 bg-slate-200 rounded"></div><div className="h-4 w-16 bg-slate-200 rounded"></div></div>
                </div>
              )) : indices.map((m, i) => {
                const label = SYMBOL_LABELS[m.symbol];
                const chg = m.prev ? ((m.price - m.prev) / m.prev) * 100 : 0;
                const up = chg >= 0;
                return (
                  <div key={i} className={`${card} rounded-xl border px-4 py-3 flex items-center justify-between`}>
                    <div><p className={`text-sm font-semibold ${textPrimary}`}>{label.name}</p><p className={`text-xs ${textSecondary}`}>{label.sub}</p></div>
                    <div className="flex items-center gap-3">
                      <Spark up={up} />
                      <div className="text-right min-w-[80px]">
                        <p className={`text-sm font-bold ${textPrimary}`}>{m.price?.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}</p>
                        <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>{up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wider px-1 mb-2 ${textSecondary}`}>{t.crypto}</p>
            <div className="flex flex-col gap-2">
              {loadingMarkets ? [...Array(3)].map((_, i) => (
                <div key={i} className={`${card} rounded-xl p-3 animate-pulse`}>
                  <div className="flex justify-between"><div className="h-4 w-20 bg-slate-200 rounded"></div><div className="h-4 w-16 bg-slate-200 rounded"></div></div>
                </div>
              )) : cryptos.map((m, i) => {
                const label = SYMBOL_LABELS[m.symbol];
                const chg = m.prev ? ((m.price - m.prev) / m.prev) * 100 : 0;
                const up = chg >= 0;
                return (
                  <div key={i} className={`${card} rounded-xl border px-4 py-3 flex items-center justify-between`}>
                    <div><p className={`text-sm font-semibold ${textPrimary}`}>{label.name}</p><p className={`text-xs ${textSecondary}`}>{label.sub}</p></div>
                    <div className="flex items-center gap-3">
                      <Spark up={up} />
                      <div className="text-right min-w-[90px]">
                        <p className={`text-sm font-bold ${textPrimary}`}>{m.price?.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} {label.unit}</p>
                        <p className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>{up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAVORIS */}
        {tab === "favorites" && (
          <div className={`flex-1 ${bg} overflow-y-auto p-3`}>
            <p className={`text-xs font-semibold uppercase tracking-wider px-1 mb-2 mt-1 ${textSecondary}`}>{t.myAssets}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {FAVS.map(f => (
                <button key={f} onClick={() => setActiveFav(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition active:scale-95 ${activeFav === f ? "bg-sky-500 text-white border-sky-500 shadow-sm" : `${dark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-white text-slate-600 border-slate-200"}`}`}>
                  {f}
                </button>
              ))}
            </div>
            {loading ? <p className={`text-center text-xs py-10 ${textSecondary}`}>{t.loading}</p>
            : favNews.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-3xl block mb-2">🔍</span>
                <p className={`text-sm font-medium ${textPrimary}`}>{t.noFavNews} {activeFav}</p>
                <p className={`text-xs mt-1 ${textSecondary}`}>{t.tryRefresh}</p>
              </div>
            ) : favNews.map((n, i) => (
              <div key={i} onClick={() => { setSelected(n); setTab("home"); }}
                className={`${card} rounded-xl border p-3 mb-2 cursor-pointer ${cardHover} active:scale-95 transition-all`}>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.importance.bg} ${n.importance.text}`}>{n.importance.icon} {n.importance.label[lang]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-gray-800 text-gray-400" : "bg-slate-100 text-slate-500"}`}>{SECTOR_LABELS[lang][n.sector]}</span>
                </div>
                <p className={`text-xs font-semibold leading-snug mb-1.5 line-clamp-2 ${textPrimary}`}>{n.title}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${n.impact.text}`}>{n.impact.icon} {n.impact.label[lang]}</span>
                  <span className={`text-xs ${textSecondary}`}>{n.source} · {n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RÉGLAGES */}
        {tab === "settings" && (
          <div className={`flex-1 ${bg} overflow-y-auto p-4`}>
            <p className={`text-lg font-bold mb-4 mt-1 ${textPrimary}`}>{t.settingsTitle}</p>

            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>{t.appearance}</p>
            <div className={`${card} rounded-xl border p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>🌙 {t.darkMode}</p>
                  <p className={`text-xs mt-0.5 ${textSecondary}`}>{t.darkModeDesc}</p>
                </div>
                <button onClick={() => setDark(d => !d)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${dark ? "bg-sky-500" : "bg-slate-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${dark ? "left-6" : "left-0.5"}`}></span>
                </button>
              </div>
            </div>

            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>{t.language}</p>
            <div className={`${card} rounded-xl border p-4 mb-4`}>
              <p className={`text-sm font-medium mb-3 ${textPrimary}`}>🌍 {t.languageDesc}</p>
              <div className="flex gap-2">
                {(["fr", "en"] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition active:scale-95 ${lang === l ? "bg-sky-500 text-white" : `${dark ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-600"}`}`}>
                    {l === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                  </button>
                ))}
              </div>
            </div>

            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${textSecondary}`}>Premium</p>
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-4 mb-4">
              <p className="text-white font-bold mb-1">{t.premium}</p>
              <p className="text-sky-100 text-xs mb-3">{t.premiumSub}</p>
              <button className="bg-white text-sky-600 text-sm font-bold px-4 py-2 rounded-xl w-full active:scale-95 transition">
                {t.discoverPremium}
              </button>
            </div>

            <p className={`text-xs text-center ${textSecondary}`}>{t.settingsInfo}</p>
          </div>
        )}

        {/* BANNIÈRE PUB */}
        {!isPremium && tab !== "settings" && (
          <div className={`${dark ? "bg-gray-900 border-gray-800" : "bg-slate-100 border-slate-200"} border-t px-3 py-2 flex items-center justify-between flex-shrink-0`}>
            <span className={`text-[10px] ${textSecondary}`}>{t.ad}</span>
            <span className={`text-xs font-medium ${textSecondary}`}>{t.adText}</span>
            <span className="text-sky-500 text-[10px] cursor-pointer">✕</span>
          </div>
        )}

        {/* LIEN PRIVACY */}
        <div className={`${navBg} px-4 py-2 flex justify-center gap-4 border-t flex-shrink-0`}>
          <a href="/privacy" className={`text-xs hover:text-sky-500 transition ${textSecondary}`}>{t.privacy}</a>
          <span className={textSecondary}>|</span>
          <a href="/privacy" className={`text-xs hover:text-sky-500 transition ${textSecondary}`}>{t.legal}</a>
        </div>

        {/* BOTTOM NAV */}
        <div className={`${navBg} border-t flex py-2 flex-shrink-0`}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => { setTab(id); setSelected(null); }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1 transition active:scale-95 ${tab === id ? "text-sky-500" : dark ? "text-gray-500" : "text-slate-400"}`}>
              {icon(tab === id)}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}