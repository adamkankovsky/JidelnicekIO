import { Pressable, Text, View } from 'react-native';

import type { ShoppingItem } from '@/data/types';
import { useShopping } from '@/context/ShoppingContext';
import { formatShoppingPrice, formatShoppingQuantity, getShoppingItemKey } from '@/utils/shopping';

interface ShoppingItemRowProps {
  category: string;
  item: ShoppingItem;
}

export function ShoppingItemRow({ category, item }: ShoppingItemRowProps) {
  const { isChecked, toggleItem } = useShopping();
  const key = getShoppingItemKey(category, item);
  const purchased = isChecked(key);
  const quantity = formatShoppingQuantity(item);
  const price = formatShoppingPrice(item);

  return (
    <Pressable
      onPress={() => toggleItem(key)}
      className={`flex-row items-center border-b border-camp-accent/40 px-4 py-3 active:bg-camp-accent/30 ${
        purchased ? 'bg-camp-accent/20' : 'bg-white'
      }`}>
      <View
        className={`mr-3 h-6 w-6 items-center justify-center rounded-md border-2 ${
          purchased ? 'border-camp-primary bg-camp-primary' : 'border-camp-muted bg-white'
        }`}>
        {purchased ? <Text className="text-xs font-bold text-white">✓</Text> : null}
      </View>

      <View className="flex-1">
        <Text
          className={`text-base ${purchased ? 'text-camp-muted line-through' : 'font-medium text-camp-text'}`}>
          {item.name}
        </Text>
        {quantity ? (
          <Text className={`mt-0.5 text-sm ${purchased ? 'text-camp-muted/80' : 'text-camp-secondary'}`}>
            {quantity}
          </Text>
        ) : null}
        {price ? <Text className="mt-0.5 text-xs text-camp-muted">{price}</Text> : null}
      </View>
    </Pressable>
  );
}
