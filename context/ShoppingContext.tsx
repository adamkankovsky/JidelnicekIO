import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { INGREDIENT_CATEGORIES } from '@/data/ingredients';
import { getShoppingItemKey } from '@/utils/shopping';

const CHECKED_KEY = '@jidelnicek/shopping-checked';
const HIDE_PURCHASED_KEY = '@jidelnicek/hide-purchased';

export type CheckedItemsMap = Record<string, boolean>;

interface ShoppingContextValue {
  checked: CheckedItemsMap;
  isLoading: boolean;
  totalCount: number;
  checkedCount: number;
  hidePurchased: boolean;
  isChecked: (key: string) => boolean;
  toggleItem: (key: string) => void;
  setChecked: (key: string, value: boolean) => void;
  clearAllChecked: () => void;
  checkAll: () => void;
  setHidePurchased: (value: boolean) => void;
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

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

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [checked, setCheckedState] = useState<CheckedItemsMap>({});
  const [hidePurchased, setHidePurchasedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [storedChecked, storedHide] = await Promise.all([
          AsyncStorage.getItem(CHECKED_KEY),
          AsyncStorage.getItem(HIDE_PURCHASED_KEY),
        ]);
        if (storedChecked) {
          setCheckedState(JSON.parse(storedChecked) as CheckedItemsMap);
        }
        if (storedHide) {
          setHidePurchasedState(JSON.parse(storedHide) as boolean);
        }
      } catch (error) {
        console.warn('Failed to load shopping checklist', error);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const persist = useCallback(async (next: CheckedItemsMap) => {
    setCheckedState(next);
    try {
      await AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist shopping checklist', error);
    }
  }, []);

  const isChecked = useCallback((key: string) => Boolean(checked[key]), [checked]);

  const toggleItem = useCallback(
    (key: string) => {
      const next = { ...checked, [key]: !checked[key] };
      persist(next);
    },
    [checked, persist],
  );

  const setChecked = useCallback(
    (key: string, value: boolean) => {
      const next = { ...checked, [key]: value };
      persist(next);
    },
    [checked, persist],
  );

  const clearAllChecked = useCallback(() => {
    persist({});
  }, [persist]);

  const checkAll = useCallback(() => {
    const next: CheckedItemsMap = {};
    for (const key of Object.keys(ALL_KEYS)) {
      next[key] = true;
    }
    persist(next);
  }, [persist]);

  const setHidePurchased = useCallback(async (value: boolean) => {
    setHidePurchasedState(value);
    try {
      await AsyncStorage.setItem(HIDE_PURCHASED_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to persist hide-purchased preference', error);
    }
  }, []);

  const checkedCount = useMemo(
    () => Object.keys(ALL_KEYS).filter((key) => checked[key]).length,
    [checked],
  );

  const value = useMemo(
    () => ({
      checked,
      isLoading,
      totalCount: TOTAL_COUNT,
      checkedCount,
      hidePurchased,
      isChecked,
      toggleItem,
      setChecked,
      clearAllChecked,
      checkAll,
      setHidePurchased,
    }),
    [checked, isLoading, checkedCount, hidePurchased, isChecked, toggleItem, setChecked, clearAllChecked, checkAll, setHidePurchased],
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within ShoppingProvider');
  }
  return context;
}
