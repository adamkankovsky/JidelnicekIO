import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayCard } from '@/components/DayCard';
import { DinersSummary } from '@/components/DinersSummary';
import { MEAL_PLAN } from '@/data/mealPlan';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
      <Text className="mb-1 text-2xl font-bold text-camp-primary">Táborový jídelníček</Text>
      <Text className="mb-4 text-sm text-camp-muted">13. 7. – 23. 7. 2025 · Snídaně 7:30, oběd 12:30, večeře 18:30</Text>

      <View className="mb-5">
        <DinersSummary />
      </View>

      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-camp-muted">Dny tábora</Text>

      {MEAL_PLAN.map((day) => (
        <DayCard key={day.id} day={day} />
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}
