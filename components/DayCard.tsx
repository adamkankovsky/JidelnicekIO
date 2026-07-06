import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { CampDay } from '@/data/types';
import { formatDiners, getMealDiners, getTotalDiners, MEAL_TYPE_LABELS } from '@/data/types';

interface DayCardProps {
  day: CampDay;
}

export function DayCard({ day }: DayCardProps) {
  const mealLabels = day.meals
    .filter((m) => m.label)
    .map((m) => `${MEAL_TYPE_LABELS[m.type]}: ${m.label}`)
    .slice(0, 4);

  const dinersSet = new Set(
    day.meals.filter((m) => m.label).map((m) => {
      const d = getMealDiners(m, day);
      return `${d.children}/${d.adults}`;
    }),
  );
  const primaryDiners = getMealDiners(day.meals.find((m) => m.label) ?? day.meals[0], day);
  const dinersLabel =
    dinersSet.size <= 1
      ? `${formatDiners(primaryDiners)} (${getTotalDiners(primaryDiners)})`
      : `${getTotalDiners(primaryDiners)} osob (mění se)`;

  return (
    <Link href={`/day/${day.id}`} asChild>
      <Pressable className="mb-3 overflow-hidden rounded-2xl border border-camp-accent bg-white shadow-sm active:opacity-90">
        <View className="bg-camp-primary px-4 py-3">
          <Text className="text-lg font-bold text-white">
            {day.date} {day.dayName}
          </Text>
          <Text className="text-sm text-camp-accent">
            {dinersLabel}
          </Text>
        </View>
        <View className="px-4 py-3">
          {mealLabels.length > 0 ? (
            mealLabels.map((line, i) => (
              <Text key={i} className="mb-1 text-sm text-camp-text" numberOfLines={1}>
                • {line}
              </Text>
            ))
          ) : (
            <Text className="text-sm italic text-camp-muted">Bez jídel</Text>
          )}
          {day.meals.length > 4 && (
            <Text className="mt-1 text-xs text-camp-muted">+ další jídla</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
