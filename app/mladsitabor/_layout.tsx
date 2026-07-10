import { Stack } from 'expo-router';

import { LocalDataProvider } from '@/context/LocalDataContext';
import { MLADSITABOR_CAMP_CONFIG } from '@/data/mladsitabor/config';

export default function MladsitaborLayout() {
  return (
    <LocalDataProvider campConfig={MLADSITABOR_CAMP_CONFIG}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </LocalDataProvider>
  );
}
