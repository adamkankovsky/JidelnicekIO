import type { CampConfig } from '@/context/LocalDataContext';
import { INGREDIENT_CATEGORIES } from './ingredients';
import { ALL_SHOPS, DEAL_OFFERS } from './deals';

export const MLADSITABOR_STORAGE_KEY = '@mladsitabor/local-state-v1';

export const MLADSITABOR_CAMP_CONFIG: CampConfig = {
  storageKey: MLADSITABOR_STORAGE_KEY,
  ingredientCategories: INGREDIENT_CATEGORIES,
  dealOffers: DEAL_OFFERS,
  allShops: ALL_SHOPS,
};
