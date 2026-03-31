import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export function BackButton({ fallbackPath = '/' }: { fallbackPath?: string }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(fallbackPath);
        }
      }}
    >
      <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
