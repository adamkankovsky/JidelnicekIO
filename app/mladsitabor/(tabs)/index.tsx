import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { ShoppingCategory } from '@/components/ShoppingCategory';
import { usePurchases } from '@/context/PurchaseContext';
import { useShopping } from '@/context/ShoppingContext';
import { INGREDIENT_CATEGORIES } from '@/data/mladsitabor/ingredients';
import { downloadTextFile } from '@/utils/downloadFile';
import { buildShoppingListCsvFromCategories } from '@/utils/exportIngredients';

export default function MladsitaborShoppingScreen() {
  const {
    totalCount,
    checkedCount,
    clearAllChecked,
    hidePurchased,
    setHidePurchased,
  } = useShopping();
  const { totalSpent } = usePurchases();

  const progress = totalCount > 0 ? checkedCount / totalCount : 0;
  const remaining = totalCount - checkedCount;

  const handleDownload = () => {
    const ok = downloadTextFile(
      'mladsitabor-nakupni-seznam.csv',
      buildShoppingListCsvFromCategories(INGREDIENT_CATEGORIES),
    );
    if (!ok) {
      Alert.alert('Export', 'Stažení souboru je dostupné ve webové verzi aplikace.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-purple-800">Nákup — Mladší tábor</Text>
          <Link href="/(tabs)" asChild>
            <Pressable className="rounded-lg bg-camp-accent px-3 py-1.5">
              <Text className="text-xs font-medium text-camp-primary">Hlavní tábor</Text>
            </Pressable>
          </Link>
        </View>
        <Text className="mb-4 text-sm text-camp-muted">
          29 dětí + 15 vedoucích. Klepněte na položku pro označení jako nakoupené.
        </Text>

        {/* Progress */}
        <View className="mb-5 rounded-2xl border border-purple-200 bg-white p-4">
          <View className="mb-2 flex-row items-end justify-between">
            <View>
              <Text className="text-sm text-camp-muted">Nakoupeno</Text>
              <Text className="text-3xl font-bold text-purple-700">
                {checkedCount}
                <Text className="text-lg font-semibold text-camp-muted"> / {totalCount}</Text>
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-medium text-camp-secondary">Zbývá {remaining}</Text>
              {totalSpent > 0 ? (
                <Text className="text-sm font-bold text-camp-warm">
                  Utraceno: {Math.round(totalSpent).toLocaleString('cs-CZ')} Kč
                </Text>
              ) : null}
            </View>
          </View>

          <View className="h-3 overflow-hidden rounded-full bg-purple-100">
            <View
              className="h-full rounded-full bg-purple-600"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={() => setHidePurchased(!hidePurchased)}
              className={`flex-1 rounded-xl py-2.5 ${hidePurchased ? 'bg-purple-700' : 'bg-purple-100'}`}>
              <Text
                className={`text-center text-sm font-semibold ${
                  hidePurchased ? 'text-white' : 'text-purple-700'
                }`}>
                {hidePurchased ? 'Zobrazit vše' : 'Skrýt nakoupené'}
              </Text>
            </Pressable>
            <Pressable
              onPress={clearAllChecked}
              className="flex-1 rounded-xl bg-camp-warm/20 py-2.5 active:opacity-70">
              <Text className="text-center text-sm font-semibold text-camp-warm">Vynulovat</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleDownload}
            className="mt-3 rounded-xl bg-purple-100 py-2.5 active:opacity-70">
            <Text className="text-center text-sm font-semibold text-purple-700">Stáhnout seznam (CSV)</Text>
          </Pressable>
        </View>

        {/* Shopping list */}
        {INGREDIENT_CATEGORIES.map((category) => (
          <ShoppingCategory
            key={category.category}
            category={category}
            hidePurchased={hidePurchased}
            shopFilter={[]}
            periodFilter={null}
          />
        ))}

        {hidePurchased && checkedCount === totalCount ? (
          <View className="items-center rounded-2xl border border-purple-200 bg-white p-6">
            <Text className="text-lg font-semibold text-purple-700">Vše nakoupeno!</Text>
            <Text className="mt-1 text-center text-sm text-camp-muted">
              Můžete vynulovat checklist pro další nákup.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
