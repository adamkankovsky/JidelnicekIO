import { Text, View } from 'react-native';

import type { IngredientCategory } from '@/data/types';
import { ShoppingItemRow } from '@/components/ShoppingItemRow';
import { useShopping } from '@/context/ShoppingContext';
import { getShoppingItemKey } from '@/utils/shopping';

interface ShoppingCategoryProps {
  category: IngredientCategory;
  hidePurchased: boolean;
}

export function ShoppingCategory({ category, hidePurchased }: ShoppingCategoryProps) {
  const { isChecked } = useShopping();

  const visibleItems = category.items.filter((item) => {
    if (!hidePurchased) return true;
    return !isChecked(getShoppingItemKey(category.category, item));
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
        <ShoppingItemRow key={getShoppingItemKey(category.category, item)} category={category.category} item={item} />
      ))}
    </View>
  );
}
