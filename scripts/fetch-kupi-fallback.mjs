/**
 * Fallback scraper for kupi.cz to find items not available in Potravinka.cz.
 * Scrapes the public kupi.cz search page for discounted items.
 *
 * Usage: node scripts/fetch-kupi-fallback.mjs
 *
 * This script searches kupi.cz for items that are missing from the main
 * Potravinka.cz script and merges results into data/deals.ts.
 */

const ALLOWED_STORES_LOWER = ['albert', 'penny', 'kaufland', 'lidl', 'tesco'];

const MISSING_ITEMS = [
  { category: 'ZELENINA', name: 'Cibule', queries: ['cibule'] },
  { category: 'POLOTOVARY', name: 'Čaj Jemča Flip', queries: ['jemča', 'čaj flip'] },
  { category: 'SLADKÉ', name: 'Sušenka tatranky', queries: ['tatranky'] },
  { category: 'KOŘENÍ', name: 'Mletá paprika', queries: ['paprika mletá'] },
  { category: 'HYGIENA', name: 'Drátěnky', queries: ['drátěnka', 'houbička na nádobí'] },
];

function normalizeStore(shop) {
  const lower = shop.toLowerCase().trim();
  if (lower.includes('lidl')) return 'LIDL';
  if (lower.includes('penny')) return 'Penny';
  if (lower.includes('kaufland')) return 'Kaufland';
  if (lower.includes('albert')) return 'Albert';
  if (lower.includes('tesco')) return 'Tesco';
  return null;
}

function isAllowedStore(shop) {
  const lower = shop.toLowerCase().trim();
  return ALLOWED_STORES_LOWER.some((s) => lower.includes(s));
}

async function searchKupi(query) {
  const url = `https://www.kupi.cz/slevy?hledat=${encodeURIComponent(query)}&vse=0`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'JidelnicekIO/1.0 (price-comparison-tool)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) {
      console.error(`  kupi.cz error for "${query}": ${res.status}`);
      return [];
    }
    const html = await res.text();
    return parseKupiResults(html);
  } catch (err) {
    console.error(`  kupi.cz fetch error for "${query}": ${err.message}`);
    return [];
  }
}

function parseKupiResults(html) {
  const results = [];

  // Parse JSON-LD product offers from the page
  const jsonLdPattern = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdPattern.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type'] === 'Product' && data.offers) {
        const offers = data.offers.offers || [data.offers];
        for (const offer of offers) {
          if (offer.offeredBy && offer.price) {
            results.push({
              product: data.name || '',
              shop: offer.offeredBy,
              price: parseFloat(offer.price),
              validUntil: offer.priceValidUntil || null,
            });
          }
        }
      }
    } catch { /* ignore parse errors */ }
  }

  // Fallback: parse product cards from HTML
  if (results.length === 0) {
    const cardPattern = /<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    const namePattern = /class="[^"]*product[_-]?name[^"]*"[^>]*>([^<]+)/i;
    const pricePattern = /(\d+[.,]?\d*)\s*Kč/;
    const shopPattern = /class="[^"]*shop[_-]?name[^"]*"[^>]*>([^<]+)/i;

    let cardMatch;
    while ((cardMatch = cardPattern.exec(html)) !== null) {
      const card = cardMatch[0];
      const nameM = namePattern.exec(card);
      const priceM = pricePattern.exec(card);
      const shopM = shopPattern.exec(card);
      if (nameM && priceM && shopM) {
        results.push({
          product: nameM[1].trim(),
          shop: shopM[1].trim(),
          price: parseFloat(priceM[1].replace(',', '.')),
          validUntil: null,
        });
      }
    }
  }

  return results;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Fallback: fetching from kupi.cz for missing items...');
  console.log('---');

  const found = {};

  for (const item of MISSING_ITEMS) {
    const key = `${item.category}::${item.name}`;
    process.stdout.write(`Searching kupi.cz: ${key}...`);

    let allResults = [];
    for (const query of item.queries) {
      const results = await searchKupi(query);
      allResults.push(...results);
      await sleep(1000);
    }

    const filtered = allResults
      .filter((r) => isAllowedStore(r.shop))
      .filter((r) => r.price > 0)
      .sort((a, b) => a.price - b.price);

    if (filtered.length === 0) {
      console.log(' ❌ nenalezeno');
      continue;
    }

    const seen = new Set();
    const bestOffers = [];
    for (const r of filtered) {
      const store = normalizeStore(r.shop);
      if (!store || seen.has(store)) continue;
      seen.add(store);
      bestOffers.push({ ...r, shop: store });
      if (bestOffers.length >= 3) break;
    }

    if (bestOffers.length > 0) {
      found[key] = bestOffers;
      console.log(` ✅ ${bestOffers[0].price} Kč @ ${bestOffers[0].shop}`);
    } else {
      console.log(' ❌ žádný povolený obchod');
    }
  }

  console.log('---');
  console.log(`Nalezeno přes kupi.cz: ${Object.keys(found).length}/${MISSING_ITEMS.length}`);

  if (Object.keys(found).length === 0) {
    console.log('Žádné nové položky k přidání.');
    return;
  }

  // Read existing deals.ts and merge
  const fs = await import('node:fs');
  const path = await import('node:path');
  const dealsPath = path.join(import.meta.dirname, '..', 'data', 'deals.ts');
  let content = fs.readFileSync(dealsPath, 'utf-8');

  for (const [key, offers] of Object.entries(found)) {
    const now = new Date();
    const fromStr = now.toISOString().slice(0, 10);
    const toDate = new Date(now.getTime() + 7 * 86400000);
    const toStr = toDate.toISOString().slice(0, 10);

    const dealLines = offers.map((o) => {
      const priceStr = `${o.price.toFixed(2).replace('.', ',')} Kč`;
      const validNote = o.validUntil ? `Platí do ${o.validUntil}` : 'Akční cena (kupi.cz)';
      return `    { shop: "${o.shop}", validFrom: "${fromStr}", validTo: "${toStr}", product: "${o.product.replace(/"/g, '\\"')}", packaging: "1 ks", price: "${priceStr}", note: "${validNote}" },`;
    });

    const block = `  "${key}": [\n${dealLines.join('\n')}\n  ],`;

    // Check if key already exists
    if (content.includes(`"${key}"`)) {
      console.log(`  Přeskakuji ${key} (již existuje v deals.ts)`);
    } else {
      // Insert before the closing };
      content = content.replace(/^};$/m, `${block}\n};`);
      console.log(`  ✅ Přidáno: ${key}`);
    }
  }

  fs.writeFileSync(dealsPath, content, 'utf-8');
  console.log(`\n✅ Aktualizováno ${dealsPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
