import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function MladsitaborTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6D28D9',
        tabBarInactiveTintColor: '#8B5CF6',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#EDE9FE' },
        headerStyle: { backgroundColor: '#FAFAF9' },
        headerTintColor: '#3B0764',
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nákup',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Denní nákup',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'bag.fill', android: 'local_grocery_store', web: 'local_grocery_store' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Nastavení',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
