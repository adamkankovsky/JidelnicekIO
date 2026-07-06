import type { MealDinersOverrides } from '@/context/DinersContext';
import type { CampDay, DinersConfig, Ingredient, Meal, OverridesMap } from '@/data/types';
import { getMealTargetDiners } from '@/data/types';
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

export interface ScaledMealConfig {
  coefficient: number;
  overrides: OverridesMap;
  mealDinersOverrides: MealDinersOverrides;
}

export function getScaledMealIngredients(
  day: CampDay,
  meal: Meal,
  config: ScaledMealConfig,
): ScaledIngredient[] {
  const recipeDiners = day.baseDiners;
  const targetDiners = getMealTargetDiners(meal, day);
  const dinersOverride = config.mealDinersOverrides[meal.id];
  const effectiveDiners: DinersConfig = dinersOverride ?? targetDiners;
  const factor = getScaleFactor(recipeDiners, effectiveDiners) * config.coefficient;

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
    const override = config.overrides[key];

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
}
