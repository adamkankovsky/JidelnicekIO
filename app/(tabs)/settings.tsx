import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDiners } from '@/context/DinersContext';
import { MEAL_PLAN } from '@/data/mealPlan';
import { formatDiners, getMealDiners, getTotalDiners, MEAL_TYPE_LABELS } from '@/data/types';

export default function SettingsScreen() {
  const { coefficient, setCoefficient, clearAllOverrides } = useDiners();

  const coefficientPercent = Math.round(coefficient * 100);

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-camp-primary">Nastavení</Text>
        <Text className="mb-6 text-sm text-camp-muted">
          Koeficient násobí všechna množství ingrediencí. Počty strávníků jsou nastaveny per jídlo.
        </Text>

        <View className="mb-6 rounded-2xl border border-camp-accent bg-white p-4">
          <Text className="mb-2 text-base font-semibold text-camp-text">Koeficient porcí</Text>
          <Text className="mb-3 text-sm text-camp-muted">
            Násobitel množství (1.0 = přesně dle receptu, 1.15 = +15% navíc)
          </Text>
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => setCoefficient(coefficient - 0.05)}
              className="h-12 w-12 items-center justify-center rounded-xl bg-camp-accent active:opacity-70">
              <Text className="text-2xl font-bold text-camp-primary">−</Text>
            </Pressable>
            <TextInput
              className="h-12 flex-1 rounded-xl border border-camp-accent bg-white text-center text-xl font-semibold text-camp-text"
              keyboardType="decimal-pad"
              value={String(coefficient)}
              onChangeText={(text) => {
                const parsed = parseFloat(text.replace(',', '.'));
                if (!Number.isNaN(parsed) && parsed > 0) {
                  setCoefficient(parsed);
                }
              }}
            />
            <Pressable
              onPress={() => setCoefficient(coefficient + 0.05)}
              className="h-12 w-12 items-center justify-center rounded-xl bg-camp-accent active:opacity-70">
              <Text className="text-2xl font-bold text-camp-primary">+</Text>
            </Pressable>
          </View>
          <View className="mt-3 flex-row justify-center gap-2">
            {[0.9, 1.0, 1.1, 1.15, 1.2].map((v) => (
              <Pressable
                key={v}
                onPress={() => setCoefficient(v)}
                className={`rounded-lg px-3 py-1.5 ${
                  Math.abs(coefficient - v) < 0.005
                    ? 'bg-camp-primary'
                    : 'bg-camp-accent'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    Math.abs(coefficient - v) < 0.005
                      ? 'text-white'
                      : 'text-camp-primary'
                  }`}>
                  {v === 1.0 ? '1×' : `${Math.round(v * 100)}%`}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="mt-3 rounded-xl bg-camp-accent/60 p-3">
            <Text className="text-center text-sm text-camp-muted">
              Množství × <Text className="font-bold text-camp-primary">{coefficientPercent}%</Text>
            </Text>
          </View>
        </View>

        <View className="mb-6 rounded-2xl border border-camp-accent bg-white p-4">
          <Text className="mb-2 text-base font-semibold text-camp-text">Přehled strávníků</Text>
          <Text className="mb-3 text-sm text-camp-muted">
            Počty dětí/vedoucích na jednotlivé dny a jídla
          </Text>
          {MEAL_PLAN.map((day) => {
            const uniqueDiners = new Set(
              day.meals.map((m) => {
                const d = getMealDiners(m, day);
                return `${d.children}/${d.adults}`;
              }),
            );
            const allSame = uniqueDiners.size <= 1;

            return (
              <View key={day.id} className="mb-3 border-b border-camp-accent/40 pb-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-camp-text">
                    {day.date} {day.dayName}
                  </Text>
                  {allSame ? (
                    <Text className="text-sm text-camp-muted">
                      {formatDiners(getMealDiners(day.meals[0], day))} ({getTotalDiners(getMealDiners(day.meals[0], day))})
                    </Text>
                  ) : null}
                </View>
                {!allSame
                  ? day.meals
                      .filter((m) => m.label)
                      .map((m) => {
                        const d = getMealDiners(m, day);
                        return (
                          <View key={m.id} className="ml-3 mt-1 flex-row items-center justify-between">
                            <Text className="text-xs text-camp-muted">
                              {MEAL_TYPE_LABELS[m.type]}
                            </Text>
                            <Text className="text-xs text-camp-muted">
                              {formatDiners(d)} ({getTotalDiners(d)})
                            </Text>
                          </View>
                        );
                      })
                  : null}
              </View>
            );
          })}
        </View>

        <View className="mt-2 rounded-2xl border border-camp-accent bg-white p-4">
          <Text className="mb-2 text-base font-semibold text-camp-text">Ruční úpravy</Text>
          <Text className="mb-4 text-sm text-camp-muted">
            Pokud jste ručně upravili množství ingrediencí nebo počty strávníků, můžete je zde resetovat.
          </Text>
          <Pressable
            onPress={clearAllOverrides}
            className="rounded-xl bg-camp-warm/20 py-3 active:opacity-70">
            <Text className="text-center text-base font-semibold text-camp-warm">
              Resetovat všechny ruční úpravy
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
