import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';

import type { ShoppingItem } from '@/data/types';
import { useDeals } from '@/context/LocalDataContext';
import { usePurchases } from '@/context/PurchaseContext';
import { useShopping } from '@/context/ShoppingContext';
import {
  filterDeals,
  formatShoppingQuantity,
  getBestDeal,
  getDealFilterOptions,
  getEffectiveUnitPrice,
  getPackageCount,
  getPackageLabel,
  getPurchaseLineTotal,
  getShoppingItemKey,
  isUsingDealPrice,
  parseShoppingMeasure,
} from '@/utils/shopping';

interface ShoppingItemRowProps {
  category: string;
  item: ShoppingItem;
  shopFilter: string[];
  periodFilter: { from: string; to: string } | null;
}

export function ShoppingItemRow({ category, item, shopFilter, periodFilter }: ShoppingItemRowProps) {
  const { isChecked, toggleItem } = useShopping();
  const { getPurchase, setPurchase } = usePurchases();
  const { dealOffers, allShops } = useDeals();
  const key = getShoppingItemKey(category, item);
  const purchased = isChecked(key);
  const quantity = formatShoppingQuantity(item);
  const allDeals = dealOffers[key] ?? [];
  const purchase = getPurchase(key);
  const dealOptions = getDealFilterOptions(shopFilter, periodFilter);
  const estimateDeals = filterDeals(allDeals, dealOptions);
  const bestDeal = getBestDeal(allDeals, dealOptions);
  const lineTotal = getPurchaseLineTotal(item, purchase, allDeals, dealOptions);
  const unitPrice = getEffectiveUnitPrice(purchase, allDeals, dealOptions);
  const needed = parseShoppingMeasure(item);
  const packageCount = purchase?.price != null ? needed.amount : (getPackageCount(item, bestDeal) ?? needed.amount);
  const priceUnitLabel = purchase?.price != null ? item.unit : getPackageLabel(bestDeal);
  const fromDeal = isUsingDealPrice(purchase, allDeals, dealOptions);
  const displayShop = purchase?.shop || bestDeal?.shop || '';

  const [editVisible, setEditVisible] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [editShop, setEditShop] = useState('');

  const hasFilter = shopFilter.length > 0 || periodFilter !== null;
  const validDeals = filterDeals(allDeals, { onlyValid: true });
  const highlightedDeals = filterDeals(allDeals, dealOptions);
  const highlightedKeys = new Set(
    highlightedDeals.map((deal) => `${deal.shop}|${deal.validFrom}|${deal.validTo}|${deal.price}`),
  );
  const otherDeals = hasFilter
    ? validDeals.filter(
        (deal) => !highlightedKeys.has(`${deal.shop}|${deal.validFrom}|${deal.validTo}|${deal.price}`),
      )
    : [];

  const openEdit = () => {
    setEditPrice(purchase?.price != null ? String(purchase.price) : '');
    setEditShop(purchase?.shop ?? bestDeal?.shop ?? '');
    setEditVisible(true);
  };

  const saveEdit = () => {
    const priceNum = editPrice ? parseFloat(editPrice.replace(',', '.')) : null;
    if (editPrice && (priceNum === null || isNaN(priceNum))) {
      Alert.alert('Chyba', 'Zadejte platnou cenu.');
      return;
    }
    if (priceNum === null && !editShop) {
      setPurchase(key, null);
    } else {
      setPurchase(key, { price: priceNum, shop: editShop });
    }
    setEditVisible(false);
  };

  const formatDate = (iso: string) => {
    const [, m, d] = iso.split('-');
    return `${parseInt(d)}.${parseInt(m)}.`;
  };

  return (
    <>
      <Pressable
        onPress={() => toggleItem(key)}
        className={`border-b border-camp-accent/40 px-4 py-3 active:bg-camp-accent/30 ${
          purchased ? 'bg-camp-accent/20' : 'bg-white'
        }`}>
        <View className="flex-row items-center">
          <View
            className={`mr-3 h-6 w-6 items-center justify-center rounded-md border-2 ${
              purchased ? 'border-camp-primary bg-camp-primary' : 'border-camp-muted bg-white'
            }`}>
            {purchased ? <Text className="text-xs font-bold text-white">✓</Text> : null}
          </View>

          <View className="flex-1">
            <Text
              className={`text-base ${purchased ? 'text-camp-muted line-through' : 'font-medium text-camp-text'}`}>
              {item.name}
            </Text>
            {quantity ? (
              <Text className={`mt-0.5 text-sm ${purchased ? 'text-camp-muted/80' : 'text-camp-secondary'}`}>
                {quantity}
              </Text>
            ) : null}
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              openEdit();
            }}
            hitSlop={8}
            className="ml-2 rounded-lg border border-camp-accent px-2.5 py-1.5 active:bg-camp-accent/40">
            <Text className="text-xs text-camp-primary">
              {purchased && lineTotal != null
                ? `${Math.round(lineTotal)} Kč`
                : unitPrice != null
                  ? `~${Math.round(lineTotal ?? unitPrice * packageCount)} Kč`
                  : '+ Cena'}
            </Text>
          </Pressable>
        </View>

        {/* Deal offers */}
        {validDeals.length > 0 ? (
          <View className="ml-9 mt-2">
            {highlightedDeals.map((deal, i) => (
              <View key={`h-${deal.shop}-${deal.validFrom}-${i}`} className="mb-1 flex-row flex-wrap items-center">
                <Text className="mr-1 rounded bg-camp-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-camp-primary">
                  {deal.shop}
                </Text>
                <Text className="mr-1 text-[10px] text-camp-muted">
                  {formatDate(deal.validFrom)}–{formatDate(deal.validTo)}
                </Text>
                <Text className="text-xs font-bold text-camp-warm">{deal.price}</Text>
                <Text className="ml-1 text-[10px] text-camp-muted">({deal.packaging})</Text>
              </View>
            ))}
            {/* Other deals (not matching filter) shown dimmed */}
            {otherDeals.map((deal, i) => (
              <View key={`o-${deal.shop}-${deal.validFrom}-${i}`} className="mb-1 flex-row flex-wrap items-center opacity-40">
                <Text className="mr-1 rounded bg-camp-muted/10 px-1.5 py-0.5 text-[10px] font-semibold text-camp-muted">
                  {deal.shop}
                </Text>
                <Text className="mr-1 text-[10px] text-camp-muted">
                  {formatDate(deal.validFrom)}–{formatDate(deal.validTo)}
                </Text>
                <Text className="text-xs font-semibold text-camp-muted">{deal.price}</Text>
                <Text className="ml-1 text-[10px] text-camp-muted">({deal.packaging})</Text>
              </View>
            ))}
            {(highlightedDeals[0] || estimateDeals[0])?.note ? (
              <Text className="mt-0.5 text-[10px] italic text-camp-muted">
                {(highlightedDeals[0] || estimateDeals[0]).note}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Actual purchase info */}
        {(purchased || purchase) && lineTotal != null ? (
          <View className="ml-9 mt-1">
            <Text className="text-xs font-semibold text-camp-primary">
              Koupeno{fromDeal ? ' (leták)' : ''}:{' '}
              {unitPrice != null
                ? `${unitPrice} Kč/${priceUnitLabel} × ${packageCount} = ${Math.round(lineTotal)} Kč`
                : '—'}
            </Text>
            {displayShop ? (
              <Text className="mt-0.5 text-xs text-camp-muted">v {displayShop}</Text>
            ) : null}
          </View>
        ) : null}
      </Pressable>

      {/* Edit modal */}
      <Modal visible={editVisible} transparent animationType="fade" onRequestClose={() => setEditVisible(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40" onPress={() => setEditVisible(false)}>
          <Pressable className="w-80 rounded-2xl bg-white p-5" onPress={(e) => e.stopPropagation()}>
            <Text className="mb-4 text-center text-lg font-bold text-camp-text">{item.name}</Text>

            <Text className="mb-1 text-sm text-camp-muted">
              Cena za jednotku ({item.unit}) v Kč
            </Text>
            <Text className="mb-2 text-xs text-camp-muted">
              Potřeba: {quantity}
              {fromDeal && bestDeal
                ? ` → ${packageCount} ${getPackageLabel(bestDeal)} × ${unitPrice ?? '?'} Kč`
                : ` → ${packageCount} × cena`}
            </Text>
            <TextInput
              value={editPrice}
              onChangeText={setEditPrice}
              placeholder={`např. ${(highlightedDeals[0] || estimateDeals[0])?.price.replace(/[^\d,.]/g, '') || '9,90'}`}
              keyboardType="decimal-pad"
              className="mb-4 rounded-xl border border-camp-accent px-4 py-3 text-base text-camp-text"
            />

            <Text className="mb-1 text-sm text-camp-muted">Obchod</Text>
            <View className="mb-2 flex-row flex-wrap gap-2">
              {allShops.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setEditShop(editShop === s ? '' : s)}
                  className={`rounded-lg border px-3 py-1.5 ${
                    editShop === s ? 'border-camp-primary bg-camp-primary' : 'border-camp-accent bg-white'
                  }`}>
                  <Text className={`text-sm ${editShop === s ? 'font-semibold text-white' : 'text-camp-text'}`}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={allShops.includes(editShop) ? '' : editShop}
              onChangeText={(v) => setEditShop(v)}
              placeholder="Jiný obchod…"
              className="mb-4 rounded-xl border border-camp-accent px-4 py-3 text-base text-camp-text"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setEditVisible(false)}
                className="flex-1 items-center rounded-xl border border-camp-accent py-3">
                <Text className="font-semibold text-camp-muted">Zrušit</Text>
              </Pressable>
              <Pressable
                onPress={saveEdit}
                className="flex-1 items-center rounded-xl bg-camp-primary py-3">
                <Text className="font-semibold text-white">Uložit</Text>
              </Pressable>
            </View>

            {purchase ? (
              <Pressable
                onPress={() => {
                  setPurchase(key, null);
                  setEditVisible(false);
                }}
                className="mt-3 items-center py-2">
                <Text className="text-sm text-red-500">Smazat záznam</Text>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
