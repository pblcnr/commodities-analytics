import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { getCommodities, Commodity } from '../../src/services/mockData';
import { useTheme } from '../../src/theme/ThemeContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [data, setData] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const commodities = await getCommodities();
    setData(commodities);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRecColor = (rec: string) => {
    switch(rec) {
      case 'good': return { bg: colors.good, text: colors.goodText, label: 'Bom para Compra' };
      case 'regular': return { bg: colors.regular, text: colors.regularText, label: 'Momento Regular' };
      case 'bad': return { bg: colors.bad, text: colors.badText, label: 'Aguarde' };
      default: return { bg: colors.border, text: colors.textSecondary, label: '' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const recStyle = getRecColor(item.recommendation);
          return (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push(`/commodity/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: recStyle.bg }]}>
                  <Text style={[styles.badgeText, { color: recStyle.text }]}>{recStyle.label}</Text>
                </View>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.textPrimary }]}>R$ {item.currentPrice.toFixed(2)}</Text>
                <Text style={[styles.unit, { color: colors.textSecondary }]}> / {item.unit}</Text>
              </View>

              <View style={styles.forecastRow}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Previsão (30d): </Text>
                <Text style={{ fontWeight: '600', color: item.forecastPercent > 0 ? colors.accentDark : colors.badText }}>
                  {item.forecastPercent > 0 ? '+' : ''}{item.forecastPercent}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  price: { fontSize: 24, fontWeight: '800' },
  unit: { fontSize: 14 },
  forecastRow: { flexDirection: 'row', alignItems: 'center' }
});
