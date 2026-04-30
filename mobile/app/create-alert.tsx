import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { createAlert } from '../src/services/commodityService';
import { BackButton } from '../src/components/BackButton';
import { CustomInput } from '../src/components/ui/CustomInput';
import { CustomButton } from '../src/components/ui/CustomButton';

export default function CreateAlertScreen() {
  const router = useRouter();
  const { commodity: initialCommodity } = useLocalSearchParams();
  const { colors } = useTheme();
  const [commodity, setCommodity] = useState((initialCommodity as string) || '');
  const [condition, setCondition] = useState('');
  const [channel, setChannel] = useState('Whatsapp');
  const [active, setActive] = useState(true);

  const handleSave = useCallback(async () => {
    if (!commodity || !condition) return;
    
    await createAlert({
      id: Math.random().toString(),
      commodityName: commodity,
      condition,
      channel,
      active
    });
    
    router.back();
  }, [commodity, condition, channel, active, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Novo Alerta', 
          headerStyle: { backgroundColor: colors.cardBackground }, 
          headerTintColor: colors.textPrimary,
          headerLeft: () => <BackButton />
        }} 
      />
      
      <CustomInput
        label="Commodity"
        placeholder="Ex: Soja"
        value={commodity}
        onChangeText={setCommodity}
      />

      <CustomInput
        label="Condição"
        placeholder="Ex: Preço cair abaixo de R$ 100"
        value={condition}
        onChangeText={setCondition}
      />

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Canal de Notificação</Text>
        <View style={styles.channels}>
          {['Whatsapp', 'Telegram', 'Email'].map(ch => (
            <TouchableOpacity 
              key={ch}
              style={[
                styles.channelBtn, 
                { 
                  backgroundColor: channel === ch ? colors.primary : colors.cardBackground,
                  borderColor: channel === ch ? colors.primary : colors.border
                }
              ]}
              onPress={() => setChannel(ch)}
            >
              <Text style={{ color: channel === ch ? '#fff' : colors.textPrimary }}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.switchGroup, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 0 }]}>Ativar Imediatamente</Text>
        <Switch value={active} onValueChange={setActive} trackColor={{ true: colors.primary }} />
      </View>

      <CustomButton title="Salvar Alerta" onPress={handleSave} />
      <CustomButton title="Cancelar" type="secondary" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 16 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  channels: { flexDirection: 'row', gap: 10 },
  channelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 30 }
});
