import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#6B9080',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#D8F3DC' },
        headerStyle: { backgroundColor: '#F8FAF9' },
        headerTintColor: '#1B4332',
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jídelníček',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
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
