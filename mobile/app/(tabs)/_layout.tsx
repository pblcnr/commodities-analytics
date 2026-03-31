import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { BackButton } from '../../src/components/BackButton';

export default function TabLayout() {
  const { colors, toggleTheme, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.cardBackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.textPrimary,
          headerLeft: () => <BackButton fallbackPath="/" />,
          headerRight: () => (
            <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
              <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 24 : 16,
            left: 20,
            right: 20,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            backgroundColor: isDark ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)',
            borderRadius: 24,
            height: 64,
            paddingBottom: Platform.OS === 'ios' ? 16 : 8,
            paddingTop: 8,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="purchases"
          options={{
            title: 'Compras',
            tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alertas',
            tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
