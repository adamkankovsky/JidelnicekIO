import { Text, View } from 'react-native';

import { useDiners } from '@/context/DinersContext';

export function DinersSummary({ compact = false }: { compact?: boolean }) {
  const { coefficient } = useDiners();

  if (compact) {
    return (
      <View className="flex-row items-center rounded-full bg-camp-accent px-3 py-1">
        <Text className="text-sm font-semibold text-camp-primary">
          Koeficient: {coefficient}×
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-camp-accent bg-white p-4 shadow-sm">
      <Text className="text-xs font-medium uppercase tracking-wide text-camp-muted">Koeficient porcí</Text>
      <Text className="mt-1 text-2xl font-bold text-camp-primary">{coefficient}×</Text>
      <Text className="mt-1 text-sm text-camp-muted">
        {coefficient === 1.0
          ? 'Přesně dle receptu'
          : `Množství × ${Math.round(coefficient * 100)}%`}
      </Text>
    </View>
  );
}
