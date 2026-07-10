import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDailyShopping } from '@/context/LocalDataContext';
import { MEAL_PLAN } from '@/data/mladsitabor/mealPlan';
import {
  getAllDaysShopping,
  getMealPlanDays,
  type AggregatedItem,
  type BakerySection,
  type BakeryWindowDays,
  type DailyShoppingSection,
  type DayShoppingResult,
} from '@/utils/dailyShopping';

function ItemRow({ item }: { item: AggregatedItem }) {
  const qty =
    item.totalQuantity != null
      ? `${Number.isInteger(item.totalQuantity) ? item.totalQuantity : item.totalQuantity.toFixed(1)} ${item.unit}`.trim()
      : '';

  return (
    <View className="border-b border-purple-200/60 bg-white px-4 py-2.5">
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
          <Text className="ml-2 text-sm font-semibold text-purple-700">{qty}</Text>
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
      <View className="overflow-hidden rounded-xl border border-purple-200/60">
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
  bakerySkipped,
  onSetBakeryDays,
}: {
  result: DayShoppingResult;
  mergedDayNames: string[];
  bakeryDays: BakeryWindowDays;
  bakerySkipped: boolean;
  onSetBakeryDays: (days: BakeryWindowDays) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const totalItems =
    result.sections.reduce((sum, s) => sum + s.items.length, 0) +
    (result.bakery?.items.length ?? 0);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-purple-200 bg-white">
      <Pressable
        onPress={() => setCollapsed(!collapsed)}
        className="flex-row items-center justify-between bg-purple-50 px-4 py-3">
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

      {!collapsed ? (
        <View className="px-3 pb-3">
          {result.bakery ? (
            <BakeryBlock
              bakery={result.bakery}
              currentDays={bakeryDays}
              onSetDays={onSetBakeryDays}
            />
          ) : bakerySkipped ? (
            <View className="mt-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-4 py-3">
              <Text className="text-xs text-amber-700">Pečivo přeskočeno</Text>
            </View>
          ) : null}
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
  currentDays,
  onSetDays,
}: {
  bakery: BakerySection;
  currentDays: BakeryWindowDays;
  onSetDays: (days: BakeryWindowDays) => void;
}) {
  return (
    <View className="mt-2">
      <View className="mb-1 flex-row items-center justify-between px-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-amber-700">
          Pečivo ({bakery.coversDates.join(' – ')})
        </Text>
        <View className="flex-row gap-1">
          {([1, 2, 3] as BakeryWindowDays[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => onSetDays(d)}
              className={`rounded px-2 py-0.5 ${currentDays === d ? 'bg-amber-600' : 'bg-amber-200'}`}>
              <Text className={`text-xs ${currentDays === d ? 'font-bold text-white' : 'text-amber-800'}`}>
                {d}d
              </Text>
            </Pressable>
          ))}
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
  date,
  dayName,
  perishableSkipped,
  bakerySkipped,
  onRestorePerishables,
  onRestoreBakery,
}: {
  date: string;
  dayName: string;
  perishableSkipped: boolean;
  bakerySkipped: boolean;
  onRestorePerishables: () => void;
  onRestoreBakery: () => void;
}) {
  return (
    <View className="mb-2 overflow-hidden rounded-xl border border-dashed border-purple-200 bg-purple-50/50">
      <View className="flex-row items-center justify-between px-4 py-2.5">
        <View className="flex-1">
          <Text className={`text-sm text-camp-muted ${perishableSkipped ? 'line-through' : ''}`}>
            {date} {dayName}
          </Text>
          <Text className="text-xs text-camp-muted">
            {perishableSkipped && bakerySkipped
              ? 'suroviny i pečivo přeskočeny'
              : perishableSkipped
                ? 'suroviny přeskočeny'
                : 'pečivo přeskočeno'}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {perishableSkipped ? (
            <Pressable
              onPress={onRestorePerishables}
              className="rounded-lg border border-purple-200 bg-white px-3 py-1">
              <Text className="text-xs text-camp-text">Obnovit suroviny</Text>
            </Pressable>
          ) : null}
          {bakerySkipped ? (
            <Pressable
              onPress={onRestoreBakery}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1">
              <Text className="text-xs text-amber-700">Obnovit pečivo</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function MladsitaborDailyScreen() {
  const {
    dailyShopping,
    setSkippedDays,
    setSkippedBakeryDays,
    setBakeryDaysForDay,
    coefficient,
    mealDinersOverrides,
    overrides,
  } = useDailyShopping();

  const allDays = useMemo(() => getMealPlanDays(MEAL_PLAN), []);

  const shoppingResults = useMemo(
    () =>
      getAllDaysShopping(MEAL_PLAN, {
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
        <Text className="mb-1 text-2xl font-bold text-purple-800">Denní nákupy</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Čerstvé suroviny po dnech. Přeskoč položky a spojí se s předchozím.
        </Text>

        {allDays.map((day) => {
          const isPerishableSkipped = skippedSet.has(day.id);
          const isBakerySkipped = skippedBakerySet.has(day.id);

          if (isPerishableSkipped || (isPerishableSkipped && isBakerySkipped)) {
            return (
              <SkippedDayCard
                key={day.id}
                date={day.date}
                dayName={day.dayName}
                perishableSkipped={isPerishableSkipped}
                bakerySkipped={isBakerySkipped}
                onRestorePerishables={() => toggleSkip(day.id)}
                onRestoreBakery={() => toggleBakerySkip(day.id)}
              />
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
                bakerySkipped={isBakerySkipped}
                onSetBakeryDays={(days) => setBakeryDaysForDay(day.id, days)}
              />
              <View className="-mt-2 mb-3 flex-row justify-end gap-2 pr-2">
                {isBakerySkipped ? (
                  <Pressable
                    onPress={() => toggleBakerySkip(day.id)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1">
                    <Text className="text-xs text-amber-700">Obnovit pečivo</Text>
                  </Pressable>
                ) : result.bakery ? (
                  <Pressable
                    onPress={() => toggleBakerySkip(day.id)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1">
                    <Text className="text-xs text-amber-700">Přeskočit pečivo</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => toggleSkip(day.id)}
                  className="rounded-lg border border-purple-200 bg-white px-3 py-1">
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
