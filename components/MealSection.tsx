import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useDiners } from '@/context/DinersContext';
import type { CampDay, Meal } from '@/data/types';
import { formatDiners, getMealDiners, getTotalDiners, MEAL_TYPE_LABELS } from '@/data/types';
import { useScaledMeal } from '@/hooks/useScaledIngredients';
import { formatQuantity } from '@/utils/scaling';

interface IngredientRowProps {
  day: CampDay;
  meal: Meal;
  ingredientKey: string;
  name: string;
  unit: string;
  scaledQuantity: number | null;
  displayText: string;
  isOverridden: boolean;
  canEdit: boolean;
  checkGlutenFree?: boolean;
}

export function IngredientRow({
  day,
  meal,
  ingredientKey,
  name,
  unit,
  scaledQuantity,
  displayText,
  isOverridden,
  canEdit,
  checkGlutenFree,
}: IngredientRowProps) {
  const { setOverride } = useDiners();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(scaledQuantity !== null ? String(scaledQuantity) : '');

  const save = () => {
    const parsed = parseFloat(draft.replace(',', '.'));
    if (!Number.isNaN(parsed)) {
      setOverride(ingredientKey, {
        quantity: parsed,
        displayText: unit ? `${name} ${formatQuantity(parsed, unit)}` : name,
      });
    }
    setEditing(false);
  };

  const reset = () => {
    setOverride(ingredientKey, null);
    setEditing(false);
  };

  if (!canEdit || scaledQuantity === null) {
    return (
      <View className="flex-row items-start border-b border-camp-accent/40 py-2">
        <Text className="flex-1 text-sm text-camp-text">
          • {displayText}
          {checkGlutenFree ? (
            <Text className="text-xs text-amber-600"> (ověřit BL)</Text>
          ) : null}
        </Text>
      </View>
    );
  }

  if (editing) {
    return (
      <View className="border-b border-camp-accent/40 py-2">
        <Text className="mb-1 text-sm font-medium text-camp-text">{name}</Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 rounded-lg border border-camp-secondary bg-white px-3 py-2 text-base text-camp-text"
            keyboardType="decimal-pad"
            value={draft}
            onChangeText={setDraft}
            autoFocus
            onSubmitEditing={save}
          />
          {unit ? <Text className="text-sm text-camp-muted">{unit}</Text> : null}
          <Pressable onPress={save} className="rounded-lg bg-camp-primary px-3 py-2">
            <Text className="text-sm font-semibold text-white">OK</Text>
          </Pressable>
          <Pressable onPress={() => setEditing(false)} className="rounded-lg bg-camp-accent px-3 py-2">
            <Text className="text-sm text-camp-primary">✕</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        setDraft(String(scaledQuantity));
        setEditing(true);
      }}
      onLongPress={isOverridden ? reset : undefined}
      className="flex-row items-center border-b border-camp-accent/40 py-2 active:bg-camp-accent/30">
      <Text className={`flex-1 text-sm ${isOverridden ? 'font-semibold text-camp-warm' : 'text-camp-text'}`}>
        • {displayText}
        {checkGlutenFree ? (
          <Text className="text-xs text-amber-600"> (ověřit BL)</Text>
        ) : null}
      </Text>
      {isOverridden ? (
        <Pressable onPress={reset} hitSlop={8}>
          <Text className="text-xs text-camp-muted">reset</Text>
        </Pressable>
      ) : (
        <Text className="text-xs text-camp-muted">upravit</Text>
      )}
    </Pressable>
  );
}

interface MealSectionProps {
  day: CampDay;
  meal: Meal;
}

function MealDinersRow({ day, meal }: MealSectionProps) {
  const { getMealDiners: getMealDinersOverride, setMealDiners } = useDiners();
  const baseDiners = getMealDiners(meal, day);
  const override = getMealDinersOverride(meal.id);
  const effective = override ?? baseDiners;
  const [editing, setEditing] = useState(false);
  const [draftChildren, setDraftChildren] = useState(String(effective.children));
  const [draftAdults, setDraftAdults] = useState(String(effective.adults));

  const save = () => {
    const c = parseInt(draftChildren, 10);
    const a = parseInt(draftAdults, 10);
    if (!Number.isNaN(c) && !Number.isNaN(a)) {
      if (c === baseDiners.children && a === baseDiners.adults) {
        setMealDiners(meal.id, null);
      } else {
        setMealDiners(meal.id, { children: c, adults: a });
      }
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <View className="flex-row items-center gap-2 px-4 py-2 bg-camp-accent/10">
        <TextInput
          className="w-12 rounded border border-camp-accent bg-white px-2 py-1 text-center text-sm"
          keyboardType="number-pad"
          value={draftChildren}
          onChangeText={setDraftChildren}
          autoFocus
        />
        <Text className="text-xs text-camp-muted">D</Text>
        <TextInput
          className="w-12 rounded border border-camp-accent bg-white px-2 py-1 text-center text-sm"
          keyboardType="number-pad"
          value={draftAdults}
          onChangeText={setDraftAdults}
        />
        <Text className="text-xs text-camp-muted">V</Text>
        <Pressable onPress={save} className="rounded bg-camp-primary px-2 py-1">
          <Text className="text-xs font-semibold text-white">OK</Text>
        </Pressable>
        <Pressable onPress={() => setEditing(false)} className="rounded bg-camp-accent px-2 py-1">
          <Text className="text-xs text-camp-primary">✕</Text>
        </Pressable>
        {override ? (
          <Pressable onPress={() => { setMealDiners(meal.id, null); setEditing(false); }} className="rounded bg-camp-warm/20 px-2 py-1">
            <Text className="text-xs text-camp-warm">reset</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        setDraftChildren(String(effective.children));
        setDraftAdults(String(effective.adults));
        setEditing(true);
      }}
      className="flex-row items-center gap-2 px-4 py-1.5 active:bg-camp-accent/20">
      <Text className={`text-xs ${override ? 'font-semibold text-camp-warm' : 'text-camp-muted'}`}>
        {formatDiners(effective)} · {getTotalDiners(effective)} osob
      </Text>
      <Text className="text-xs text-camp-muted/50">✎</Text>
    </Pressable>
  );
}

export function MealSection({ day, meal }: MealSectionProps) {
  const { clearOverridesForMeal } = useDiners();
  const scaledIngredients = useScaledMeal(day, meal);
  const hasOverrides = scaledIngredients.some((i) => i.isOverridden);
  const [showRecipe, setShowRecipe] = useState(false);

  if (!meal.label && scaledIngredients.length === 0) {
    return null;
  }

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-camp-accent bg-white">
      <View className="flex-row items-center justify-between bg-camp-secondary/20 px-4 py-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xs font-bold uppercase tracking-wide text-camp-secondary">
              {MEAL_TYPE_LABELS[meal.type]}
            </Text>
            {meal.glutenWarning ? (
              <View className="rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5">
                <Text className="text-xs font-bold text-amber-700">BL ⚠</Text>
              </View>
            ) : null}
          </View>
          {meal.label ? (
            <Text className="mt-0.5 text-base font-semibold text-camp-text">{meal.label}</Text>
          ) : null}
        </View>
        {hasOverrides ? (
          <Pressable onPress={() => clearOverridesForMeal(meal.id)} className="rounded-lg bg-camp-accent px-2 py-1">
            <Text className="text-xs font-medium text-camp-primary">Reset</Text>
          </Pressable>
        ) : null}
      </View>
      <MealDinersRow day={day} meal={meal} />
      {meal.glutenNote ? (
        <View className="mx-4 mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
          <Text className="text-xs font-bold text-amber-700">Bezlepkový strávník:</Text>
          <Text className="text-sm text-amber-900">{meal.glutenNote}</Text>
        </View>
      ) : null}
      <View className="px-4 py-2">
        {scaledIngredients.length > 0 ? (
          scaledIngredients.map((ing) => (
            <IngredientRow
              key={ing.key}
              day={day}
              meal={meal}
              ingredientKey={ing.key}
              name={ing.name}
              unit={ing.unit}
              scaledQuantity={ing.scaledQuantity}
              displayText={ing.displayText}
              isOverridden={ing.isOverridden}
              canEdit={ing.baseQuantity !== null}
              checkGlutenFree={ing.original.checkGlutenFree}
            />
          ))
        ) : (
          <Text className="py-2 text-sm italic text-camp-muted">Bez ingrediencí</Text>
        )}
      </View>
      {meal.recipe ? (
        <View className="border-t border-camp-accent/40">
          <Pressable
            onPress={() => setShowRecipe(!showRecipe)}
            className="flex-row items-center justify-between px-4 py-3 active:bg-camp-accent/20">
            <Text className="text-sm font-semibold text-camp-primary">Recept</Text>
            <Text className="text-xs text-camp-muted">{showRecipe ? '▲' : '▼'}</Text>
          </Pressable>
          {showRecipe ? (
            <View className="bg-camp-accent/10 px-4 pb-3">
              <Text className="text-sm leading-5 text-camp-text">{meal.recipe}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
