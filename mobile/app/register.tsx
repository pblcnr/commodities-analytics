import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/stores/useAuthStore';
import { CustomButton } from '../src/components/ui/CustomButton';
import { CustomInput } from '../src/components/ui/CustomInput';
import { registerApi } from '../src/services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleRegister = useCallback(async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await registerApi(name, email, password);
      // Automatically log in the user after successful registration
      login(data.accessToken, data.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Falha no Registro', error.message || 'Ocorreu um erro ao tentar registrar.');
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, login, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, shadowColor: isDark ? '#000' : '#888' }]}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Criar Conta</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Junte-se ao Commodities Analytics</Text>
          </View>

          <CustomInput
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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
            <CustomButton title="Registrar" onPress={handleRegister} />
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
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
