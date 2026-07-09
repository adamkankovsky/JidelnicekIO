import { Text, View } from 'react-native';

import type { IngredientCategory } from '@/data/types';
import { DEAL_OFFERS } from '@/data/deals';
import { ShoppingItemRow } from '@/components/ShoppingItemRow';
import { useShopping } from '@/context/ShoppingContext';
import { getShoppingItemKey } from '@/utils/shopping';

interface ShoppingCategoryProps {
  category: IngredientCategory;
  hidePurchased: boolean;
  shopFilter: string[];
  periodFilter: { from: string; to: string } | null;
}

function itemHasMatchingDeal(
  category: string,
  itemName: string,
  shopFilter: string[],
  periodFilter: { from: string; to: string } | null,
): boolean {
  const key = `${category}::${itemName}`;
  const deals = DEAL_OFFERS[key] ?? [];
  if (deals.length === 0) return false;
  return deals.some((d) => {
    if (shopFilter.length > 0 && !shopFilter.includes(d.shop)) return false;
    if (periodFilter && (d.validFrom !== periodFilter.from || d.validTo !== periodFilter.to)) return false;
    return true;
  });
}

export function ShoppingCategory({ category, hidePurchased, shopFilter, periodFilter }: ShoppingCategoryProps) {
  const { isChecked } = useShopping();

  const visibleItems = category.items.filter((item) => {
    if (hidePurchased && isChecked(getShoppingItemKey(category.category, item))) return false;
    return true;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  const hasFilter = shopFilter.length > 0 || periodFilter !== null;
  const matchingCount = hasFilter
    ? visibleItems.filter((item) => itemHasMatchingDeal(category.category, item.name, shopFilter, periodFilter)).length
    : 0;

  const purchasedInCategory = category.items.filter((item) =>
    isChecked(getShoppingItemKey(category.category, item)),
  ).length;

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-camp-accent">
      <View className="flex-row items-center justify-between bg-camp-primary px-4 py-3">
        <Text className="text-sm font-bold uppercase tracking-wide text-white">{category.category}</Text>
        <View className="flex-row items-center gap-2">
          {hasFilter && matchingCount > 0 ? (
            <Text className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {matchingCount} akce
            </Text>
          ) : null}
          <Text className="text-xs text-camp-accent">
            {purchasedInCategory}/{category.items.length}
          </Text>
        </View>
      </View>
      {visibleItems.map((item) => (
        <ShoppingItemRow
          key={getShoppingItemKey(category.category, item)}
          category={category.category}
          item={item}
          shopFilter={shopFilter}
          periodFilter={periodFilter}
        />
      ))}
    </View>
  );
}
