import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const CustomInput = memo(({ label, error, ...props }: CustomInputProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            color: colors.textPrimary,
            borderColor: error ? colors.bad : colors.border,
          },
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error ? (
        <Text style={[styles.errorText, { color: colors.bad }]}>{error}</Text>
      ) : null}
    </View>
  );
});

CustomInput.displayName = 'CustomInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
