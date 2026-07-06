import { useMemo } from 'react';

import { useDiners } from '@/context/DinersContext';
import type { CampDay, DinersConfig, Ingredient, Meal } from '@/data/types';
import { getMealDiners } from '@/data/types';
import { formatQuantity, getIngredientKey, getScaleFactor, scaleIngredient } from '@/utils/scaling';

export interface ScaledIngredient {
  key: string;
  name: string;
  unit: string;
  baseQuantity: number | null;
  scaledQuantity: number | null;
  displayText: string;
  note?: string | null;
  isOverridden: boolean;
  original: Ingredient;
}

export function useScaledMeal(day: CampDay, meal: Meal): ScaledIngredient[] {
  const { coefficient, getMealDiners: getMealDinersOverride, getOverride } = useDiners();

  const baseDiners = getMealDiners(meal, day);
  const dinersOverride = getMealDinersOverride(meal.id);
  const effectiveDiners: DinersConfig = dinersOverride ?? baseDiners;

  const factor = getScaleFactor(baseDiners, effectiveDiners) * coefficient;

  return useMemo(() => {
    if (meal.ingredients.length === 0 && meal.ingredientsRaw) {
      return [
        {
          key: `${meal.id}:raw`,
          name: meal.ingredientsRaw,
          unit: '',
          baseQuantity: null,
          scaledQuantity: null,
          displayText: meal.ingredientsRaw,
          isOverridden: false,
          original: { name: meal.ingredientsRaw, quantity: null, unit: '' },
        },
      ];
    }

    return meal.ingredients.map((ingredient, index) => {
      const key = getIngredientKey(meal.id, index);
      const scaled = scaleIngredient(ingredient, factor);
      const override = getOverride(key);

      if (override) {
        const qty = override.quantity;
        const displayText =
          override.displayText ??
          (qty !== null && ingredient.unit
            ? `${ingredient.name} ${formatQuantity(qty, ingredient.unit)}`
            : ingredient.name);

        return {
          key,
          name: ingredient.name,
          unit: ingredient.unit,
          baseQuantity: ingredient.quantity,
          scaledQuantity: qty,
          displayText,
          note: ingredient.note,
          isOverridden: true,
          original: ingredient,
        };
      }

      return {
        key,
        name: ingredient.name,
        unit: ingredient.unit,
        baseQuantity: ingredient.quantity,
        scaledQuantity: scaled.quantity,
        displayText: scaled.displayText,
        note: ingredient.note,
        isOverridden: false,
        original: ingredient,
      };
    });
  }, [factor, getOverride, meal]);
}
