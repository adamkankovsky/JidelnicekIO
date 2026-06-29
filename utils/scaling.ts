import type { DinersConfig, Ingredient } from '@/data/types';

const INTEGER_UNITS = new Set(['ks', 'x', 'bal', 'plech', 'pytlíků', 'lahev', 'balení', 'pal', 'palička', 'paličku', 'vajíček', 'vajec', 'minut']);

export function getScaleFactor(baseDiners: DinersConfig, currentDiners: DinersConfig): number {
  const baseTotal = baseDiners.children + baseDiners.adults;
  const currentTotal = currentDiners.children + currentDiners.adults;
  if (baseTotal <= 0) return 1;
  return currentTotal / baseTotal;
}

export function scaleQuantity(quantity: number, factor: number, unit: string): number {
  const scaled = quantity * factor;
  const normalizedUnit = unit.toLowerCase().replace(/\./g, '');

  if (INTEGER_UNITS.has(normalizedUnit) || normalizedUnit === '') {
    return Math.ceil(scaled);
  }

  return Math.round(scaled * 10) / 10;
}

export function formatQuantity(quantity: number, unit: string): string {
  const displayQty = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1).replace(/\.0$/, '');
  if (!unit) return displayQty;
  return `${displayQty} ${unit}`;
}

export function getIngredientKey(mealId: string, index: number): string {
  return `${mealId}:${index}`;
}

export function scaleIngredient(
  ingredient: Ingredient,
  factor: number,
): { quantity: number | null; displayText: string } {
  if (ingredient.quantity === null) {
    return {
      quantity: null,
      displayText: ingredient.note ? `${ingredient.name} (${ingredient.note})` : ingredient.name,
    };
  }

  const scaled = scaleQuantity(ingredient.quantity, factor, ingredient.unit);
  const base = formatQuantity(scaled, ingredient.unit);
  const displayText = ingredient.note ? `${ingredient.name} ${base} (${ingredient.note})` : `${ingredient.name} ${base}`;

  return { quantity: scaled, displayText };
}
