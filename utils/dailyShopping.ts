import type { CampDay, Ingredient, Meal, PerishableCategory } from '@/data/types';
import { MEAL_PLAN } from '@/data/mealPlan';
import { MEAL_TYPE_LABELS } from '@/data/types';
import { getScaledMealIngredients, type ScaledMealConfig } from '@/utils/scaledMealIngredients';

export interface DailyIngredientItem {
  name: string;
  quantity: number | null;
  unit: string;
  mealLabel: string;
  mealType: string;
}

export interface AggregatedItem {
  name: string;
  totalQuantity: number | null;
  unit: string;
  sources: string[];
}

export interface DailyShoppingSection {
  category: PerishableCategory;
  label: string;
  items: AggregatedItem[];
}

export interface DailyShoppingList {
  targetDate: string;
  dayName: string;
  campDayId: string | null;
  sections: DailyShoppingSection[];
  bakeryDays: number;
  bakeryDayIds: string[];
}

const CATEGORY_LABELS: Record<PerishableCategory, string> = {
  meat: 'Maso',
  dairy: 'Mléčné / Vejce',
  vegetable: 'Zelenina',
  fruit: 'Ovoce',
  bakery: 'Pečivo',
};

const CATEGORY_ORDER: PerishableCategory[] = ['meat', 'dairy', 'vegetable', 'fruit', 'bakery'];

function parseMealPlanDate(dateStr: string, year: number): string {
  const match = dateStr.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!match) return '';
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getMealPlanYear(): number {
  if (MEAL_PLAN.length === 0) return new Date().getFullYear();
  const firstDate = MEAL_PLAN[0].date;
  const now = new Date();
  const testIso = parseMealPlanDate(firstDate, now.getFullYear());
  if (testIso) return now.getFullYear();
  return now.getFullYear();
}

export function findDayByDate(isoDate: string): CampDay | null {
  const year = getMealPlanYear();
  for (const day of MEAL_PLAN) {
    const dayIso = parseMealPlanDate(day.date, year);
    if (dayIso === isoDate) return day;
  }
  return null;
}

export function findDayIndex(isoDate: string): number {
  const year = getMealPlanYear();
  return MEAL_PLAN.findIndex((day) => parseMealPlanDate(day.date, year) === isoDate);
}

function getConsecutiveDays(startDate: string, count: number): CampDay[] {
  const startIdx = findDayIndex(startDate);
  if (startIdx === -1) return [];
  const days: CampDay[] = [];
  for (let i = 0; i < count && startIdx + i < MEAL_PLAN.length; i++) {
    days.push(MEAL_PLAN[startIdx + i]);
  }
  return days;
}

function extractPerishableIngredients(
  day: CampDay,
  config: ScaledMealConfig,
  category: PerishableCategory,
): DailyIngredientItem[] {
  const items: DailyIngredientItem[] = [];

  for (const meal of day.meals) {
    const scaled = getScaledMealIngredients(day, meal, config);
    for (let i = 0; i < meal.ingredients.length; i++) {
      const ing = meal.ingredients[i];
      if (ing.perishable !== category) continue;
      if (!ing.name.trim()) continue;

      const scaledIng = scaled[i];
      items.push({
        name: ing.name,
        quantity: scaledIng?.scaledQuantity ?? ing.quantity,
        unit: ing.unit,
        mealLabel: meal.label || MEAL_TYPE_LABELS[meal.type],
        mealType: MEAL_TYPE_LABELS[meal.type],
      });
    }
  }

  return items;
}

function normalizeIngredientName(name: string): string {
  return name.toLowerCase().replace(/\s*\d+.*$/, '').trim();
}

function aggregateItems(items: DailyIngredientItem[]): AggregatedItem[] {
  const groups = new Map<string, { items: DailyIngredientItem[]; unit: string; displayName: string }>();

  for (const item of items) {
    const key = normalizeIngredientName(item.name);
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { items: [item], unit: item.unit, displayName: item.name });
    }
  }

  const result: AggregatedItem[] = [];
  for (const [, group] of groups) {
    const allHaveQuantity = group.items.every((i) => i.quantity != null);
    const sameUnit = group.items.every((i) => i.unit === group.unit);

    let totalQuantity: number | null = null;
    if (allHaveQuantity && sameUnit) {
      totalQuantity = group.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
    } else if (allHaveQuantity) {
      totalQuantity = group.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
    }

    const sources = [...new Set(group.items.map((i) => i.mealLabel))];

    result.push({
      name: group.displayName,
      totalQuantity,
      unit: group.unit,
      sources,
    });
  }

  return result;
}

export function getTomorrowIso(): string {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return tomorrow.toISOString().slice(0, 10);
}

export function formatDailyDate(isoDate: string): string {
  const [, month, day] = isoDate.split('-');
  return `${parseInt(day, 10)}.${parseInt(month, 10)}.`;
}

export function getDailyFreshIngredients(
  targetDate: string,
  bakeryDays: 2 | 3,
  config: ScaledMealConfig,
): DailyShoppingList {
  const targetDay = findDayByDate(targetDate);
  const bakeryStartDays = getConsecutiveDays(targetDate, bakeryDays);

  const sections: DailyShoppingSection[] = [];

  for (const category of CATEGORY_ORDER) {
    if (category === 'bakery') {
      const allBakeryItems: DailyIngredientItem[] = [];
      for (const day of bakeryStartDays) {
        allBakeryItems.push(...extractPerishableIngredients(day, config, 'bakery'));
      }
      if (allBakeryItems.length > 0) {
        sections.push({
          category: 'bakery',
          label: CATEGORY_LABELS.bakery,
          items: aggregateItems(allBakeryItems),
        });
      }
    } else {
      if (!targetDay) continue;
      const items = extractPerishableIngredients(targetDay, config, category);
      if (items.length > 0) {
        sections.push({
          category,
          label: CATEGORY_LABELS[category],
          items: aggregateItems(items),
        });
      }
    }
  }

  return {
    targetDate,
    dayName: targetDay?.dayName ?? '',
    campDayId: targetDay?.id ?? null,
    sections,
    bakeryDays,
    bakeryDayIds: bakeryStartDays.map((d) => d.id),
  };
}
