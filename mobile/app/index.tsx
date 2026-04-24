import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/stores/useAuthStore';
import { CustomButton } from '../src/components/ui/CustomButton';
import { CustomInput } from '../src/components/ui/CustomInput';
import { loginApi } from '../src/services/auth';
export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await loginApi(email, password);
      login(data.accessToken, data.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Falha no Login', error.message || 'Ocorreu um erro ao tentar conectar.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: isDark ? '#000' : '#888' }]}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Commodities Analytics</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Previsões inteligentes</Text>
          </View>

          <CustomInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.spacer} />

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 10 }} />
          ) : (
            <CustomButton title="Entrar" onPress={handleLogin} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  card: {
    padding: 32,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  spacer: {
    height: 12,
  }
});
