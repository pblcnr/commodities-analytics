import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { createAlert } from '../src/services/mockData';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BackButton } from '../src/components/BackButton';

export default function CreateAlertScreen() {
  const router = useRouter();
  const { commodity: initialCommodity } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [commodity, setCommodity] = useState((initialCommodity as string) || '');
  const [condition, setCondition] = useState('');
  const [channel, setChannel] = useState('Whatsapp');
  const [active, setActive] = useState(true);

  const handleSave = async () => {
    if (!commodity || !condition) return;
    
    await createAlert({
      id: Math.random().toString(),
      commodityName: commodity,
      condition,
      channel,
      active
    });
    
    router.back();
  };

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
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Commodity</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Ex: Soja"
          placeholderTextColor={colors.textSecondary}
          value={commodity}
          onChangeText={setCommodity}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Condição</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textPrimary, borderColor: colors.border }]}
          placeholder="Ex: Preço cair abaixo de R$ 100"
          placeholderTextColor={colors.textSecondary}
          value={condition}
          onChangeText={setCondition}
        />
      </View>

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

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Salvar Alerta</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => router.back()}>
        <Text style={[styles.cancelBtnText, { color: colors.textPrimary }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 16 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
  channels: { flexDirection: 'row', gap: 10 },
  channelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 30 },
  saveBtn: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  cancelBtnText: { fontSize: 16, fontWeight: '600' }
});
