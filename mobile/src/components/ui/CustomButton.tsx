import React, { memo, useCallback } from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'danger';
}

export const CustomButton = memo(({ title, onPress, disabled = false, loading = false, type = 'primary' }: CustomButtonProps) => {
  const { colors, isDark } = useTheme();

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [disabled, loading, onPress]);

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled || loading) return isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0';
    
    switch (type) {
      case 'primary': return pressed ? colors.accentDark : colors.primary;
      case 'secondary': return pressed ? 'rgba(0,0,0,0.1)' : 'transparent';
      case 'danger': return pressed ? '#B71C1C' : colors.bad;
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return colors.textSecondary;
    if (type === 'secondary') return colors.textPrimary;
    return '#FFFFFF';
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderWidth: type === 'secondary' ? 1 : 0,
          borderColor: type === 'secondary' ? colors.border : 'transparent',
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.label, { color: getTextColor() }]}>{title}</Text>
      )}
    </Pressable>
  );
});

CustomButton.displayName = 'CustomButton';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
