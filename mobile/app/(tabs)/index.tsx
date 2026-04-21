import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { getCommodities, Commodity } from '../../src/services/mockData';
import { useTheme } from '../../src/theme/ThemeContext';
import { CommodityCard } from '../../src/components/features/CommodityCard';

export default function DashboardScreen() {
  const { colors } = useTheme();
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

  const renderItem = useCallback(({ item }: { item: Commodity }) => {
    return <CommodityCard item={item} />;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        // Nota: se o card tiver altura fixa, idealmente usar getItemLayout aqui.
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
