import { Text, View } from 'react-native';

import type { IngredientCategory } from '@/data/types';
import { DEAL_OFFERS } from '@/data/deals';
import { ShoppingItemRow } from '@/components/ShoppingItemRow';
import { useShopping } from '@/context/ShoppingContext';
import { getShoppingItemKey } from '@/utils/shopping';

interface ShoppingCategoryProps {
  category: IngredientCategory;
  hidePurchased: boolean;
  shopFilter: string | null;
  periodFilter: { from: string; to: string } | null;
}

function itemMatchesFilters(
  category: string,
  itemName: string,
  shopFilter: string | null,
  periodFilter: { from: string; to: string } | null,
): boolean {
  if (!shopFilter && !periodFilter) return true;
  const key = `${category}::${itemName}`;
  const deals = DEAL_OFFERS[key] ?? [];
  if (deals.length === 0) return !shopFilter && !periodFilter;
  return deals.some((d) => {
    if (shopFilter && d.shop !== shopFilter) return false;
    if (periodFilter && (d.validFrom !== periodFilter.from || d.validTo !== periodFilter.to)) return false;
    return true;
  });
}

export function ShoppingCategory({ category, hidePurchased, shopFilter, periodFilter }: ShoppingCategoryProps) {
  const { isChecked } = useShopping();

  const visibleItems = category.items.filter((item) => {
    if (hidePurchased && isChecked(getShoppingItemKey(category.category, item))) return false;
    if (shopFilter || periodFilter) {
      return itemMatchesFilters(category.category, item.name, shopFilter, periodFilter);
    }
    return true;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  const purchasedInCategory = category.items.filter((item) =>
    isChecked(getShoppingItemKey(category.category, item)),
  ).length;

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-camp-accent">
      <View className="flex-row items-center justify-between bg-camp-primary px-4 py-3">
        <Text className="text-sm font-bold uppercase tracking-wide text-white">{category.category}</Text>
        <Text className="text-xs text-camp-accent">
          {purchasedInCategory}/{category.items.length}
        </Text>
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
