import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDiners } from '@/context/DinersContext';
import {
  formatDailyDate,
  getDailyFreshIngredients,
  getTomorrowIso,
  type AggregatedItem,
  type DailyShoppingSection,
} from '@/utils/dailyShopping';

function ItemRow({ item }: { item: AggregatedItem }) {
  const qty =
    item.totalQuantity != null
      ? `${Number.isInteger(item.totalQuantity) ? item.totalQuantity : item.totalQuantity.toFixed(1)} ${item.unit}`.trim()
      : '';

  return (
    <View className="border-b border-camp-accent/40 bg-white px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-camp-text">{item.name}</Text>
          {item.sources.length > 0 ? (
            <Text className="mt-0.5 text-xs text-camp-muted">
              {item.sources.join(' · ')}
            </Text>
          ) : null}
        </View>
        {qty ? (
          <Text className="ml-2 text-sm font-semibold text-camp-primary">{qty}</Text>
        ) : null}
      </View>
    </View>
  );
}

function SectionBlock({ section }: { section: DailyShoppingSection }) {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-camp-accent">
      <View className="bg-camp-primary px-4 py-3">
        <Text className="text-sm font-bold uppercase tracking-wide text-white">
          {section.label}
        </Text>
      </View>
      {section.items.map((item, i) => (
        <ItemRow key={`${item.name}-${i}`} item={item} />
      ))}
    </View>
  );
}

export default function DailyShoppingScreen() {
  const { coefficient, mealDinersOverrides, overrides } = useDiners();
  const [bakeryDays, setBakeryDays] = useState<2 | 3>(2);
  const [includeBakery, setIncludeBakery] = useState(true);

  const targetDate = useMemo(() => getTomorrowIso(), []);

  const shoppingList = useMemo(
    () =>
      getDailyFreshIngredients(targetDate, bakeryDays, {
        coefficient,
        mealDinersOverrides,
        overrides,
      }),
    [targetDate, bakeryDays, coefficient, mealDinersOverrides, overrides],
  );

  const displaySections = useMemo(() => {
    if (includeBakery) return shoppingList.sections;
    return shoppingList.sections.filter((s) => s.category !== 'bakery');
  }, [shoppingList.sections, includeBakery]);

  const hasDayData = shoppingList.campDayId !== null;
  const totalItems = displaySections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-camp-primary">Denní nákup</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Čerstvé suroviny k nakoupení na zítřejší den.
        </Text>

        {/* Date header */}
        <View className="mb-5 rounded-2xl border border-camp-accent bg-white p-4">
          <Text className="text-lg font-bold text-camp-text">
            {formatDailyDate(targetDate)} {shoppingList.dayName}
          </Text>
          {hasDayData ? (
            <Text className="mt-1 text-sm text-camp-muted">
              {totalItems} položek k nakoupení
            </Text>
          ) : (
            <Text className="mt-1 text-sm text-camp-warm">
              Žádný den v jídelníčku neodpovídá zítřejšímu datu.
            </Text>
          )}
        </View>

        {/* Bakery controls */}
        {hasDayData ? (
          <View className="mb-5 rounded-2xl border border-camp-accent bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-camp-text">Pečivo</Text>
              <Pressable
                onPress={() => setIncludeBakery(!includeBakery)}
                className={`rounded-lg border px-3 py-1.5 ${
                  includeBakery
                    ? 'border-camp-primary bg-camp-primary'
                    : 'border-camp-accent bg-white'
                }`}>
                <Text
                  className={`text-sm ${
                    includeBakery ? 'font-semibold text-white' : 'text-camp-text'
                  }`}>
                  {includeBakery ? 'Nakoupit' : 'Přeskočit'}
                </Text>
              </Pressable>
            </View>

            {includeBakery ? (
              <View className="mt-3">
                <Text className="mb-2 text-xs text-camp-muted">Nakoupit pečivo na:</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setBakeryDays(2)}
                    className={`flex-1 rounded-lg border py-2 ${
                      bakeryDays === 2
                        ? 'border-camp-primary bg-camp-primary'
                        : 'border-camp-accent bg-white'
                    }`}>
                    <Text
                      className={`text-center text-sm ${
                        bakeryDays === 2 ? 'font-semibold text-white' : 'text-camp-text'
                      }`}>
                      2 dny
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setBakeryDays(3)}
                    className={`flex-1 rounded-lg border py-2 ${
                      bakeryDays === 3
                        ? 'border-camp-primary bg-camp-primary'
                        : 'border-camp-accent bg-white'
                    }`}>
                    <Text
                      className={`text-center text-sm ${
                        bakeryDays === 3 ? 'font-semibold text-white' : 'text-camp-text'
                      }`}>
                      3 dny
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Sections */}
        {displaySections.map((section) => (
          <SectionBlock key={section.category} section={section} />
        ))}

        {hasDayData && totalItems === 0 ? (
          <View className="items-center rounded-2xl border border-camp-accent bg-white p-6">
            <Text className="text-lg font-semibold text-camp-primary">
              Žádné čerstvé suroviny
            </Text>
            <Text className="mt-1 text-center text-sm text-camp-muted">
              Na zítřejší den nejsou potřeba žádné méně trvanlivé ingredience.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
