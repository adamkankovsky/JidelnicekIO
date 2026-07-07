import type { ActualPurchase, DealOffer, ShoppingItem } from '@/data/types';

export function getShoppingItemKey(category: string, item: ShoppingItem): string {
  return `${category}::${item.name}`;
}

/** Parses Czech price strings like "9,90 Kč" or "9,90 Kč / 19,90 Kč" (returns lowest). */
export function parseCzechPrice(price: string): number | null {
  const matches = price.match(/\d+(?:[.,]\d+)?/g);
  if (!matches || matches.length === 0) return null;

  const values = matches
    .map((part) => parseFloat(part.replace(',', '.')))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? Math.min(...values) : null;
}

export function getBestDeal(deals: DealOffer[]): DealOffer | null {
  let best: { deal: DealOffer; price: number } | null = null;

  for (const deal of deals) {
    const price = parseCzechPrice(deal.price);
    if (price != null && (best === null || price < best.price)) {
      best = { deal, price };
    }
  }

  return best?.deal ?? null;
}

export function getBestDealUnitPrice(deals: DealOffer[]): number | null {
  const best = getBestDeal(deals);
  return best ? parseCzechPrice(best.price) : null;
}

/** Custom unit price if set, otherwise the best promo deal price. */
export function getEffectiveUnitPrice(
  purchase: ActualPurchase | undefined,
  deals: DealOffer[],
): number | null {
  if (purchase?.price != null) return purchase.price;
  return getBestDealUnitPrice(deals);
}

/** Parses the numeric amount from quantity strings like "17 x", "10 kg", "3,5 kg". */
export function parseShoppingQuantity(quantity: string): number {
  if (!quantity.trim()) return 1;

  const normalized = quantity.replace(',', '.');
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 1;

  const value = parseFloat(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export function parseShoppingMeasure(item: ShoppingItem): { amount: number; unit: string } {
  const amount = parseShoppingQuantity(item.quantity);
  const q = item.quantity.toLowerCase();

  if (/\bkg\b/.test(q)) return { amount, unit: 'kg' };
  if (/\bl\b/.test(q)) return { amount, unit: 'l' };
  if (/\bml\b/.test(q)) return { amount, unit: 'ml' };
  if (/\bg\b/.test(q)) return { amount, unit: 'g' };
  if (/\bks\b|\bx\b/.test(q)) return { amount, unit: 'ks' };

  const unit = item.unit?.toLowerCase().trim() || 'ks';
  return { amount, unit };
}

interface ParsedPackaging {
  amount: number;
  unit: string;
  piecesPerPack?: number;
}

/** Parses deal packaging like "500 g", "1 kg", "6×60 g", "3×150/140 g". */
export function parsePackaging(packaging: string): ParsedPackaging {
  const text = packaging.trim().toLowerCase();

  const multiMatch = text.match(/^(\d+)\s*[×x]\s*(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|ks)?/);
  if (multiMatch) {
    return {
      piecesPerPack: parseInt(multiMatch[1], 10),
      amount: parseFloat(multiMatch[2].replace(',', '.')),
      unit: multiMatch[3] || 'ks',
    };
  }

  const simpleMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|ks)/);
  if (simpleMatch) {
    return {
      amount: parseFloat(simpleMatch[1].replace(',', '.')),
      unit: simpleMatch[2],
    };
  }

  return { amount: 1, unit: 'ks' };
}

type MeasureKind = 'mass' | 'volume' | 'count';

function measureKind(unit: string): MeasureKind | null {
  if (unit === 'ks') return 'count';
  if (unit === 'g' || unit === 'kg') return 'mass';
  if (unit === 'ml' || unit === 'l') return 'volume';
  return null;
}

function toBaseAmount(amount: number, unit: string): { value: number; kind: MeasureKind } | null {
  const kind = measureKind(unit);
  if (!kind) return null;

  if (kind === 'count') return { value: amount, kind };
  if (unit === 'kg') return { value: amount * 1000, kind: 'mass' };
  if (unit === 'g') return { value: amount, kind: 'mass' };
  if (unit === 'l') return { value: amount * 1000, kind: 'volume' };
  if (unit === 'ml') return { value: amount, kind: 'volume' };

  return null;
}

function canCompareMeasures(a: MeasureKind, b: MeasureKind): boolean {
  if (a === b) return true;
  // Protlak etc.: liters in shopping list, grams in packaging (~1 g ≈ 1 ml).
  return (a === 'mass' && b === 'volume') || (a === 'volume' && b === 'mass');
}

/** How many store packages to buy for the shopping-list amount. */
export function getPackageCount(item: ShoppingItem, deal?: DealOffer | null): number {
  const needed = parseShoppingMeasure(item);
  if (!deal) return needed.amount;

  const pack = parsePackaging(deal.packaging);

  if (pack.piecesPerPack && pack.piecesPerPack > 1 && needed.unit === 'ks') {
    return Math.ceil(needed.amount / pack.piecesPerPack);
  }

  const neededBase = toBaseAmount(needed.amount, needed.unit);
  const packBase = toBaseAmount(pack.amount, pack.unit);

  if (!neededBase || !packBase) return needed.amount;

  if (neededBase.kind === 'count' && packBase.kind !== 'count') {
    return needed.amount;
  }

  if (canCompareMeasures(neededBase.kind, packBase.kind)) {
    const neededValue = neededBase.value;
    const packValue = packBase.kind === neededBase.kind ? packBase.value : packBase.value;
    return Math.max(1, Math.ceil(neededValue / packValue));
  }

  return needed.amount;
}

export function getPackageLabel(deal?: DealOffer | null): string {
  if (!deal) return 'ks';
  const pack = parsePackaging(deal.packaging);
  if (pack.piecesPerPack && pack.piecesPerPack > 1) return 'bal';
  if (pack.unit === 'ks') return 'ks';
  return 'bal';
}

export function getPurchaseLineTotal(
  item: ShoppingItem,
  purchase: ActualPurchase | undefined,
  deals: DealOffer[] = [],
): number | null {
  const unitPrice = getEffectiveUnitPrice(purchase, deals);
  if (unitPrice == null) return null;

  const bestDeal = getBestDeal(deals);

  if (purchase?.price != null) {
    return unitPrice * parseShoppingMeasure(item).amount;
  }

  return unitPrice * getPackageCount(item, bestDeal);
}

export function isUsingDealPrice(purchase: ActualPurchase | undefined, deals: DealOffer[]): boolean {
  return purchase?.price == null && getBestDealUnitPrice(deals) != null;
}

export function formatShoppingQuantity(item: ShoppingItem): string {
  if (item.quantity && item.unit) {
    return `${item.quantity} ${item.unit}`.trim();
  }
  return item.quantity || item.unit || '';
}

export function formatShoppingPrice(item: ShoppingItem): string | null {
  const parts: string[] = [];
  if (item.shop1 != null) {
    parts.push(`${item.shop1} Kč`);
  }
  if (item.shop2 != null) {
    parts.push(`Obchod 2: ${item.shop2} Kč`);
  }
  if (item.pricePerUnit) {
    parts.push(item.pricePerUnit);
  }
  return parts.length > 0 ? parts.join(' · ') : null;
}
