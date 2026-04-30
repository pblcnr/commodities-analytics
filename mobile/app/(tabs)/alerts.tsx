import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';
import { getAlerts, AlertModel, deleteAlert, toggleAlertStatus } from '../../src/services/commodityService';
import { Ionicons } from '@expo/vector-icons';
import { AlertCard } from '../../src/components/features/AlertCard';

export default function AlertsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertModel[]>([]);

  const loadAlerts = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteAlert(id);
    loadAlerts();
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    await toggleAlertStatus(id);
    loadAlerts();
  }, []);

  const renderItem = useCallback(({ item }: { item: AlertModel }) => (
    <AlertCard item={item} onToggle={handleToggle} onDelete={handleDelete} />
  ), [handleToggle, handleDelete]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/create-alert')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  footer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  channelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(150,150,150,0.1)' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }
});
