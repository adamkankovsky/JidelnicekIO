import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { DinersConfig, IngredientOverride, OverridesMap } from '@/data/types';

const COEFFICIENT_KEY = '@jidelnicek/coefficient';
const OVERRIDES_KEY = '@jidelnicek/overrides';
const MEAL_DINERS_KEY = '@jidelnicek/mealDiners';

const DEFAULT_COEFFICIENT = 1.0;

export type MealDinersOverrides = Record<string, DinersConfig>;

interface DinersContextValue {
  coefficient: number;
  mealDinersOverrides: MealDinersOverrides;
  overrides: OverridesMap;
  isLoading: boolean;
  setCoefficient: (value: number) => void;
  setMealDiners: (mealId: string, config: DinersConfig | null) => void;
  getMealDiners: (mealId: string) => DinersConfig | undefined;
  setOverride: (key: string, override: IngredientOverride | null) => void;
  clearOverridesForMeal: (mealId: string) => void;
  clearAllOverrides: () => void;
  getOverride: (key: string) => IngredientOverride | undefined;
}

const DinersContext = createContext<DinersContextValue | null>(null);

export function DinersProvider({ children }: { children: React.ReactNode }) {
  const [coefficient, setCoefficientState] = useState<number>(DEFAULT_COEFFICIENT);
  const [mealDinersOverrides, setMealDinersState] = useState<MealDinersOverrides>({});
  const [overrides, setOverridesState] = useState<OverridesMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [storedCoefficient, storedOverrides, storedMealDiners] = await Promise.all([
          AsyncStorage.getItem(COEFFICIENT_KEY),
          AsyncStorage.getItem(OVERRIDES_KEY),
          AsyncStorage.getItem(MEAL_DINERS_KEY),
        ]);

        if (storedCoefficient) {
          const parsed = parseFloat(storedCoefficient);
          if (!Number.isNaN(parsed) && parsed > 0) {
            setCoefficientState(parsed);
          }
        }
        if (storedOverrides) {
          setOverridesState(JSON.parse(storedOverrides) as OverridesMap);
        }
        if (storedMealDiners) {
          setMealDinersState(JSON.parse(storedMealDiners) as MealDinersOverrides);
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const setCoefficient = useCallback(async (value: number) => {
    const clamped = Math.max(0.1, Math.round(value * 100) / 100);
    setCoefficientState(clamped);
    try {
      await AsyncStorage.setItem(COEFFICIENT_KEY, String(clamped));
    } catch (error) {
      console.warn('Failed to persist coefficient', error);
    }
  }, []);

  const persistMealDiners = useCallback(async (next: MealDinersOverrides) => {
    setMealDinersState(next);
    try {
      await AsyncStorage.setItem(MEAL_DINERS_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist meal diners', error);
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

  const setMealDiners = useCallback(
    (mealId: string, config: DinersConfig | null) => {
      const next = { ...mealDinersOverrides };
      if (config === null) {
        delete next[mealId];
      } else {
        next[mealId] = {
          children: Math.max(0, Math.round(config.children)),
          adults: Math.max(0, Math.round(config.adults)),
        };
      }
      persistMealDiners(next);
    },
    [mealDinersOverrides, persistMealDiners],
  );

  const getMealDiners = useCallback(
    (mealId: string) => mealDinersOverrides[mealId],
    [mealDinersOverrides],
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
    persistMealDiners({});
  }, [persistOverrides, persistMealDiners]);

  const getOverride = useCallback((key: string) => overrides[key], [overrides]);

  const value = useMemo(
    () => ({
      coefficient,
      mealDinersOverrides,
      overrides,
      isLoading,
      setCoefficient,
      setMealDiners,
      getMealDiners,
      setOverride,
      clearOverridesForMeal,
      clearAllOverrides,
      getOverride,
    }),
    [
      coefficient,
      mealDinersOverrides,
      overrides,
      isLoading,
      setCoefficient,
      setMealDiners,
      getMealDiners,
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
