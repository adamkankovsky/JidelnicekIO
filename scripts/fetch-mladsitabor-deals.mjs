/**
 * Fetches current grocery prices from Potravinka.cz API
 * and generates an updated data/mladsitabor/deals.ts file.
 *
 * Usage: node scripts/fetch-mladsitabor-deals.mjs
 *
 * Only includes results from: Albert, Penny, Kaufland, LIDL, Tesco
 * Only includes products valid in the current period.
 */

const ALLOWED_STORES = ['Albert', 'Penny', 'Kaufland', 'LIDL', 'Tesco'];
const API_BASE = 'https://potravinka.cz/api/search/smart';

const SEARCH_QUERIES = [
  // MASO A UZENINY
  { category: 'MASO A UZENINY', name: 'Kuřecí prsa', query: 'kuřecí prsa', mustMatch: /kuřecí.*prs|kuřecí.*říz/i, exclude: /sous.?vide|kostk|marinov|pečen|smažen|špíz/i },
  { category: 'MASO A UZENINY', name: 'Kuřecí maso', query: 'kuřecí maso', mustMatch: /kuřecí/i, exclude: /sous.?vide|marinov|pečen|smažen/i },
  { category: 'MASO A UZENINY', name: 'Kuřecí stehno', query: 'kuřecí stehno', mustMatch: /kuřecí.*stehn/i, exclude: /marinov/i },
  { category: 'MASO A UZENINY', name: 'Mleté maso', query: 'vepřové mleté maso', mustMatch: /mleté.*maso|maso.*mleté/i, exclude: /koření|kotányi|maggi/i },
  { category: 'MASO A UZENINY', name: 'Vepřová svíčková', query: 'vepřová svíčková', mustMatch: /vepřov.*svíčk/i },
  { category: 'MASO A UZENINY', name: 'Špekáčky', query: 'špekáčky', mustMatch: /špekáč/i },
  { category: 'MASO A UZENINY', name: 'Velký párek', query: 'párky', mustMatch: /párek|párky/i, exclude: /v rohlík|hot.?dog/i },
  { category: 'MASO A UZENINY', name: 'Šunka', query: 'šunka nejvyšší jakosti', mustMatch: /šunk/i, exclude: /pizza|salát/i },
  { category: 'MASO A UZENINY', name: 'Paštika', query: 'paštika', mustMatch: /paštik/i, exclude: /kočk|pes|psy|zvíř|dog|cat/i },
  { category: 'MASO A UZENINY', name: 'Tofu', query: 'tofu', mustMatch: /tofu/i, exclude: /omáčk/i },

  // MLÉČNÉ VÝROBKY
  { category: 'MLÉČNÉ VÝROBKY', name: 'Mléko', query: 'mléko trvanlivé', mustMatch: /mléko/i, exclude: /kojeneck|kefír|opalov|sun|nivea|astrid|dětsk|kokosov/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Rostlinné mléko', query: 'rostlinné mléko ovesné', mustMatch: /mléko.*rostlin|ovesn.*nápoj|alpro|oatly/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Jogurt', query: 'jogurt bílý', mustMatch: /jogurt/i, exclude: /nápoj|kefír/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Smetana 33%', query: 'smetana ke šlehání', mustMatch: /smetana/i, exclude: /polévk/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Máslo', query: 'máslo 82', mustMatch: /^máslo|české máslo|jihočeské máslo/i, exclude: /masný|sušenk|arašíd|pomazánk/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Perla / Rama', query: 'rama', mustMatch: /rama/i, exclude: /ramen/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Sýr bloček', query: 'eidam blok', mustMatch: /eidam|sýr.*blok/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Sýr plátky', query: 'sýr plátky eidam', mustMatch: /sýr.*plát|eidam.*plát/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Tavený sýr', query: 'tavený sýr', mustMatch: /taven.*sýr/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Tvaroh', query: 'tvaroh polotučný', mustMatch: /tvaroh/i, exclude: /kapsičk|tvaroháč|lipán/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Lučina', query: 'lučina', mustMatch: /lučin/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Přesnídávky', query: 'přesnídávka', mustMatch: /přesnídáv/i },
  { category: 'MLÉČNÉ VÝROBKY', name: 'Nutella', query: 'nutella', mustMatch: /nutella/i, exclude: /b-ready|biscuit|go!|mražen|zmrzlin/i },

  // VEJCE
  { category: 'VEJCE', name: 'Vejce', query: 'vejce', mustMatch: /vejce/i, exclude: /kelímek|víčk|polévk|už jen|vaječn/i },

  // ZELENINA
  { category: 'ZELENINA', name: 'Brambory', query: 'brambory', mustMatch: /brambor/i, exclude: /koření|přípravek|příkrm|sunar|avokádo/i },
  { category: 'ZELENINA', name: 'Cibule', query: 'cibule žlutá', mustMatch: /cibule/i, exclude: /smažen|chipsy|koření|vitana|kotányi|ferment|nakládan/i, minAmount: 500 },
  { category: 'ZELENINA', name: 'Česnek', query: 'česnek', mustMatch: /česnek/i, exclude: /klobás|zálivk|omáčk|bake|tuc|suchar|chip|kořen/i },
  { category: 'ZELENINA', name: 'Mrkev', query: 'mrkev', mustMatch: /mrkev/i, exclude: /příkrm|sunar|kapsičk|baby|gerber|hami|kubík|šťáv|sušenk|dětsk/i },
  { category: 'ZELENINA', name: 'Petržel', query: 'petržel kořen', mustMatch: /petržel/i, exclude: /zálivk|koření|sáč|vitana|kotányi/i, minAmount: 50 },
  { category: 'ZELENINA', name: 'Celer', query: 'celer bulvový', mustMatch: /celer/i },
  { category: 'ZELENINA', name: 'Okurka hadovka', query: 'okurka hadovka', mustMatch: /okurk/i, exclude: /steril|nakl/i },
  { category: 'ZELENINA', name: 'Rajčata', query: 'rajčata', mustMatch: /rajč/i, exclude: /protlak|kečup|omáčk|passata/i },
  { category: 'ZELENINA', name: 'Paprika', query: 'paprika červená', mustMatch: /paprik/i, exclude: /mlet|kořen|chipsy|kotányi/i },
  { category: 'ZELENINA', name: 'Řepa vařená', query: 'řepa vařená', mustMatch: /řepa/i },
  { category: 'ZELENINA', name: 'Cuketa', query: 'cuketa', mustMatch: /cuket/i },

  // OVOCE
  { category: 'OVOCE', name: 'Jablka', query: 'jablka', mustMatch: /jablk/i, exclude: /strongbow|cider|džus|mošt|ocet|kapsičk|sunar|pyré|vitaminátor|baby|hami|sycen|voda|nápoj|příchu/i },
  { category: 'OVOCE', name: 'Banán', query: 'banány', mustMatch: /banán/i, exclude: /chips|sušen|džus/i },
  { category: 'OVOCE', name: 'Nektarinka', query: 'nektarinka', mustMatch: /nektarink/i },
  { category: 'OVOCE', name: 'Broskev', query: 'broskev', mustMatch: /broskv|broskev/i, exclude: /konzerv|kompot/i },
  { category: 'OVOCE', name: 'Meloun', query: 'meloun vodní', mustMatch: /meloun/i },
  { category: 'OVOCE', name: 'Citrón', query: 'citron', mustMatch: /citro|citrón/i, exclude: /bonbon|drops|citrónk/i },

  // PEČIVO
  { category: 'PEČIVO', name: 'Rohlík', query: 'rohlík', mustMatch: /rohlík/i, exclude: /hračk|sáček|párek/i },
  { category: 'PEČIVO', name: 'Chleba', query: 'chléb', mustMatch: /chl[ée]b/i, exclude: /směs|sáček|strouhank|ošatk/i },
  { category: 'PEČIVO', name: 'Vánočka', query: 'vánočka', mustMatch: /vánočk/i },
  { category: 'PEČIVO', name: 'Knedlík houskový', query: 'knedlík houskový', mustMatch: /knedlík/i },
  { category: 'PEČIVO', name: 'Perník', query: 'perník', mustMatch: /perník/i },

  // TRVANLIVÉ POTRAVINY
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Rýže', query: 'rýže dlouhozrnná', mustMatch: /rýže/i, exclude: /příkrm|sunar|baby|nápoj/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Těstoviny (celkem)', query: 'těstoviny penne', mustMatch: /těstovin|špaget|penne/i, exclude: /omáčk/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Ovesné vločky', query: 'ovesné vločky', mustMatch: /vločky/i, exclude: /protein|fit/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Cereálie (kuličky)', query: 'cereálie kuličky', mustMatch: /cereáli|kuličk/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Hladká mouka', query: 'mouka hladká', mustMatch: /mouka.*hladk|hladk.*mouka/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Cukr', query: 'cukr krystal', mustMatch: /cukr/i, exclude: /nápoj|energy|třtinov/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Protlak', query: 'rajčatový protlak', mustMatch: /protlak/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Kečup', query: 'kečup jemný', mustMatch: /kečup/i, exclude: /baget|párek/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Hořčice (různé)', query: 'hořčice plnotučná', mustMatch: /hořčice/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Majonéza', query: 'majonéza', mustMatch: /majonéz|tatarsk/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Med', query: 'med květový', mustMatch: /\bmed\b/i, exclude: /medvíd|medail/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Slunečnicový olej', query: 'slunečnicový olej', mustMatch: /olej/i, exclude: /sprej|motor|tělový|olivov/i },
  { category: 'TRVANLIVÉ POTRAVINY', name: 'Sádlo', query: 'sádlo vepřové', mustMatch: /sádlo/i },

  // SLADKÉ A SNACKY
  { category: 'SLADKÉ A SNACKY', name: 'Sušenka', query: 'sušenky', mustMatch: /sušenk/i, exclude: /psí|pes|dog/i },
  { category: 'SLADKÉ A SNACKY', name: 'Čokoláda', query: 'čokoláda mléčná', mustMatch: /čokolád/i, exclude: /nápoj|zmrzlin/i },
  { category: 'SLADKÉ A SNACKY', name: 'Bombóny', query: 'bonbóny', mustMatch: /bonb[oó]n|bombón/i },

  // KOŘENÍ A DOCHUCOVADLA
  { category: 'KOŘENÍ A DOCHUCOVADLA', name: 'Sůl', query: 'sůl jedlá', mustMatch: /\bsůl\b/i, exclude: /chip|tyčink|křupk|protein|koupel/i },
  { category: 'KOŘENÍ A DOCHUCOVADLA', name: 'Pepř', query: 'pepř černý mletý', mustMatch: /pepř/i },
  { category: 'KOŘENÍ A DOCHUCOVADLA', name: 'Paprika mletá', query: 'paprika mletá', mustMatch: /paprik.*mlet/i },
  { category: 'KOŘENÍ A DOCHUCOVADLA', name: 'Majoránka', query: 'majoránka', mustMatch: /majoránk/i },
  { category: 'KOŘENÍ A DOCHUCOVADLA', name: 'Skořice mletá', query: 'skořice mletá', mustMatch: /skořic/i },

  // NÁPOJE
  { category: 'NÁPOJE', name: 'Kakao', query: 'kakao', mustMatch: /kakao/i, exclude: /zmrzlin|nápoj|sušenk/i },
  { category: 'NÁPOJE', name: 'Granko', query: 'granko', mustMatch: /granko/i, exclude: /krupičk|mléčná|pro.?teen|banana|banán|méně cukr/i },
  { category: 'NÁPOJE', name: 'Kafe', query: 'káva mletá', mustMatch: /káva|kafe|coffee/i, exclude: /kapsle|nespresso|dolce/i },
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
  return ALLOWED_STORES.includes(normalizeStore(store));
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
  if (grams === null) return true;
  return grams >= minAmount;
}

async function fetchWithStoreFallback(query, limit, item) {
  let products = await fetchProducts(query, limit);
  let filtered = products
    .filter((p) => isAllowedStore(p.store))
    .filter((p) => isCurrentlyValid(p.validUntil))
    .filter((p) => !item.mustMatch || item.mustMatch.test(p.name))
    .filter((p) => !item.exclude || !item.exclude.test(p.name))
    .filter((p) => passesMinAmount(p, item.minAmount));

  if (filtered.length > 0) return filtered;

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
  console.log('Fetching prices from Potravinka.cz API (mladsitabor)...');
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
  tsLines.push("import type { DealOffer } from '../types';");
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

  tsLines.push('export const PROMO_PERIODS = [');
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
  const outPath = path.join(import.meta.dirname, '..', 'data', 'mladsitabor', 'deals.ts');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`\n✅ Zapsáno do ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
