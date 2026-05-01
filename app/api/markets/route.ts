import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const symbols = ["^GSPC", "^IXIC", "^FCHI", "^GDAXI", "BTC-USD", "ETH-USD", "SOL-USD"];
  
  try {
    const results = await Promise.all(symbols.map(async (symbol) => {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      const data = await res.json();
      const quote = data?.chart?.result?.[0];
      const price = quote?.meta?.regularMarketPrice;
      const prev = quote?.meta?.chartPreviousClose;
      return { symbol, price, prev };
    }));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}