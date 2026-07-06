import { useMemo } from 'react';

import { useDiners } from '@/context/DinersContext';
import type { CampDay, Meal } from '@/data/types';
import { getScaledMealIngredients, type ScaledIngredient } from '@/utils/scaledMealIngredients';

export type { ScaledIngredient };

export function useScaledMeal(day: CampDay, meal: Meal): ScaledIngredient[] {
  const { coefficient, overrides, mealDinersOverrides } = useDiners();

  return useMemo(
    () =>
      getScaledMealIngredients(day, meal, {
        coefficient,
        overrides,
        mealDinersOverrides,
      }),
    [coefficient, day, meal, mealDinersOverrides, overrides],
  );
}
