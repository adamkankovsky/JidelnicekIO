import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { ActualPurchase, ActualPurchasesMap } from '@/data/types';

const PURCHASES_KEY = '@jidelnicek/purchases';

interface PurchaseContextValue {
  purchases: ActualPurchasesMap;
  isLoading: boolean;
  setPurchase: (key: string, purchase: ActualPurchase | null) => void;
  getPurchase: (key: string) => ActualPurchase | undefined;
  clearAll: () => void;
  totalSpent: number;
}

const PurchaseContext = createContext<PurchaseContextValue | null>(null);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchasesState] = useState<ActualPurchasesMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(PURCHASES_KEY);
        if (stored) {
          setPurchasesState(JSON.parse(stored) as ActualPurchasesMap);
        }
      } catch (error) {
        console.warn('Failed to load purchases', error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const persist = useCallback(async (next: ActualPurchasesMap) => {
    setPurchasesState(next);
    try {
      await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist purchases', error);
    }
  }, []);

  const setPurchase = useCallback(
    (key: string, purchase: ActualPurchase | null) => {
      const next = { ...purchases };
      if (purchase === null) {
        delete next[key];
      } else {
        next[key] = purchase;
      }
      persist(next);
    },
    [purchases, persist],
  );

  const getPurchase = useCallback(
    (key: string) => purchases[key],
    [purchases],
  );

  const clearAll = useCallback(() => {
    persist({});
  }, [persist]);

  const totalSpent = useMemo(
    () =>
      Object.values(purchases).reduce(
        (sum, p) => sum + (p.price ?? 0),
        0,
      ),
    [purchases],
  );

  const value = useMemo(
    () => ({ purchases, isLoading, setPurchase, getPurchase, clearAll, totalSpent }),
    [purchases, isLoading, setPurchase, getPurchase, clearAll, totalSpent],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within PurchaseProvider');
  }
  return context;
}
