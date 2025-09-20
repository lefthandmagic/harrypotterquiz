import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SortingCeremonyScreen from '../screens/SortingCeremonyScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import DailyProphetScreen from '../screens/DailyProphetScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  const { state } = useUser();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Journey') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Daily Prophet') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        headerStyle: {
          backgroundColor: '#4A148C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Journey" 
        component={HomeScreen}
        options={{ 
          title: 'Journey',
          tabBarLabel: 'Journey'
        }}
      />
      <Tab.Screen 
        name="Daily Prophet" 
        component={DailyProphetScreen}
        options={{ title: 'Daily Prophet' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Wizard Profile' }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: 'House Cup' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state, dismissWelcome } = useUser();

  if (state.isLoading) {
    return null; // You can add a loading screen here
  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.showWelcome ? (
          <Stack.Screen 
            name="Welcome" 
            options={{ headerShown: false }}
          >
            {() => <WelcomeScreen onGetStarted={dismissWelcome} />}
          </Stack.Screen>
        ) : state.isFirstTime ? (
          <Stack.Screen name="SortingCeremony" component={SortingCeremonyScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="Quiz" 
              component={QuizScreen}
              options={{ 
                headerShown: true,
                headerStyle: { backgroundColor: '#4A148C' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

