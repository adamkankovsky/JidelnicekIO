import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DinersSummary } from '@/components/DinersSummary';
import { NumberInput } from '@/components/NumberInput';
import { useDiners } from '@/context/DinersContext';
import { getTotalDiners } from '@/data/types';

export default function SettingsScreen() {
  const { diners, setChildren, setAdults, clearAllOverrides } = useDiners();
  const total = getTotalDiners(diners);

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
      <Text className="mb-1 text-2xl font-bold text-camp-primary">Nastavení</Text>
      <Text className="mb-6 text-sm text-camp-muted">
        Upravte počet strávníků. Množství ingrediencí se automaticky přepočítá podle poměru.
      </Text>

      <View className="mb-6 rounded-2xl border border-camp-accent bg-white p-4">
        <NumberInput label="Počet dětí (D)" value={diners.children} onChange={setChildren} max={200} />
        <NumberInput label="Počet vedoucích (V)" value={diners.adults} onChange={setAdults} max={100} />

        <View className="mt-2 rounded-xl bg-camp-accent/60 p-4">
          <Text className="text-sm text-camp-muted">Celkový počet strávníků</Text>
          <Text className="text-3xl font-bold text-camp-primary">{total}</Text>
        </View>
      </View>

      <DinersSummary />

      <View className="mt-6 rounded-2xl border border-camp-accent bg-white p-4">
        <Text className="mb-2 text-base font-semibold text-camp-text">Ruční úpravy</Text>
        <Text className="mb-4 text-sm text-camp-muted">
          Pokud jste ručně upravili množství ingrediencí v detailu dne, můžete je zde resetovat na přepočítané
          hodnoty.
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
