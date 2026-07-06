import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import type {
  ActualPurchasesMap,
  DinersConfig,
  IngredientOverride,
  OverridesMap,
} from '@/data/types';

export const STORAGE_KEY = '@jidelnicek/local-state-v1';
export const STORAGE_VERSION = 1;

export type MealDinersOverrides = Record<string, DinersConfig>;
export type CheckedItemsMap = Record<string, boolean>;

const LEGACY_KEYS = [
  '@jidelnicek/coefficient',
  '@jidelnicek/overrides',
  '@jidelnicek/mealDiners',
  '@jidelnicek/shopping-checked',
  '@jidelnicek/hide-purchased',
  '@jidelnicek/purchases',
] as const;

export interface PromoPeriodFilter {
  from: string;
  to: string;
}

export interface AppLocalState {
  version: number;
  savedAt: string;
  shopping: {
    checked: CheckedItemsMap;
    hidePurchased: boolean;
    shopFilter: string | null;
    periodFilter: PromoPeriodFilter | null;
  };
  purchases: ActualPurchasesMap;
  diners: {
    coefficient: number;
    mealDinersOverrides: MealDinersOverrides;
    overrides: OverridesMap;
  };
}

export function createDefaultState(): AppLocalState {
  return {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    shopping: {
      checked: {},
      hidePurchased: false,
      shopFilter: null,
      periodFilter: null,
    },
    purchases: {},
    diners: {
      coefficient: 1.0,
      mealDinersOverrides: {},
      overrides: {},
    },
  };
}

function mergeState(base: AppLocalState, patch: Partial<AppLocalState>): AppLocalState {
  return {
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    shopping: { ...base.shopping, ...patch.shopping },
    purchases: { ...base.purchases, ...patch.purchases },
    diners: { ...base.diners, ...patch.diners },
  };
}

async function loadLegacyState(): Promise<AppLocalState | null> {
  const [coefficient, overrides, mealDiners, checked, hidePurchased, purchases] = await Promise.all([
    AsyncStorage.getItem('@jidelnicek/coefficient'),
    AsyncStorage.getItem('@jidelnicek/overrides'),
    AsyncStorage.getItem('@jidelnicek/mealDiners'),
    AsyncStorage.getItem('@jidelnicek/shopping-checked'),
    AsyncStorage.getItem('@jidelnicek/hide-purchased'),
    AsyncStorage.getItem('@jidelnicek/purchases'),
  ]);

  const hasLegacy = [coefficient, overrides, mealDiners, checked, hidePurchased, purchases].some(Boolean);
  if (!hasLegacy) return null;

  const state = createDefaultState();

  if (coefficient) {
    const parsed = parseFloat(coefficient);
    if (!Number.isNaN(parsed) && parsed > 0) {
      state.diners.coefficient = parsed;
    }
  }
  if (overrides) {
    state.diners.overrides = JSON.parse(overrides) as OverridesMap;
  }
  if (mealDiners) {
    state.diners.mealDinersOverrides = JSON.parse(mealDiners) as MealDinersOverrides;
  }
  if (checked) {
    state.shopping.checked = JSON.parse(checked) as CheckedItemsMap;
  }
  if (hidePurchased) {
    state.shopping.hidePurchased = JSON.parse(hidePurchased) as boolean;
  }
  if (purchases) {
    state.purchases = JSON.parse(purchases) as ActualPurchasesMap;
  }

  return state;
}

export async function loadAppState(): Promise<AppLocalState> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppLocalState;
      const merged = mergeState(createDefaultState(), parsed);
      return { ...merged, savedAt: parsed.savedAt ?? merged.savedAt };
    }
  } catch (error) {
    console.warn('Failed to load unified local state', error);
  }

  const legacy = await loadLegacyState();
  if (legacy) {
    await saveAppState(legacy);
    await AsyncStorage.multiRemove([...LEGACY_KEYS]);
    return legacy;
  }

  return createDefaultState();
}

export async function saveAppState(state: AppLocalState): Promise<void> {
  const payload: AppLocalState = {
    ...state,
    version: STORAGE_VERSION,
    savedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function parseImportedState(raw: string): AppLocalState {
  const parsed = JSON.parse(raw) as Partial<AppLocalState>;
  return mergeState(createDefaultState(), parsed);
}

export function exportStateJson(state: AppLocalState): string {
  return JSON.stringify(state, null, 2);
}

export function subscribeToStorageChanges(onChange: (state: AppLocalState) => void): () => void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      onChange(JSON.parse(event.newValue) as AppLocalState);
    } catch (error) {
      console.warn('Failed to sync local state from another tab', error);
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
