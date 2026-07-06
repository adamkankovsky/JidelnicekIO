import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ShoppingCategory } from '@/components/ShoppingCategory';
import { useShopping } from '@/context/ShoppingContext';
import { INGREDIENT_CATEGORIES } from '@/data/ingredients';
import { downloadTextFile } from '@/utils/downloadFile';
import { buildShoppingListCsv } from '@/utils/exportIngredients';

export default function ShoppingScreen() {
  const { isLoading, totalCount, checkedCount, clearAllChecked, hidePurchased, setHidePurchased } = useShopping();

  const progress = totalCount > 0 ? checkedCount / totalCount : 0;
  const remaining = totalCount - checkedCount;

  const handleDownload = () => {
    const ok = downloadTextFile('nakupni-seznam.csv', buildShoppingListCsv());
    if (!ok) {
      Alert.alert('Export', 'Stažení souboru je dostupné ve webové verzi aplikace.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-camp-bg">
        <Text className="text-camp-muted">Načítání seznamu…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-camp-primary">Nákup surovin</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Klepněte na položku pro označení jako nakoupené. Stav se uloží i po zavření aplikace.
        </Text>

        <View className="mb-5 rounded-2xl border border-camp-accent bg-white p-4">
          <View className="mb-2 flex-row items-end justify-between">
            <View>
              <Text className="text-sm text-camp-muted">Nakoupeno</Text>
              <Text className="text-3xl font-bold text-camp-primary">
                {checkedCount}
                <Text className="text-lg font-semibold text-camp-muted"> / {totalCount}</Text>
              </Text>
            </View>
            <Text className="text-sm font-medium text-camp-secondary">Zbývá {remaining}</Text>
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

        {INGREDIENT_CATEGORIES.map((category) => (
          <ShoppingCategory key={category.category} category={category} hidePurchased={hidePurchased} />
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
