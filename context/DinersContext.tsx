import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { DinersConfig, IngredientOverride, OverridesMap } from '@/data/types';

const DINERS_KEY = '@jidelnicek/diners';
const OVERRIDES_KEY = '@jidelnicek/overrides';

const DEFAULT_DINERS: DinersConfig = { children: 18, adults: 12 };

interface DinersContextValue {
  diners: DinersConfig;
  overrides: OverridesMap;
  isLoading: boolean;
  setDiners: (config: DinersConfig) => void;
  setChildren: (count: number) => void;
  setAdults: (count: number) => void;
  setOverride: (key: string, override: IngredientOverride | null) => void;
  clearOverridesForMeal: (mealId: string) => void;
  clearAllOverrides: () => void;
  getOverride: (key: string) => IngredientOverride | undefined;
}

const DinersContext = createContext<DinersContextValue | null>(null);

export function DinersProvider({ children }: { children: React.ReactNode }) {
  const [diners, setDinersState] = useState<DinersConfig>(DEFAULT_DINERS);
  const [overrides, setOverridesState] = useState<OverridesMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [storedDiners, storedOverrides] = await Promise.all([
          AsyncStorage.getItem(DINERS_KEY),
          AsyncStorage.getItem(OVERRIDES_KEY),
        ]);

        if (storedDiners) {
          setDinersState(JSON.parse(storedDiners) as DinersConfig);
        }
        if (storedOverrides) {
          setOverridesState(JSON.parse(storedOverrides) as OverridesMap);
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const persistDiners = useCallback(async (config: DinersConfig) => {
    setDinersState(config);
    try {
      await AsyncStorage.setItem(DINERS_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to persist diners', error);
    }
  }, []);

  const persistOverrides = useCallback(async (next: OverridesMap) => {
    setOverridesState(next);
    try {
      await AsyncStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist overrides', error);
    }
  }, []);

  const setDiners = useCallback(
    (config: DinersConfig) => {
      persistDiners({
        children: Math.max(0, Math.round(config.children)),
        adults: Math.max(0, Math.round(config.adults)),
      });
    },
    [persistDiners],
  );

  const setChildren = useCallback(
    (count: number) => {
      persistDiners({
        children: Math.max(0, Math.round(count)),
        adults: diners.adults,
      });
    },
    [diners.adults, persistDiners],
  );

  const setAdults = useCallback(
    (count: number) => {
      persistDiners({
        children: diners.children,
        adults: Math.max(0, Math.round(count)),
      });
    },
    [diners.children, persistDiners],
  );

  const setOverride = useCallback(
    (key: string, override: IngredientOverride | null) => {
      const next = { ...overrides };
      if (override === null) {
        delete next[key];
      } else {
        next[key] = override;
      }
      persistOverrides(next);
    },
    [overrides, persistOverrides],
  );

  const clearOverridesForMeal = useCallback(
    (mealId: string) => {
      const next = { ...overrides };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${mealId}:`)) {
          delete next[key];
        }
      });
      persistOverrides(next);
    },
    [overrides, persistOverrides],
  );

  const clearAllOverrides = useCallback(() => {
    persistOverrides({});
  }, [persistOverrides]);

  const getOverride = useCallback((key: string) => overrides[key], [overrides]);

  const value = useMemo(
    () => ({
      diners,
      overrides,
      isLoading,
      setDiners,
      setChildren,
      setAdults,
      setOverride,
      clearOverridesForMeal,
      clearAllOverrides,
      getOverride,
    }),
    [
      diners,
      overrides,
      isLoading,
      setDiners,
      setChildren,
      setAdults,
      setOverride,
      clearOverridesForMeal,
      clearAllOverrides,
      getOverride,
    ],
  );

  return <DinersContext.Provider value={value}>{children}</DinersContext.Provider>;
}

export function useDiners() {
  const context = useContext(DinersContext);
  if (!context) {
    throw new Error('useDiners must be used within DinersProvider');
  }
  return context;
}
