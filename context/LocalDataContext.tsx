import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { INGREDIENT_CATEGORIES } from '@/data/ingredients';
import type { ActualPurchase, DinersConfig, IngredientOverride } from '@/data/types';
import { getShoppingItemKey } from '@/utils/shopping';
import {
  createDefaultState,
  exportStateJson,
  loadAppState,
  parseImportedState,
  saveAppState,
  subscribeToStorageChanges,
  type AppLocalState,
  type CheckedItemsMap,
  type MealDinersOverrides,
  type PromoPeriodFilter,
} from '@/utils/appStorage';

export type { MealDinersOverrides, CheckedItemsMap };

function buildAllKeys(): CheckedItemsMap {
  const map: CheckedItemsMap = {};
  for (const category of INGREDIENT_CATEGORIES) {
    for (const item of category.items) {
      map[getShoppingItemKey(category.category, item)] = false;
    }
  }
  return map;
}

const ALL_KEYS = buildAllKeys();
const TOTAL_COUNT = Object.keys(ALL_KEYS).length;

interface LocalDataContextValue {
  isHydrated: boolean;
  state: AppLocalState;
  exportBackup: () => string;
  importBackup: (raw: string) => void;
  // diners
  coefficient: number;
  mealDinersOverrides: MealDinersOverrides;
  overrides: AppLocalState['diners']['overrides'];
  setCoefficient: (value: number) => void;
  setMealDiners: (mealId: string, config: DinersConfig | null) => void;
  getMealDiners: (mealId: string) => DinersConfig | undefined;
  setOverride: (key: string, override: IngredientOverride | null) => void;
  clearOverridesForMeal: (mealId: string) => void;
  clearAllOverrides: () => void;
  getOverride: (key: string) => IngredientOverride | undefined;
  // shopping
  checked: CheckedItemsMap;
  totalCount: number;
  checkedCount: number;
  hidePurchased: boolean;
  shopFilter: string | null;
  periodFilter: PromoPeriodFilter | null;
  isChecked: (key: string) => boolean;
  toggleItem: (key: string) => void;
  setChecked: (key: string, value: boolean) => void;
  clearAllChecked: () => void;
  checkAll: () => void;
  setHidePurchased: (value: boolean) => void;
  setShopFilter: (shop: string | null) => void;
  setPeriodFilter: (period: PromoPeriodFilter | null) => void;
  // purchases
  purchases: AppLocalState['purchases'];
  setPurchase: (key: string, purchase: ActualPurchase | null) => void;
  getPurchase: (key: string) => ActualPurchase | undefined;
  clearAllPurchases: () => void;
  totalSpent: number;
}

const LocalDataContext = createContext<LocalDataContextValue | null>(null);

export function LocalDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppLocalState>(createDefaultState);
  const [isHydrated, setIsHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback(async (next: AppLocalState) => {
    stateRef.current = next;
    setState(next);
    try {
      await saveAppState(next);
    } catch (error) {
      console.warn('Failed to persist local state', error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const loaded = await loadAppState();
        if (active) {
          stateRef.current = loaded;
          setState(loaded);
        }
      } catch (error) {
        console.warn('Failed to hydrate local state', error);
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    hydrate();
    const unsubscribe = subscribeToStorageChanges((next) => {
      if (active) {
        stateRef.current = next;
        setState(next);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const updateState = useCallback(
    (updater: (current: AppLocalState) => AppLocalState) => {
      persist(updater(stateRef.current));
    },
    [persist],
  );

  const exportBackup = useCallback(() => exportStateJson(stateRef.current), []);

  const importBackup = useCallback(
    (raw: string) => {
      const imported = parseImportedState(raw);
      persist(imported);
    },
    [persist],
  );

  const setCoefficient = useCallback(
    (value: number) => {
      const clamped = Math.max(0.1, Math.round(value * 100) / 100);
      updateState((current) => ({
        ...current,
        diners: { ...current.diners, coefficient: clamped },
      }));
    },
    [updateState],
  );

  const setMealDiners = useCallback(
    (mealId: string, config: DinersConfig | null) => {
      updateState((current) => {
        const next = { ...current.diners.mealDinersOverrides };
        if (config === null) {
          delete next[mealId];
        } else {
          next[mealId] = {
            children: Math.max(0, Math.round(config.children)),
            adults: Math.max(0, Math.round(config.adults)),
          };
        }
        return { ...current, diners: { ...current.diners, mealDinersOverrides: next } };
      });
    },
    [updateState],
  );

  const getMealDiners = useCallback(
    (mealId: string) => state.diners.mealDinersOverrides[mealId],
    [state.diners.mealDinersOverrides],
  );

  const setOverride = useCallback(
    (key: string, override: IngredientOverride | null) => {
      updateState((current) => {
        const next = { ...current.diners.overrides };
        if (override === null) {
          delete next[key];
        } else {
          next[key] = override;
        }
        return { ...current, diners: { ...current.diners, overrides: next } };
      });
    },
    [updateState],
  );

  const clearOverridesForMeal = useCallback(
    (mealId: string) => {
      updateState((current) => {
        const next = { ...current.diners.overrides };
        Object.keys(next).forEach((key) => {
          if (key.startsWith(`${mealId}:`)) {
            delete next[key];
          }
        });
        return { ...current, diners: { ...current.diners, overrides: next } };
      });
    },
    [updateState],
  );

  const clearAllOverrides = useCallback(() => {
    updateState((current) => ({
      ...current,
      diners: { ...current.diners, overrides: {}, mealDinersOverrides: {} },
    }));
  }, [updateState]);

  const getOverride = useCallback(
    (key: string) => state.diners.overrides[key],
    [state.diners.overrides],
  );

  const isChecked = useCallback(
    (key: string) => Boolean(state.shopping.checked[key]),
    [state.shopping.checked],
  );

  const toggleItem = useCallback(
    (key: string) => {
      updateState((current) => ({
        ...current,
        shopping: {
          ...current.shopping,
          checked: { ...current.shopping.checked, [key]: !current.shopping.checked[key] },
        },
      }));
    },
    [updateState],
  );

  const setChecked = useCallback(
    (key: string, value: boolean) => {
      updateState((current) => ({
        ...current,
        shopping: {
          ...current.shopping,
          checked: { ...current.shopping.checked, [key]: value },
        },
      }));
    },
    [updateState],
  );

  const clearAllChecked = useCallback(() => {
    updateState((current) => ({
      ...current,
      shopping: { ...current.shopping, checked: {} },
    }));
  }, [updateState]);

  const checkAll = useCallback(() => {
    updateState((current) => {
      const next: CheckedItemsMap = {};
      for (const key of Object.keys(ALL_KEYS)) {
        next[key] = true;
      }
      return { ...current, shopping: { ...current.shopping, checked: next } };
    });
  }, [updateState]);

  const setHidePurchased = useCallback(
    (value: boolean) => {
      updateState((current) => ({
        ...current,
        shopping: { ...current.shopping, hidePurchased: value },
      }));
    },
    [updateState],
  );

  const setShopFilter = useCallback(
    (shop: string | null) => {
      updateState((current) => ({
        ...current,
        shopping: { ...current.shopping, shopFilter: shop },
      }));
    },
    [updateState],
  );

  const setPeriodFilter = useCallback(
    (period: PromoPeriodFilter | null) => {
      updateState((current) => ({
        ...current,
        shopping: { ...current.shopping, periodFilter: period },
      }));
    },
    [updateState],
  );

  const setPurchase = useCallback(
    (key: string, purchase: ActualPurchase | null) => {
      updateState((current) => {
        const next = { ...current.purchases };
        if (purchase === null) {
          delete next[key];
        } else {
          next[key] = purchase;
        }
        return { ...current, purchases: next };
      });
    },
    [updateState],
  );

  const getPurchase = useCallback(
    (key: string) => state.purchases[key],
    [state.purchases],
  );

  const clearAllPurchases = useCallback(() => {
    updateState((current) => ({ ...current, purchases: {} }));
  }, [updateState]);

  const checkedCount = useMemo(
    () => Object.keys(ALL_KEYS).filter((key) => state.shopping.checked[key]).length,
    [state.shopping.checked],
  );

  const totalSpent = useMemo(
    () => Object.values(state.purchases).reduce((sum, p) => sum + (p.price ?? 0), 0),
    [state.purchases],
  );

  const value = useMemo(
    () => ({
      isHydrated,
      state,
      exportBackup,
      importBackup,
      coefficient: state.diners.coefficient,
      mealDinersOverrides: state.diners.mealDinersOverrides,
      overrides: state.diners.overrides,
      setCoefficient,
      setMealDiners,
      getMealDiners,
      setOverride,
      clearOverridesForMeal,
      clearAllOverrides,
      getOverride,
      checked: state.shopping.checked,
      totalCount: TOTAL_COUNT,
      checkedCount,
      hidePurchased: state.shopping.hidePurchased,
      shopFilter: state.shopping.shopFilter,
      periodFilter: state.shopping.periodFilter,
      isChecked,
      toggleItem,
      setChecked,
      clearAllChecked,
      checkAll,
      setHidePurchased,
      setShopFilter,
      setPeriodFilter,
      purchases: state.purchases,
      setPurchase,
      getPurchase,
      clearAllPurchases,
      totalSpent,
    }),
    [
      isHydrated,
      state,
      exportBackup,
      importBackup,
      setCoefficient,
      setMealDiners,
      getMealDiners,
      setOverride,
      clearOverridesForMeal,
      clearAllOverrides,
      getOverride,
      checkedCount,
      isChecked,
      toggleItem,
      setChecked,
      clearAllChecked,
      checkAll,
      setHidePurchased,
      setShopFilter,
      setPeriodFilter,
      setPurchase,
      getPurchase,
      clearAllPurchases,
      totalSpent,
    ],
  );

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-camp-bg">
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text className="mt-3 text-sm text-camp-muted">Načítám uložená data…</Text>
      </View>
    );
  }

  return <LocalDataContext.Provider value={value}>{children}</LocalDataContext.Provider>;
}

function useLocalData() {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error('useLocalData must be used within LocalDataProvider');
  }
  return context;
}

export function useDiners() {
  const ctx = useLocalData();
  return {
    coefficient: ctx.coefficient,
    mealDinersOverrides: ctx.mealDinersOverrides,
    overrides: ctx.overrides,
    isLoading: !ctx.isHydrated,
    setCoefficient: ctx.setCoefficient,
    setMealDiners: ctx.setMealDiners,
    getMealDiners: ctx.getMealDiners,
    setOverride: ctx.setOverride,
    clearOverridesForMeal: ctx.clearOverridesForMeal,
    clearAllOverrides: ctx.clearAllOverrides,
    getOverride: ctx.getOverride,
  };
}

export function useShopping() {
  const ctx = useLocalData();
  return {
    checked: ctx.checked,
    isLoading: !ctx.isHydrated,
    totalCount: ctx.totalCount,
    checkedCount: ctx.checkedCount,
    hidePurchased: ctx.hidePurchased,
    shopFilter: ctx.shopFilter,
    periodFilter: ctx.periodFilter,
    isChecked: ctx.isChecked,
    toggleItem: ctx.toggleItem,
    setChecked: ctx.setChecked,
    clearAllChecked: ctx.clearAllChecked,
    checkAll: ctx.checkAll,
    setHidePurchased: ctx.setHidePurchased,
    setShopFilter: ctx.setShopFilter,
    setPeriodFilter: ctx.setPeriodFilter,
  };
}

export function usePurchases() {
  const ctx = useLocalData();
  return {
    purchases: ctx.purchases,
    isLoading: !ctx.isHydrated,
    setPurchase: ctx.setPurchase,
    getPurchase: ctx.getPurchase,
    clearAll: ctx.clearAllPurchases,
    totalSpent: ctx.totalSpent,
  };
}

export function useLocalBackup() {
  const ctx = useLocalData();
  return {
    exportBackup: ctx.exportBackup,
    importBackup: ctx.importBackup,
    savedAt: ctx.state.savedAt,
  };
}
