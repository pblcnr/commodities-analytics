import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertModel } from '../../services/mockData';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  item: AlertModel;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlertCard = memo(({ item, onToggle, onDelete }: Props) => {
  const { colors } = useTheme();

  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{item.commodityName}</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>{item.condition}</Text>
        </View>
        <TouchableOpacity onPress={handleToggle}>
          <Ionicons
            name={item.active ? "notifications" : "notifications-off"}
            size={24}
            color={item.active ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.channelBadge}>
          <Ionicons name="chatbubbles" size={14} color={colors.textPrimary} style={{ marginRight: 4 }} />
          <Text style={{ color: colors.textPrimary, fontSize: 12 }}>{item.channel}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={colors.badText} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

AlertCard.displayName = 'AlertCard';

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  footer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  channelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(150,150,150,0.1)' }
});
