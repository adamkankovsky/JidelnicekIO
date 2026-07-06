import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ShoppingCategory } from '@/components/ShoppingCategory';
import { usePurchases } from '@/context/PurchaseContext';
import { useShopping } from '@/context/ShoppingContext';
import { ALL_SHOPS, PROMO_PERIODS } from '@/data/deals';
import { INGREDIENT_CATEGORIES } from '@/data/ingredients';
import { downloadTextFile } from '@/utils/downloadFile';
import { buildShoppingListCsv } from '@/utils/exportIngredients';

function computeEstimatedTotal(): number {
  let total = 0;
  for (const cat of INGREDIENT_CATEGORIES) {
    for (const item of cat.items) {
      total += item.shop1 ?? item.shop2 ?? 0;
    }
  }
  return total;
}

const ESTIMATED_TOTAL = computeEstimatedTotal();

export default function ShoppingScreen() {
  const {
    totalCount,
    checkedCount,
    clearAllChecked,
    hidePurchased,
    setHidePurchased,
    shopFilter,
    setShopFilter,
    periodFilter,
    setPeriodFilter,
  } = useShopping();
  const { totalSpent } = usePurchases();

  const progress = totalCount > 0 ? checkedCount / totalCount : 0;
  const remaining = totalCount - checkedCount;

  const handleDownload = () => {
    const ok = downloadTextFile('nakupni-seznam.csv', buildShoppingListCsv());
    if (!ok) {
      Alert.alert('Export', 'Stažení souboru je dostupné ve webové verzi aplikace.');
    }
  };

  const toggleShop = (shop: string) => {
    setShopFilter(shopFilter === shop ? null : shop);
  };

  const togglePeriod = (period: { from: string; to: string }) => {
    const active = periodFilter?.from === period.from && periodFilter?.to === period.to;
    setPeriodFilter(active ? null : period);
  };

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-camp-primary">Nákup surovin</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Klepněte na položku pro označení jako nakoupené. Všechny změny se ukládají lokálně v prohlížeči a mají přednost před online verzí aplikace.
        </Text>

        {/* Progress + actions */}
        <View className="mb-5 rounded-2xl border border-camp-accent bg-white p-4">
          <View className="mb-2 flex-row items-end justify-between">
            <View>
              <Text className="text-sm text-camp-muted">Nakoupeno</Text>
              <Text className="text-3xl font-bold text-camp-primary">
                {checkedCount}
                <Text className="text-lg font-semibold text-camp-muted"> / {totalCount}</Text>
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-medium text-camp-secondary">Zbývá {remaining}</Text>
            </View>
          </View>

          <View className="mt-3 flex-row justify-between rounded-xl bg-camp-accent/50 px-3 py-2">
            <View>
              <Text className="text-[10px] text-camp-muted">Odhad nákupu</Text>
              <Text className="text-base font-bold text-camp-text">{ESTIMATED_TOTAL.toLocaleString('cs-CZ')} Kč</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-camp-muted">Skutečně utraceno</Text>
              <Text className={`text-base font-bold ${totalSpent > 0 ? 'text-camp-warm' : 'text-camp-muted'}`}>
                {totalSpent > 0 ? `${Math.round(totalSpent).toLocaleString('cs-CZ')} Kč` : '—'}
              </Text>
            </View>
          </View>

          <View className="h-3 overflow-hidden rounded-full bg-camp-accent">
            <View
              className="h-full rounded-full bg-camp-primary"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={() => setHidePurchased(!hidePurchased)}
              className={`flex-1 rounded-xl py-2.5 ${hidePurchased ? 'bg-camp-primary' : 'bg-camp-accent'}`}>
              <Text
                className={`text-center text-sm font-semibold ${
                  hidePurchased ? 'text-white' : 'text-camp-primary'
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
            className="mt-3 rounded-xl bg-camp-secondary/20 py-2.5 active:opacity-70">
            <Text className="text-center text-sm font-semibold text-camp-primary">Stáhnout seznam (CSV)</Text>
          </Pressable>
        </View>

        {/* Filters */}
        <View className="mb-5 rounded-2xl border border-camp-accent bg-white p-4">
          <Text className="mb-2 text-sm font-bold text-camp-text">Filtrovat podle obchodu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              {ALL_SHOPS.map((shop) => (
                <Pressable
                  key={shop}
                  onPress={() => toggleShop(shop)}
                  className={`rounded-lg border px-3 py-1.5 ${
                    shopFilter === shop
                      ? 'border-camp-primary bg-camp-primary'
                      : 'border-camp-accent bg-white'
                  }`}>
                  <Text
                    className={`text-sm ${
                      shopFilter === shop ? 'font-semibold text-white' : 'text-camp-text'
                    }`}>
                    {shop}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text className="mb-2 text-sm font-bold text-camp-text">Filtrovat podle akčního období</Text>
          <View className="flex-row flex-wrap gap-2">
            {PROMO_PERIODS.map((p) => {
              const active = periodFilter?.from === p.from && periodFilter?.to === p.to;
              return (
                <Pressable
                  key={p.label}
                  onPress={() => togglePeriod(p)}
                  className={`rounded-lg border px-3 py-1.5 ${
                    active ? 'border-camp-primary bg-camp-primary' : 'border-camp-accent bg-white'
                  }`}>
                  <Text className={`text-sm ${active ? 'font-semibold text-white' : 'text-camp-text'}`}>
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {(shopFilter || periodFilter) ? (
            <Pressable
              onPress={() => { setShopFilter(null); setPeriodFilter(null); }}
              className="mt-3 items-center rounded-lg bg-camp-accent py-2">
              <Text className="text-sm font-semibold text-camp-primary">Zrušit filtry</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Shopping list */}
        {INGREDIENT_CATEGORIES.map((category) => (
          <ShoppingCategory
            key={category.category}
            category={category}
            hidePurchased={hidePurchased}
            shopFilter={shopFilter}
            periodFilter={periodFilter}
          />
        ))}

        {hidePurchased && checkedCount === totalCount ? (
          <View className="items-center rounded-2xl border border-camp-accent bg-white p-6">
            <Text className="text-lg font-semibold text-camp-primary">Vše nakoupeno!</Text>
            <Text className="mt-1 text-center text-sm text-camp-muted">
              Můžete vynulovat checklist pro další nákup.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
