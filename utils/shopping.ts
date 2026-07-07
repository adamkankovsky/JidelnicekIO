import type { ActualPurchase, ShoppingItem } from '@/data/types';

export function getShoppingItemKey(category: string, item: ShoppingItem): string {
  return `${category}::${item.name}`;
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

export function getPurchaseLineTotal(item: ShoppingItem, purchase: ActualPurchase | undefined): number | null {
  if (purchase?.price == null) return null;
  return purchase.price * parseShoppingQuantity(item.quantity);
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
