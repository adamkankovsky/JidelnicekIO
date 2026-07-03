export type MealType = 'snidane' | 'svacina' | 'obed' | 'vecere';

export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string;
  note?: string | null;
}

export interface Meal {
  id: string;
  type: MealType;
  label: string;
  ingredients: Ingredient[];
  ingredientsRaw?: string;
  recipe?: string;
}

export interface CampDay {
  id: string;
  date: string;
  dayName: string;
  baseDiners: { children: number; adults: number };
  meals: Meal[];
}

export interface DinersConfig {
  children: number;
  adults: number;
}

export interface IngredientOverride {
  quantity: number | null;
  displayText?: string;
}

export type OverridesMap = Record<string, IngredientOverride>;

export interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  shop1: number | null;
  shop2: number | null;
  pricePerUnit: string | null;
}

export interface IngredientCategory {
  category: string;
  items: ShoppingItem[];
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  snidane: 'Snídaně',
  svacina: 'Svačina',
  obed: 'Oběd',
  vecere: 'Večeře',
};

export function getTotalDiners(d: DinersConfig): number {
  return d.children + d.adults;
}

export function formatDiners(d: DinersConfig): string {
  return `${d.children}D / ${d.adults}V`;
}
