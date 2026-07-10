import { Text, View } from 'react-native';

import type { DealOffer, IngredientCategory } from '@/data/types';
import { ShoppingItemRow } from '@/components/ShoppingItemRow';
import { useDeals } from '@/context/LocalDataContext';
import { useShopping } from '@/context/ShoppingContext';
import { filterDeals, getDealFilterOptions, getShoppingItemKey } from '@/utils/shopping';

interface ShoppingCategoryProps {
  category: IngredientCategory;
  hidePurchased: boolean;
  shopFilter: string[];
  periodFilter: { from: string; to: string } | null;
}

function itemHasMatchingDeal(
  dealOffers: Record<string, DealOffer[]>,
  category: string,
  itemName: string,
  shopFilter: string[],
  periodFilter: { from: string; to: string } | null,
): boolean {
  const key = `${category}::${itemName}`;
  const deals = dealOffers[key] ?? [];
  return filterDeals(deals, getDealFilterOptions(shopFilter, periodFilter)).length > 0;
}

export function ShoppingCategory({ category, hidePurchased, shopFilter, periodFilter }: ShoppingCategoryProps) {
  const { isChecked } = useShopping();
  const { dealOffers } = useDeals();

  const visibleItems = category.items.filter((item) => {
    if (hidePurchased && isChecked(getShoppingItemKey(category.category, item))) return false;
    return true;
  });

  if (visibleItems.length === 0) {
    return null;
  }

  const hasFilter = shopFilter.length > 0 || periodFilter !== null;
  const matchingCount = hasFilter
    ? visibleItems.filter((item) => itemHasMatchingDeal(dealOffers, category.category, item.name, shopFilter, periodFilter)).length
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
