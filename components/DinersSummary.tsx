import { Text, View } from 'react-native';

import { useDiners } from '@/context/DinersContext';
import { formatDiners, getTotalDiners } from '@/data/types';

export function DinersSummary({ compact = false }: { compact?: boolean }) {
  const { diners } = useDiners();
  const total = getTotalDiners(diners);

  if (compact) {
    return (
      <View className="flex-row items-center rounded-full bg-camp-accent px-3 py-1">
        <Text className="text-sm font-semibold text-camp-primary">
          {formatDiners(diners)} · {total} celkem
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-2xl border border-camp-accent bg-white p-4 shadow-sm">
      <Text className="text-xs font-medium uppercase tracking-wide text-camp-muted">Aktuální strávníci</Text>
      <Text className="mt-1 text-2xl font-bold text-camp-primary">{formatDiners(diners)}</Text>
      <Text className="mt-1 text-sm text-camp-muted">Celkem {total} osob</Text>
    </View>
  );
}
