import type { ScaledMealConfig } from '@/utils/scaledMealIngredients';
import { getScaledMealIngredients } from '@/utils/scaledMealIngredients';

import { INGREDIENT_CATEGORIES } from '@/data/ingredients';
import { MEAL_PLAN } from '@/data/mealPlan';
import { formatDiners, getMealTargetDiners, MEAL_TYPE_LABELS, type IngredientCategory } from '@/data/types';
import { scaleShoppingCategories } from '@/utils/shopping';

const DELIMITER = ';';

function csvCell(value: string | number | null | undefined): string {
  const str = value == null ? '' : String(value);
  if (str.includes('"') || str.includes(DELIMITER) || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(values: Array<string | number | null | undefined>): string {
  return values.map(csvCell).join(DELIMITER);
}

export function buildMealPlanCsv(config: ScaledMealConfig): string {
  const lines = [
    csvRow([
      'Datum',
      'Den',
      'Typ jídla',
      'Jídlo',
      'Strávníci',
      'Ingredience',
      'Množství',
      'Jednotka',
      'Poznámka',
      'Bez lepku',
    ]),
  ];

  for (const day of MEAL_PLAN) {
    for (const meal of day.meals) {
      if (!meal.label && meal.ingredients.length === 0 && !meal.ingredientsRaw) {
        continue;
      }

      const diners = formatDiners(getMealTargetDiners(meal, day));
      const ingredients = getScaledMealIngredients(day, meal, config);

      if (ingredients.length === 0) {
        lines.push(
          csvRow([
            day.date,
            day.dayName,
            MEAL_TYPE_LABELS[meal.type],
            meal.label,
            diners,
            '',
            '',
            '',
            '',
            meal.glutenWarning ? 'ano' : '',
          ]),
        );
        continue;
      }

      for (const ingredient of ingredients) {
        lines.push(
          csvRow([
            day.date,
            day.dayName,
            MEAL_TYPE_LABELS[meal.type],
            meal.label,
            diners,
            ingredient.name,
            ingredient.scaledQuantity,
            ingredient.unit,
            ingredient.note,
            ingredient.original.checkGlutenFree ? 'ověřit' : '',
          ]),
        );
      }
    }
  }

  return lines.join('\r\n');
}

export function buildShoppingListCsv(categories?: IngredientCategory[]): string {
  const cats = categories ?? INGREDIENT_CATEGORIES;
  const lines = [
    csvRow(['Kategorie', 'Surovina', 'Množství', 'Jednotka', 'Obchod 1', 'Obchod 2', 'Cena / jednotku']),
  ];

  for (const category of cats) {
    for (const item of category.items) {
      lines.push(
        csvRow([
          category.category,
          item.name,
          item.quantity,
          item.unit,
          item.shop1,
          item.shop2,
          item.pricePerUnit,
        ]),
      );
    }
  }

  return lines.join('\r\n');
}

export function buildShoppingListCsvFromCategories(categories: IngredientCategory[]): string {
  const lines = [
    csvRow(['Kategorie', 'Surovina', 'Množství', 'Jednotka']),
  ];

  for (const category of categories) {
    for (const item of category.items) {
      lines.push(
        csvRow([category.category, item.name, item.quantity, item.unit]),
      );
    }
  }

  return lines.join('\r\n');
}

export function buildAllIngredientsCsv(config: ScaledMealConfig): string {
  const scaled = scaleShoppingCategories(INGREDIENT_CATEGORIES, config.coefficient);
  return [
    'Nákupní seznam',
    buildShoppingListCsv(scaled),
    '',
    'Jídelníček (přepočtené množství)',
    buildMealPlanCsv(config),
  ].join('\r\n');
}
