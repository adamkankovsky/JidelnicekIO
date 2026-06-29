import { Pressable, Text, TextInput, View } from 'react-native';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberInput({ label, value, onChange, min = 0, max = 999 }: NumberInputProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-camp-muted">{label}</Text>
      <View className="flex-row items-center">
        <Pressable
          onPress={decrement}
          className="h-12 w-12 items-center justify-center rounded-l-xl bg-camp-accent active:opacity-70">
          <Text className="text-2xl font-bold text-camp-primary">−</Text>
        </Pressable>
        <TextInput
          className="h-12 flex-1 border-y border-camp-accent bg-white text-center text-xl font-semibold text-camp-text"
          keyboardType="number-pad"
          value={String(value)}
          onChangeText={(text) => {
            const parsed = parseInt(text.replace(/\D/g, ''), 10);
            if (!Number.isNaN(parsed)) {
              onChange(Math.min(max, Math.max(min, parsed)));
            } else if (text === '') {
              onChange(min);
            }
          }}
        />
        <Pressable
          onPress={increment}
          className="h-12 w-12 items-center justify-center rounded-r-xl bg-camp-accent active:opacity-70">
          <Text className="text-2xl font-bold text-camp-primary">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
