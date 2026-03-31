import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCommodityById, Commodity } from '../../src/services/mockData';
import { useTheme } from '../../src/theme/ThemeContext';
import { LineChart } from 'react-native-chart-kit';
import { BackButton } from '../../src/components/BackButton';

export default function CommodityDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [data, setData] = useState<Commodity | null>(null);

  useEffect(() => {
    if (id) {
      getCommodityById(id as string).then(res => {
        if (res) setData(res);
      });
    }
  }, [id]);

  if (!data) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const chartData = {
    labels: data.history.map(h => h.date.split('-')[1] + '/' + h.date.split('-')[0].slice(-2)),
    datasets: [
      {
        data: data.history.map(h => h.price)
      }
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: data.name, 
          headerStyle: { backgroundColor: colors.cardBackground }, 
          headerTintColor: colors.textPrimary,
          headerLeft: () => <BackButton />
        }} 
      />
      
      <View style={{ padding: 20 }}>
        <Text style={[styles.priceTitle, { color: colors.textPrimary }]}>
          R$ {data.currentPrice.toFixed(2)}
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>por {data.unit}</Text>

        <View style={[styles.chartCard, { backgroundColor: colors.cardBackground, shadowColor: isDark ? '#000' : '#888' }]}>
          <Text style={{ color: colors.textPrimary, fontWeight: 'bold', marginBottom: 16 }}>Evolução de Preço</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 80} // from react-native padding
            height={220}
            yAxisLabel="R$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: colors.cardBackground,
              backgroundGradientFrom: colors.cardBackground,
              backgroundGradientTo: colors.cardBackground,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // primary color
              labelColor: (opacity = 1) => colors.textSecondary,
              style: { borderRadius: 16 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: colors.primaryDark }
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary }}>Recomendação da IA</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>
            {data.recommendation === 'good' ? 'Boa hora para comprar' : data.recommendation === 'regular' ? 'Compra regular, avalie a necessidade' : 'Momento ruim, aguarde'}
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push({ pathname: '/create-alert', params: { commodity: data.name } })}
          >
            <Ionicons name="notifications-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Criar Alerta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(tabs)/purchases')}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>Registrar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  priceTitle: { fontSize: 36, fontWeight: '800' },
  chartCard: { padding: 20, borderRadius: 20, elevation: 5, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, marginBottom: 20 },
  infoCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  actionContainer: { flexDirection: 'row', gap: 12, marginTop: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' }
});
