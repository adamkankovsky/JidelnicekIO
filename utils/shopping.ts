import type { ShoppingItem } from '@/data/types';

export function getShoppingItemKey(category: string, item: ShoppingItem): string {
  return `${category}::${item.name}`;
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
