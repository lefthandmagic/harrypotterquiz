import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/contexts/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Add global reset function for development
    if (__DEV__) {
      (global as any).resetWizardingApp = async () => {
        try {
          await AsyncStorage.multiRemove(['userData', 'isFirstTime', 'houseCompetitionData', 'appInstallDate']);
          console.log('🧙‍♂️ Session reset! Reloading app...');
          // Force reload for web
          if (typeof window !== 'undefined') {
            setTimeout(() => window.location.reload(), 100);
          }
        } catch (error) {
          console.error('Error resetting session:', error);
        }
      };
      
      (global as any).resetHouseCompetition = async () => {
        try {
          await AsyncStorage.removeItem('houseCompetitionData');
          console.log('🏆 House competition reset! Visit the House Cup to see new standings.');
        } catch (error) {
          console.error('Error resetting house competition:', error);
        }
      };
      console.log('🧙‍♂️ Developer mode active! Type resetWizardingApp() to reset your session.');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </UserProvider>
    </SafeAreaProvider>
  );
}
