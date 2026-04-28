import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.NEWS_API_KEY;
  const q = "stocks OR inflation OR Fed OR earnings OR crypto OR bitcoin OR NASDAQ OR GDP OR oil";

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${key}`
    );
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ articles: [] });
  }
}