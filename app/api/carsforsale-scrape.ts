import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || !url.startsWith('https://www.facebook.com/marketplace/')) {
      return NextResponse.json({ error: 'Invalid Facebook Marketplace URL.' }, { status: 400 });
    }
    // Try direct fetch first (public listings), fallback to ScraperAPI if needed
    let res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    if (!res.ok) {
      // Try ScraperAPI if direct fetch fails
      const apiKey = process.env.SCRAPERAPI_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'Failed to fetch page and ScraperAPI key not set.' }, { status: 500 });
      }
      const scraperUrl = `https://api.scraperapi.com/?api_key=${apiKey}&ultra_premium=true&url=${encodeURIComponent(url)}`;
      res = await fetch(scraperUrl);
      if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch page. Status: ${res.status}` }, { status: 500 });
      }
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Facebook Marketplace selectors (may need adjustment)
    const title = $('h1, [data-testid="marketplace_pdp_title"]').first().text().trim();
    const price = $('[data-testid="marketplace_pdp_price"]').first().text().trim() || $('[aria-label*="Price"]').first().text().trim();
    const description = $('[data-testid="marketplace_pdp_description"]').first().text().trim() || $('[aria-label*="Description"]').first().text().trim();
    const imageEls = $('img[src*="scontent"], img[referrerpolicy]');
    const images: string[] = [];
    imageEls.each((_, el) => {
      const src = $(el).attr('src');
      if (src && !images.includes(src)) images.push(src);
    });

    // Debug: If critical fields are missing, return HTML snippet for debugging
    if (!title || !price || !images.length) {
      return NextResponse.json({
        error: 'Failed to parse vehicle info. Selectors may be outdated.',
        debug: {
          title,
          price,
          description,
          images,
          htmlSnippet: html.substring(0, 1000),
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      title,
      price,
      description,
      images,
    });
  } catch (error) {
    console.error('Facebook Marketplace scrape error:', error);
    return NextResponse.json({ error: 'Failed to scrape vehicle info.', details: String(error) }, { status: 500 });
  }
}
