/**
 * Fetches current grocery prices from Potravinka.cz API
 * and generates an updated data/deals.ts file.
 *
 * Usage: node scripts/fetch-potravinka-deals.mjs
 *
 * Only includes results from: Albert, Penny, Kaufland, LIDL, Tesco
 * Only includes products valid in the current period.
 */

const ALLOWED_STORES = ['Albert', 'Penny', 'Kaufland', 'LIDL', 'Tesco'];
const API_BASE = 'https://potravinka.cz/api/search/smart';

const SEARCH_QUERIES = [
  { category: 'ZELENINA', name: 'Ředkvičky', query: 'ředkvičky', mustMatch: /ředkv/i },
  { category: 'ZELENINA', name: 'Petržel', query: 'petržel kořen', mustMatch: /petržel/i, exclude: /zálivk|koření|sáč|vitana|kotányi/i, minAmount: 50 },
  { category: 'ZELENINA', name: 'Okurka', query: 'okurka hadovka', mustMatch: /okurk/i, exclude: /steril|nakl/i },
  { category: 'ZELENINA', name: 'Cibule', query: 'cibule žlutá kuchyňská', mustMatch: /cibule.*žlut|cibule.*kuchyňsk/i, exclude: /smažen|bake|chipsy|vývar|koření|vitana|kotányi|ferment|nakládan|červená|chutney|polévk|bistro|dressing/i, minAmount: 500 },
  { category: 'ZELENINA', name: 'Česnek', query: 'česnek', mustMatch: /česnek/i, exclude: /klobás|zálivk|omáčk|bake|tuc|suchar|chip|kořen/i },
  { category: 'ZELENINA', name: 'Mrkev', query: 'mrkev', mustMatch: /mrkev/i, exclude: /příkrm|sunar|kapsičk|baby|wavy|gerber|hami|kubík|šťáv|vitaminátor|simply|sušenk|dětsk|ugo|pyré/i },
  { category: 'ZELENINA', name: 'Celer', query: 'celer bulvový', mustMatch: /celer/i },
  { category: 'ZELENINA', name: 'Brambory', query: 'brambory rané', mustMatch: /brambor/i, exclude: /koření|přípravek|příkrm|sunar|avokádo/i },
  { category: 'OVOCE', name: 'Jablko', query: 'jablka červená', mustMatch: /jablk|jablíč/i, exclude: /strongbow|cider|džus|mošt|ocet|kapsičk|sunar|pyré|vitaminátor|baby|hami|sycen|voda|nápoj|příchu/i },
  { category: 'SUCHÉ', name: 'Knedlík', query: 'knedlík houskový', mustMatch: /knedlík/i },
  { category: 'SUCHÉ', name: 'Cukr', query: 'cukr krystal', mustMatch: /cukr/i, exclude: /nápoj|energy|třtinov/i },
  { category: 'SUCHÉ', name: 'Sůl', query: 'sůl jedlá', mustMatch: /\bsůl\b/i, exclude: /chip|tyčink|křupk|protein|koupel/i },
  { category: 'SUCHÉ', name: 'Polohrubá mouka', query: 'mouka polohrubá', mustMatch: /mouka/i },
  { category: 'SUCHÉ', name: 'Lupinky', query: 'cornflakes', mustMatch: /cornflakes|lupínk/i },
  { category: 'SUCHÉ', name: 'Arašidy', query: 'arašídy pražené', mustMatch: /arašíd/i, exclude: /tyčink|čokolád/i },
  { category: 'SUCHÉ', name: 'Tortilly', query: 'tortilla pšeničná', mustMatch: /tortill/i, exclude: /chip|doritos/i },
  { category: 'SUCHÉ', name: 'Chleba', query: 'chléb', mustMatch: /chl[ée]b/i, exclude: /směs|sáček|strouhank|ošatk/i },
  { category: 'SUCHÉ', name: 'Strouhanka', query: 'strouhanka', mustMatch: /strouhank/i },
  { category: 'SUCHÉ', name: 'Hladká mouka', query: 'mouka hladká', mustMatch: /mouka.*hladk|hladk.*mouka/i },
  { category: 'MASO', name: 'Vepřové mleté', query: 'vepřové mleté maso', mustMatch: /mleté.*maso|maso.*mleté/i, exclude: /koření|kotányi|maggi/i },
  { category: 'MASO', name: 'Plec', query: 'vepřová plec', mustMatch: /vepřov.*plec/i, exclude: /apetit|hotov/i },
  { category: 'MASO', name: 'Vysočina', query: 'vysočina', mustMatch: /vysočin/i },
  { category: 'MASO', name: 'Kuřecí prsa', query: 'kuřecí prsa', mustMatch: /kuřecí.*prs|kuřecí.*říz/i, exclude: /sous.?vide|kostk|marinov|pečen|smažen|špíz/i },
  { category: 'MASO', name: 'Špekáčky', query: 'špekáčky', mustMatch: /špekáč/i },
  { category: 'MASO', name: 'Šunkový salám', query: 'šunkový salám', mustMatch: /šunkový.*salám/i },
  { category: 'POLOTOVARY', name: 'Čaj Jemča Flip', query: 'čaj jemča', mustMatch: /čaj|jemča/i },
  { category: 'POLOTOVARY', name: 'Ocet', query: 'ocet lihový', mustMatch: /ocet/i },
  { category: 'POLOTOVARY', name: 'Hořčice plnotučná', query: 'hořčice plnotučná', mustMatch: /hořčice/i },
  { category: 'POLOTOVARY', name: 'Hořčice kremžská', query: 'hořčice kremžská', mustMatch: /hořčice/i },
  { category: 'POLOTOVARY', name: 'Kečup', query: 'kečup jemný', mustMatch: /kečup/i, exclude: /baget|párek/i },
  { category: 'POLOTOVARY', name: 'Sojovka', query: 'sójová omáčka', mustMatch: /sój/i },
  { category: 'POLOTOVARY', name: 'Citronka', query: 'citrónka', mustMatch: /citr[oó]nk/i, exclude: /bonbon|drops/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Smetana 12%', query: 'smetana 12', mustMatch: /smetana/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Majonéza', query: 'majonéza', mustMatch: /majonéz|tatarsk/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Jogurty malé', query: 'jogurt bílý', mustMatch: /jogurt/i, exclude: /nápoj|kefír/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Sýr Eidam', query: 'eidam', mustMatch: /eidam/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Tvaroh', query: 'tvaroh polotučný', mustMatch: /tvaroh/i, exclude: /kapsičk|tvaroháč|lipán/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Pomazánkové', query: 'pomazánkové', mustMatch: /pomazánkov/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Mléko', query: 'mléko trvanlivé', mustMatch: /mléko/i, exclude: /kojeneck|kefír|opalov|sun|nivea|astrid|dětsk|kokosov/i },
  { category: 'MLÉČNÉ / VEJCE', name: 'Vejce', query: 'vejce', mustMatch: /vejce/i, exclude: /kelímek|víčk|polévk|už jen|vaječn/i },
  { category: 'STERILIZOVANÉ', name: 'Okurky', query: 'okurky sterilované', mustMatch: /okurk/i, exclude: /salát|hadov/i },
  { category: 'STERILIZOVANÉ', name: 'Protlak', query: 'rajčatový protlak', mustMatch: /protlak/i },
  { category: 'STERILIZOVANÉ', name: 'Kukuřice', query: 'kukuřice sladká konzerva', mustMatch: /kukuřic/i },
  { category: 'STERILIZOVANÉ', name: 'Hrášek', query: 'hrášek', mustMatch: /hrášek/i },
  { category: 'SLADKÉ', name: 'Granko', query: 'granko', mustMatch: /granko/i, exclude: /krupičk|mléčná|pro.?teen|banana|banán|méně cukr/i },
  { category: 'SLADKÉ', name: 'Perník', query: 'perník', mustMatch: /perník/i },
  { category: 'SLADKÉ', name: 'Sušenka tatranky', query: 'tatranky oplatky', mustMatch: /tatrank/i },
  { category: 'SLADKÉ', name: 'Nutella 600g', query: 'nutella', mustMatch: /nutella/i, exclude: /b-ready|biscuit|go!|mražen|zmrzlin|krém/i },
  { category: 'SLADKÉ', name: 'Marmeláda', query: 'džem jahodový', mustMatch: /džem|marmelád|zavařenin/i },
  { category: 'KOŘENÍ', name: 'Mletá paprika', query: 'paprika mletá', mustMatch: /paprik.*mlet/i },
  { category: 'KOŘENÍ', name: 'Kmín mletý', query: 'kmín mletý', mustMatch: /kmín/i },
  { category: 'KOŘENÍ', name: 'Pepř', query: 'pepř černý', mustMatch: /pepř/i },
  { category: 'KOŘENÍ', name: 'Majoránka', query: 'majoránka koření', mustMatch: /majoránk/i },
  { category: 'KOŘENÍ', name: 'Skořice', query: 'skořice mletá', mustMatch: /skořic/i },
  { category: 'TUKY', name: 'Máslo', query: 'máslo 82', mustMatch: /^máslo|české máslo|jihočeské máslo/i, exclude: /masný|sušenk|arašíd|pomazánk/i },
  { category: 'TUKY', name: 'Rama', query: 'rama', mustMatch: /rama/i, exclude: /ramen/i },
  { category: 'TUKY', name: 'Olej', query: 'slunečnicový olej', mustMatch: /olej/i, exclude: /sprej|motor|tělový|olivov/i },
  { category: 'TUKY', name: 'Hovězí bujón', query: 'bujón', mustMatch: /bujón|masox|bujon/i },
  { category: 'OSTATNÍ', name: 'Paštika', query: 'paštika', mustMatch: /paštik/i, exclude: /kočk|pes|psy|zvíř|dog|cat|bodie|louisa/i },
  { category: 'OSTATNÍ', name: 'Vánočka', query: 'vánočka', mustMatch: /vánočk/i },
  { category: 'OBILOVINY / LUŠTĚNINY', name: 'Fazole', query: 'fazole', mustMatch: /fazole/i, exclude: /párk|hamé|hotov|konzerv.*(párk|maso)/i },
  { category: 'OBILOVINY / LUŠTĚNINY', name: 'Čočka', query: 'čočka', mustMatch: /čočka/i, exclude: /párk|hamé|hotov|polévk|vitana/i, minAmount: 200 },
  { category: 'OBILOVINY / LUŠTĚNINY', name: 'Vločky', query: 'ovesné vločky', mustMatch: /vločky/i, exclude: /protein|fit/i },
  { category: 'OBILOVINY / LUŠTĚNINY', name: 'Rýže', query: 'rýže dlouhozrnná', mustMatch: /rýže/i, exclude: /příkrm|sunar|baby|nápoj/i },
  { category: 'PEČIVO', name: 'Chleba', query: 'chléb', mustMatch: /chl[ée]b/i, exclude: /směs|sáček|strouhank|ošatk/i },
  { category: 'PEČIVO', name: 'Rohlíky', query: 'rohlík', mustMatch: /rohlík/i, exclude: /hračk|sáček|párek/i },
  { category: 'HYGIENA', name: 'Odpadové sáčky', query: 'pytle na odpad', mustMatch: /pyt|sáč.*odpad/i },
  { category: 'HYGIENA', name: 'Jar', query: 'jar', mustMatch: /\bjar\b/i, exclude: /zavařovac/i },
  { category: 'HYGIENA', name: 'Potravinová fólie', query: 'potravinová fólie', mustMatch: /fóli/i },
  { category: 'HYGIENA', name: 'Drátěnky', query: 'drátěnka na nádobí', mustMatch: /drátěnk|houbičk/i },
  { category: 'HYGIENA', name: 'Utěrky', query: 'kuchyňské utěrky papírové', mustMatch: /utěrk/i },
  { category: 'HYGIENA', name: 'Alobal', query: 'alobal', mustMatch: /alobal/i },
];

function normalizeStore(store) {
  const lower = store.toLowerCase();
  if (lower === 'lidl') return 'LIDL';
  if (lower === 'penny') return 'Penny';
  if (lower === 'kaufland') return 'Kaufland';
  if (lower === 'albert') return 'Albert';
  if (lower === 'tesco') return 'Tesco';
  return store;
}

function isAllowedStore(store) {
  const normalized = normalizeStore(store);
  return ALLOWED_STORES.includes(normalized);
}

function parseAmountGrams(amountStr) {
  if (!amountStr) return null;
  const text = amountStr.toLowerCase().trim();
  const kgMatch = text.match(/([\d.,]+)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1].replace(',', '.')) * 1000;
  const gMatch = text.match(/([\d.,]+)\s*g/);
  if (gMatch) return parseFloat(gMatch[1].replace(',', '.'));
  const lMatch = text.match(/([\d.,]+)\s*l/);
  if (lMatch) return parseFloat(lMatch[1].replace(',', '.')) * 1000;
  const mlMatch = text.match(/([\d.,]+)\s*ml/);
  if (mlMatch) return parseFloat(mlMatch[1].replace(',', '.'));
  return null;
}

function isCurrentlyValid(validUntil) {
  if (!validUntil) return true;
  // validUntil comes as "14.07." format - parse it
  const match = validUntil.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!match) return true;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const now = new Date();
  const year = now.getFullYear();
  const validDate = new Date(year, month - 1, day, 23, 59, 59);
  return now <= validDate;
}

function deriveValidityPeriod(validUntil) {
  if (!validUntil) {
    const now = new Date();
    const from = now.toISOString().slice(0, 10);
    const to14 = new Date(now.getTime() + 14 * 86400000);
    return { from, to: to14.toISOString().slice(0, 10) };
  }
  const match = validUntil.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!match) {
    const now = new Date();
    return { from: now.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
  }
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = new Date().getFullYear();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  // Estimate start as 7 days before end (typical weekly promo)
  const endDate = new Date(year, month - 1, day);
  const startDate = new Date(endDate.getTime() - 6 * 86400000);
  const from = startDate.toISOString().slice(0, 10);
  return { from, to };
}

async function fetchProducts(query, limit = 20, store = null) {
  let url = `${API_BASE}?q=${encodeURIComponent(query)}&limit=${limit}`;
  if (store) url += `&store=${encodeURIComponent(store)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  API error for "${query}"${store ? ` (${store})` : ''}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error(`  Fetch error for "${query}": ${err.message}`);
    return [];
  }
}

function passesMinAmount(product, minAmount) {
  if (!minAmount) return true;
  const grams = parseAmountGrams(product.amount);
  if (grams === null) return true; // can't determine, let it pass
  return grams >= minAmount;
}

async function fetchWithStoreFallback(query, limit, item) {
  // First try general search
  let products = await fetchProducts(query, limit);
  let filtered = products
    .filter((p) => isAllowedStore(p.store))
    .filter((p) => isCurrentlyValid(p.validUntil))
    .filter((p) => !item.mustMatch || item.mustMatch.test(p.name))
    .filter((p) => !item.exclude || !item.exclude.test(p.name))
    .filter((p) => passesMinAmount(p, item.minAmount));

  if (filtered.length > 0) return filtered;

  // Fallback: try each store individually with simpler query
  const simpleQuery = item.name.toLowerCase();
  for (const store of ALLOWED_STORES) {
    await sleep(300);
    const storeProducts = await fetchProducts(simpleQuery, 10, store);
    const storeFiltered = storeProducts
      .filter((p) => isCurrentlyValid(p.validUntil))
      .filter((p) => !item.mustMatch || item.mustMatch.test(p.name))
      .filter((p) => !item.exclude || !item.exclude.test(p.name))
      .filter((p) => passesMinAmount(p, item.minAmount));
    filtered.push(...storeFiltered);
  }

  return filtered;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Fetching prices from Potravinka.cz API...');
  console.log(`Stores: ${ALLOWED_STORES.join(', ')}`);
  console.log(`Date: ${new Date().toISOString().slice(0, 10)}`);
  console.log('---');

  const allDeals = {};
  let found = 0;
  let notFound = 0;

  for (const item of SEARCH_QUERIES) {
    const key = `${item.category}::${item.name}`;
    process.stdout.write(`Fetching: ${key} (q="${item.query}")...`);

    const filtered = (await fetchWithStoreFallback(item.query, 30, item))
      .sort((a, b) => a.price - b.price);

    if (filtered.length === 0) {
      console.log(' ❌ žádný výsledek');
      notFound++;
      await sleep(200);
      continue;
    }

    // Take top 3 cheapest from different stores
    const seen = new Set();
    const bestOffers = [];
    for (const p of filtered) {
      const store = normalizeStore(p.store);
      if (seen.has(store)) continue;
      seen.add(store);
      bestOffers.push(p);
      if (bestOffers.length >= 3) break;
    }

    const deals = bestOffers.map((p) => {
      const validity = deriveValidityPeriod(p.validUntil);
      return {
        shop: normalizeStore(p.store),
        validFrom: validity.from,
        validTo: validity.to,
        product: p.name,
        packaging: p.amount || '1 ks',
        price: `${p.price.toFixed(2).replace('.', ',')} Kč`,
        note: p.validUntil ? `Platí do ${p.validUntil}` : 'Běžná cena',
      };
    });

    allDeals[key] = deals;
    const best = bestOffers[0];
    console.log(` ✅ ${best.price} Kč @ ${normalizeStore(best.store)} (${best.amount})`);
    found++;

    await sleep(400);
  }

  console.log('---');
  console.log(`Nalezeno: ${found}/${SEARCH_QUERIES.length}, Nenalezeno: ${notFound}`);

  // Generate TypeScript output
  const tsLines = [];
  tsLines.push("import type { DealOffer } from './types';");
  tsLines.push('');
  tsLines.push('/**');
  tsLines.push(` * Auto-generated from Potravinka.cz API on ${new Date().toISOString().slice(0, 10)}.`);
  tsLines.push(' * Stores: Albert, Penny, Kaufland, LIDL, Tesco');
  tsLines.push(' * Key = "CATEGORY::ItemName"');
  tsLines.push(' */');
  tsLines.push('export const DEAL_OFFERS: Record<string, DealOffer[]> = {');

  const keys = Object.keys(allDeals).sort();
  for (const key of keys) {
    const deals = allDeals[key];
    tsLines.push(`  "${key}": [`);
    for (const deal of deals) {
      tsLines.push(
        `    { shop: "${deal.shop}", validFrom: "${deal.validFrom}", validTo: "${deal.validTo}", product: "${deal.product.replace(/"/g, '\\"')}", packaging: "${deal.packaging}", price: "${deal.price}", note: "${deal.note.replace(/"/g, '\\"')}" },`,
      );
    }
    tsLines.push('  ],');
  }

  tsLines.push('};');
  tsLines.push('');
  tsLines.push(`export const ALL_SHOPS = ${JSON.stringify(ALLOWED_STORES)};`);
  tsLines.push('');
  tsLines.push('export const PROMO_PERIODS = [');

  // Generate promo periods based on current week
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const nextMonday = new Date(sunday);
  nextMonday.setDate(sunday.getDate() + 1);
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);

  const fmt = (d) => `${d.getDate()}.${d.getMonth() + 1}.`;
  const iso = (d) => d.toISOString().slice(0, 10);

  tsLines.push(
    `  { label: "${fmt(monday)}–${fmt(sunday)}", from: "${iso(monday)}", to: "${iso(sunday)}" },`,
  );
  tsLines.push(
    `  { label: "${fmt(nextMonday)}–${fmt(nextSunday)}", from: "${iso(nextMonday)}", to: "${iso(nextSunday)}" },`,
  );
  tsLines.push('];');
  tsLines.push('');

  const output = tsLines.join('\n');

  const fs = await import('node:fs');
  const path = await import('node:path');
  const outPath = path.join(import.meta.dirname, '..', 'data', 'deals.ts');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`\n✅ Zapsáno do ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
