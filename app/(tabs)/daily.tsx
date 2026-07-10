import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDailyShopping } from '@/context/LocalDataContext';
import {
  getAllDaysShopping,
  getMealPlanDays,
  type AggregatedItem,
  type BakerySection,
  type DailyShoppingSection,
  type DayShoppingResult,
} from '@/utils/dailyShopping';

function ItemRow({ item }: { item: AggregatedItem }) {
  const qty =
    item.totalQuantity != null
      ? `${Number.isInteger(item.totalQuantity) ? item.totalQuantity : item.totalQuantity.toFixed(1)} ${item.unit}`.trim()
      : '';

  return (
    <View className="border-b border-camp-accent/40 bg-white px-4 py-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-camp-text">{item.name}</Text>
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
    <View className="mt-2">
      <Text className="mb-1 px-1 text-xs font-bold uppercase tracking-wide text-camp-muted">
        {section.label}
      </Text>
      <View className="overflow-hidden rounded-xl border border-camp-accent/60">
        {section.items.map((item, i) => (
          <ItemRow key={`${item.name}-${i}`} item={item} />
        ))}
      </View>
    </View>
  );
}

function DayCard({
  result,
  mergedDayNames,
  bakeryDays,
  onSetBakeryDays,
}: {
  result: DayShoppingResult;
  mergedDayNames: string[];
  bakeryDays: 2 | 3;
  onSetBakeryDays: (days: 2 | 3) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const totalItems =
    result.sections.reduce((sum, s) => sum + s.items.length, 0) +
    (result.bakery?.items.length ?? 0);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-camp-accent bg-white">
      {/* Header */}
      <Pressable
        onPress={() => setCollapsed(!collapsed)}
        className="flex-row items-center justify-between bg-camp-primary/5 px-4 py-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-camp-text">
            {result.date} {result.dayName}
          </Text>
          {mergedDayNames.length > 0 ? (
            <Text className="mt-0.5 text-xs text-camp-warm">
              + {mergedDayNames.join(', ')}
            </Text>
          ) : null}
          <Text className="mt-0.5 text-xs text-camp-muted">
            {totalItems} položek
          </Text>
        </View>
        <Text className="text-lg text-camp-muted">{collapsed ? '▸' : '▾'}</Text>
      </Pressable>

      {/* Content */}
      {!collapsed ? (
        <View className="px-3 pb-3">
          {/* Bakery first */}
          {result.bakery ? (
            <BakeryBlock
              bakery={result.bakery}
              dayId={result.dayId}
              currentDays={bakeryDays}
              onSetDays={onSetBakeryDays}
            />
          ) : null}
          {/* Other perishables */}
          {result.sections.map((section) => (
            <SectionBlock key={section.category} section={section} />
          ))}
          {totalItems === 0 ? (
            <Text className="py-4 text-center text-sm text-camp-muted">
              Žádné čerstvé suroviny pro tento den.
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function BakeryBlock({
  bakery,
  dayId,
  currentDays,
  onSetDays,
}: {
  bakery: BakerySection;
  dayId: string;
  currentDays: 2 | 3;
  onSetDays: (days: 2 | 3) => void;
}) {
  return (
    <View className="mt-2">
      <View className="mb-1 flex-row items-center justify-between px-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Pečivo ({bakery.coversDates.join(' – ')})
        </Text>
        <View className="flex-row gap-1">
          <Pressable
            onPress={() => onSetDays(2)}
            className={`rounded px-2 py-0.5 ${currentDays === 2 ? 'bg-amber-600' : 'bg-amber-200'}`}>
            <Text className={`text-xs ${currentDays === 2 ? 'font-bold text-white' : 'text-amber-800'}`}>2d</Text>
          </Pressable>
          <Pressable
            onPress={() => onSetDays(3)}
            className={`rounded px-2 py-0.5 ${currentDays === 3 ? 'bg-amber-600' : 'bg-amber-200'}`}>
            <Text className={`text-xs ${currentDays === 3 ? 'font-bold text-white' : 'text-amber-800'}`}>3d</Text>
          </Pressable>
        </View>
      </View>
      <View className="overflow-hidden rounded-xl border border-amber-300 bg-amber-50">
        {bakery.items.map((item, i) => (
          <View key={`bk-${item.name}-${i}`} className="border-b border-amber-200 px-4 py-2.5">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-sm font-medium text-camp-text">{item.name}</Text>
              {item.totalQuantity != null ? (
                <Text className="ml-2 text-sm font-semibold text-amber-700">
                  {Number.isInteger(item.totalQuantity) ? item.totalQuantity : item.totalQuantity.toFixed(1)}{' '}
                  {item.unit}
                </Text>
              ) : null}
            </View>
            {item.detailedSources.length > 0 ? (
              <View className="mt-1">
                {item.detailedSources.map((src, j) => {
                  const qty = src.quantity != null
                    ? `${Number.isInteger(src.quantity) ? src.quantity : src.quantity.toFixed(1)} ${src.unit}`.trim()
                    : '';
                  return (
                    <Text key={j} className="text-xs text-camp-muted">
                      {src.dayDate} {src.mealLabel}{qty ? ` — ${qty}` : ''}
                    </Text>
                  );
                })}
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function SkippedDayCard({
  dayId,
  date,
  dayName,
  onToggleSkip,
}: {
  dayId: string;
  date: string;
  dayName: string;
  onToggleSkip: () => void;
}) {
  return (
    <View className="mb-2 overflow-hidden rounded-xl border border-dashed border-camp-accent bg-camp-accent/20">
      <View className="flex-row items-center justify-between px-4 py-2.5">
        <Text className="text-sm text-camp-muted line-through">
          {date} {dayName}
        </Text>
        <Pressable
          onPress={onToggleSkip}
          className="rounded-lg border border-camp-accent bg-white px-3 py-1">
          <Text className="text-xs text-camp-text">Obnovit</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DailyShoppingScreen() {
  const {
    dailyShopping,
    setSkippedDays,
    setSkippedBakeryDays,
    setBakeryDaysForDay,
    coefficient,
    mealDinersOverrides,
    overrides,
  } = useDailyShopping();

  const allDays = useMemo(() => getMealPlanDays(), []);

  const shoppingResults = useMemo(
    () =>
      getAllDaysShopping({
        skippedDays: dailyShopping.skippedDays,
        skippedBakeryDays: dailyShopping.skippedBakeryDays,
        bakeryDaysPerDay: dailyShopping.bakeryDaysPerDay,
        scaledConfig: { coefficient, mealDinersOverrides, overrides },
      }),
    [dailyShopping, coefficient, mealDinersOverrides, overrides],
  );

  const skippedSet = useMemo(() => new Set(dailyShopping.skippedDays), [dailyShopping.skippedDays]);
  const skippedBakerySet = useMemo(() => new Set(dailyShopping.skippedBakeryDays), [dailyShopping.skippedBakeryDays]);
  const resultByDayId = useMemo(
    () => new Map(shoppingResults.map((r) => [r.dayId, r])),
    [shoppingResults],
  );

  const toggleSkip = (dayId: string) => {
    if (skippedSet.has(dayId)) {
      setSkippedDays(dailyShopping.skippedDays.filter((d) => d !== dayId));
    } else {
      setSkippedDays([...dailyShopping.skippedDays, dayId]);
    }
  };

  const toggleBakerySkip = (dayId: string) => {
    if (skippedBakerySet.has(dayId)) {
      setSkippedBakeryDays(dailyShopping.skippedBakeryDays.filter((d) => d !== dayId));
    } else {
      setSkippedBakeryDays([...dailyShopping.skippedBakeryDays, dayId]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-camp-primary">Denní nákupy</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Čerstvé suroviny po dnech. Přeskoč položky a spojí se s předchozím.
        </Text>

        {/* Day list */}
        {allDays.map((day) => {
          const isPerishableSkipped = skippedSet.has(day.id);
          const isBakerySkipped = skippedBakerySet.has(day.id);

          // Fully skipped (both perishable and bakery)
          if (isPerishableSkipped && isBakerySkipped) {
            return (
              <SkippedDayCard
                key={day.id}
                dayId={day.id}
                date={day.date}
                dayName={day.dayName}
                onToggleSkip={() => {
                  toggleSkip(day.id);
                  toggleBakerySkip(day.id);
                }}
              />
            );
          }

          // Only perishable skipped
          if (isPerishableSkipped) {
            return (
              <View key={day.id} className="mb-2 overflow-hidden rounded-xl border border-dashed border-camp-accent bg-camp-accent/20">
                <View className="flex-row items-center justify-between px-4 py-2.5">
                  <View>
                    <Text className="text-sm text-camp-muted line-through">
                      {day.date} {day.dayName}
                    </Text>
                    <Text className="text-xs text-camp-muted">suroviny přeskočeny</Text>
                  </View>
                  <Pressable
                    onPress={() => toggleSkip(day.id)}
                    className="rounded-lg border border-camp-accent bg-white px-3 py-1">
                    <Text className="text-xs text-camp-text">Obnovit suroviny</Text>
                  </Pressable>
                </View>
              </View>
            );
          }

          const result = resultByDayId.get(day.id);
          if (!result) return null;

          const mergedDayNames = result.mergedFromDayIds.map((mid) => {
            const d = allDays.find((x) => x.id === mid);
            return d ? `${d.date} ${d.dayName}` : mid;
          });

          return (
            <View key={day.id}>
              <DayCard
                result={result}
                mergedDayNames={mergedDayNames}
                bakeryDays={dailyShopping.bakeryDaysPerDay[day.id] ?? 2}
                onSetBakeryDays={(days) => setBakeryDaysForDay(day.id, days)}
              />
              {/* Skip buttons */}
              <View className="-mt-2 mb-3 flex-row justify-end gap-2 pr-2">
                {result.bakery ? (
                  <Pressable
                    onPress={() => toggleBakerySkip(day.id)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1">
                    <Text className="text-xs text-amber-700">Přeskočit pečivo</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => toggleSkip(day.id)}
                  className="rounded-lg border border-camp-accent bg-white px-3 py-1">
                  <Text className="text-xs text-camp-muted">Přeskočit suroviny</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
