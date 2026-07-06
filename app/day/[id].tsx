import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MealSection } from '@/components/MealSection';
import { useDiners } from '@/context/DinersContext';
import { MEAL_PLAN } from '@/data/mealPlan';
import { formatDiners, getMealDiners, getTotalDiners } from '@/data/types';

export function generateStaticParams() {
  return MEAL_PLAN.map((day) => ({ id: day.id }));
}

export default function DayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { coefficient } = useDiners();
  const day = MEAL_PLAN.find((d) => d.id === id);

  if (!day) {
    return (
      <View className="flex-1 items-center justify-center bg-camp-bg p-4">
        <Text className="text-camp-muted">Den nenalezen</Text>
      </View>
    );
  }

  const primaryDiners = getMealDiners(day.meals.find((m) => m.label) ?? day.meals[0], day);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${day.date} ${day.dayName}`,
        }}
      />
      <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <View className="mb-4 rounded-2xl bg-camp-primary px-4 py-4">
          <Text className="text-2xl font-bold text-white">
            {day.date} {day.dayName}
          </Text>
          <Text className="mt-1 text-sm text-camp-accent">
            {formatDiners(primaryDiners)} · {getTotalDiners(primaryDiners)} osob
            {coefficient !== 1.0 ? ` · koef. ${coefficient}×` : ''}
          </Text>
        </View>

        <Text className="mb-3 text-sm text-camp-muted">
          Klepněte na strávníky nebo ingredienci pro úpravu. Dlouhé stisknutí vrátí původní hodnotu.
        </Text>

        {day.meals.map((meal) => (
          <MealSection key={meal.id} day={day} meal={meal} />
        ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
