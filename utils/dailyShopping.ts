import type { CampDay, PerishableCategory } from '@/data/types';
import { MEAL_PLAN } from '@/data/mealPlan';
import { MEAL_TYPE_LABELS } from '@/data/types';
import { getScaledMealIngredients, type ScaledMealConfig } from '@/utils/scaledMealIngredients';

export interface DailyIngredientItem {
  name: string;
  quantity: number | null;
  unit: string;
  mealLabel: string;
  mealType: string;
  fromDayId?: string;
  fromDayDate?: string;
}

export interface AggregatedItemSource {
  dayDate: string;
  mealLabel: string;
  quantity: number | null;
  unit: string;
}

export interface AggregatedItem {
  name: string;
  totalQuantity: number | null;
  unit: string;
  sources: string[];
  detailedSources: AggregatedItemSource[];
}

export interface DailyShoppingSection {
  category: PerishableCategory;
  label: string;
  items: AggregatedItem[];
}

export interface BakerySection {
  items: AggregatedItem[];
  /** Which days are covered by this bakery purchase */
  coversDates: string[];
}

export interface DayShoppingResult {
  dayId: string;
  date: string;
  dayName: string;
  sections: DailyShoppingSection[];
  bakery: BakerySection | null;
  /** IDs of days whose ingredients have been merged into this one */
  mergedFromDayIds: string[];
}

const CATEGORY_LABELS: Record<PerishableCategory, string> = {
  meat: 'Maso',
  dairy: 'Mléčné / Vejce',
  vegetable: 'Zelenina',
  fruit: 'Ovoce',
  bakery: 'Pečivo',
};

const CATEGORY_ORDER: PerishableCategory[] = ['meat', 'dairy', 'vegetable', 'fruit', 'bakery'];

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
        fromDayId: day.id,
        fromDayDate: day.date,
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

    let totalQuantity: number | null = null;
    if (allHaveQuantity) {
      totalQuantity = group.items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
    }

    const sources = [...new Set(group.items.map((i) => i.mealLabel))];

    const detailedSources: AggregatedItemSource[] = group.items.map((i) => ({
      dayDate: i.fromDayDate ?? '',
      mealLabel: i.mealLabel,
      quantity: i.quantity,
      unit: i.unit,
    }));

    result.push({
      name: group.displayName,
      totalQuantity,
      unit: group.unit,
      sources,
      detailedSources,
    });
  }

  return result;
}

/**
 * Given a list of skipped day IDs, resolve the chain merge.
 * Returns a map: target day ID -> array of day IDs merged into it.
 * Skipped days chain backwards: if day-2 and day-3 are skipped,
 * day-2 merges into day-1, and day-3 also merges into day-1.
 */
export function resolveMergeChain(
  allDayIds: string[],
  skippedDayIds: Set<string>,
): Map<string, string[]> {
  const mergeMap = new Map<string, string[]>();

  for (const dayId of allDayIds) {
    if (!skippedDayIds.has(dayId)) {
      mergeMap.set(dayId, []);
    }
  }

  for (let i = 0; i < allDayIds.length; i++) {
    const dayId = allDayIds[i];
    if (!skippedDayIds.has(dayId)) continue;

    // Walk backwards to find the nearest non-skipped day
    let targetIdx = i - 1;
    while (targetIdx >= 0 && skippedDayIds.has(allDayIds[targetIdx])) {
      targetIdx--;
    }

    if (targetIdx >= 0) {
      const targetId = allDayIds[targetIdx];
      const existing = mergeMap.get(targetId) ?? [];
      existing.push(dayId);
      mergeMap.set(targetId, existing);
    } else {
      // No previous non-skipped day exists; find next non-skipped day forward
      let fwdIdx = i + 1;
      while (fwdIdx < allDayIds.length && skippedDayIds.has(allDayIds[fwdIdx])) {
        fwdIdx++;
      }
      if (fwdIdx < allDayIds.length) {
        const targetId = allDayIds[fwdIdx];
        const existing = mergeMap.get(targetId) ?? [];
        existing.push(dayId);
        mergeMap.set(targetId, existing);
      }
    }
  }

  return mergeMap;
}

export interface AllDaysShoppingConfig {
  skippedDays: string[];
  skippedBakeryDays: string[];
  bakeryDays: 2 | 3;
  includeBakery: boolean;
  scaledConfig: ScaledMealConfig;
}

/**
 * Build shopping lists for all days in the meal plan.
 * Perishables use skippedDays for merge chaining.
 * Bakery uses skippedBakeryDays independently; windows never overlap —
 * each day's bakery is assigned to exactly one shopping day.
 */
export function getAllDaysShopping(config: AllDaysShoppingConfig): DayShoppingResult[] {
  const allDayIds = MEAL_PLAN.map((d) => d.id);
  const dayById = new Map(MEAL_PLAN.map((d) => [d.id, d]));

  // Perishable merge chain (uses skippedDays)
  const skippedSet = new Set(config.skippedDays);
  const mergeMap = resolveMergeChain(allDayIds, skippedSet);

  // Bakery merge chain (uses skippedBakeryDays, independent)
  const skippedBakerySet = new Set(config.skippedBakeryDays);
  const bakeryMergeMap = resolveMergeChain(allDayIds, skippedBakerySet);

  // Build non-overlapping bakery windows:
  // Walk through bakery shopping days in order; each one claims
  // bakeryDays consecutive days starting from itself + its merged days.
  // Already-claimed days are not repeated.
  const bakeryClaimed = new Set<string>();
  const bakeryByDay = new Map<string, BakerySection>();

  if (config.includeBakery) {
    for (const [targetDayId, mergedDayIds] of bakeryMergeMap) {
      const targetIdx = allDayIds.indexOf(targetDayId);

      // Collect days for this bakery window (non-overlapping)
      const windowDayIds: string[] = [];
      let cursor = targetIdx;
      while (windowDayIds.length < config.bakeryDays && cursor < allDayIds.length) {
        const id = allDayIds[cursor];
        if (!bakeryClaimed.has(id)) {
          windowDayIds.push(id);
        }
        cursor++;
      }
      // Also include merged bakery days that aren't already claimed
      for (const mid of mergedDayIds) {
        if (!bakeryClaimed.has(mid) && !windowDayIds.includes(mid)) {
          windowDayIds.push(mid);
        }
      }

      // Mark all as claimed
      for (const id of windowDayIds) {
        bakeryClaimed.add(id);
      }

      // Extract bakery items
      const bakeryItems: DailyIngredientItem[] = [];
      const coversDates: string[] = [];
      for (const bid of windowDayIds) {
        const day = dayById.get(bid);
        if (day) {
          bakeryItems.push(...extractPerishableIngredients(day, config.scaledConfig, 'bakery'));
          coversDates.push(day.date);
        }
      }
      if (bakeryItems.length > 0) {
        bakeryByDay.set(targetDayId, { items: aggregateItems(bakeryItems), coversDates });
      }
    }
  }

  // Build per-day results (perishable sections)
  const NON_BAKERY_ORDER: PerishableCategory[] = ['meat', 'dairy', 'vegetable', 'fruit'];
  const results: DayShoppingResult[] = [];

  for (const [targetDayId, mergedDayIds] of mergeMap) {
    const targetDay = dayById.get(targetDayId)!;
    const allSourceDays = [targetDay, ...mergedDayIds.map((id) => dayById.get(id)!).filter(Boolean)];

    const sections: DailyShoppingSection[] = [];

    for (const category of NON_BAKERY_ORDER) {
      const allItems: DailyIngredientItem[] = [];
      for (const day of allSourceDays) {
        allItems.push(...extractPerishableIngredients(day, config.scaledConfig, category));
      }
      if (allItems.length > 0) {
        sections.push({
          category,
          label: CATEGORY_LABELS[category],
          items: aggregateItems(allItems),
        });
      }
    }

    // Attach bakery if this day has one assigned
    const bakery = bakeryByDay.get(targetDayId) ?? null;

    results.push({
      dayId: targetDayId,
      date: targetDay.date,
      dayName: targetDay.dayName,
      sections,
      bakery,
      mergedFromDayIds: mergedDayIds,
    });
  }

  return results;
}

export function getMealPlanDays(): { id: string; date: string; dayName: string }[] {
  return MEAL_PLAN.map((d) => ({ id: d.id, date: d.date, dayName: d.dayName }));
}
