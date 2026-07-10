import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { useLocalBackup } from '@/context/LocalDataContext';
import { downloadTextFile } from '@/utils/downloadFile';

export default function MladsitaborSettingsScreen() {
  const { exportBackup, importBackup, savedAt } = useLocalBackup();
  const [importText, setImportText] = useState('');

  const handleBackupDownload = () => {
    const ok = downloadTextFile('mladsitabor-zaloha.json', exportBackup());
    if (!ok) {
      Alert.alert('Záloha', 'Stažení zálohy je dostupné ve webové verzi aplikace.');
    }
  };

  const handleBackupImport = () => {
    if (!importText.trim()) {
      Alert.alert('Obnovení', 'Vložte obsah zálohy.');
      return;
    }
    try {
      importBackup(importText);
      setImportText('');
      Alert.alert('Obnoveno', 'Lokální data byla načtena ze zálohy.');
    } catch {
      Alert.alert('Chyba', 'Soubor zálohy není platný JSON.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-camp-bg" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-4">
        <Text className="mb-1 text-2xl font-bold text-purple-800">Nastavení</Text>
        <Text className="mb-4 text-sm text-camp-muted">Mladší tábor — 29 dětí + 15 vedoucích</Text>

        {/* Navigation */}
        <View className="mb-5 rounded-2xl border border-purple-200 bg-white p-4">
          <Text className="mb-3 text-sm font-bold text-camp-text">Navigace</Text>
          <Link href="/(tabs)" asChild>
            <Pressable className="rounded-xl bg-camp-primary/10 py-3 active:opacity-70">
              <Text className="text-center text-sm font-semibold text-camp-primary">
                Přejít na hlavní tábor
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Backup */}
        <View className="mb-5 rounded-2xl border border-purple-200 bg-white p-4">
          <Text className="mb-3 text-sm font-bold text-camp-text">Záloha dat</Text>
          {savedAt ? (
            <Text className="mb-3 text-xs text-camp-muted">
              Poslední uložení: {new Date(savedAt).toLocaleString('cs-CZ')}
            </Text>
          ) : null}

          <Pressable
            onPress={handleBackupDownload}
            className="mb-3 rounded-xl bg-purple-100 py-3 active:opacity-70">
            <Text className="text-center text-sm font-semibold text-purple-700">
              Stáhnout zálohu (JSON)
            </Text>
          </Pressable>

          <Text className="mb-2 text-xs font-bold text-camp-text">Obnovit ze zálohy</Text>
          <TextInput
            value={importText}
            onChangeText={setImportText}
            placeholder="Vložte obsah JSON zálohy…"
            multiline
            className="mb-3 min-h-[80px] rounded-xl border border-purple-200 bg-camp-bg p-3 text-sm text-camp-text"
          />
          <Pressable
            onPress={handleBackupImport}
            className="rounded-xl bg-purple-700 py-3 active:opacity-70">
            <Text className="text-center text-sm font-semibold text-white">Obnovit data</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
