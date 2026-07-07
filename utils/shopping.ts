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

export function getPurchaseLineTotal(
  item: ShoppingItem,
  purchase: ActualPurchase | undefined,
  deals: DealOffer[] = [],
): number | null {
  const unitPrice = getEffectiveUnitPrice(purchase, deals);
  if (unitPrice == null) return null;
  return unitPrice * parseShoppingQuantity(item.quantity);
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
