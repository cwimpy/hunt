import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import NewHuntScreen from './src/screens/NewHuntScreen';
import HuntDetailsScreen from './src/screens/HuntDetailsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PatternsScreen from './src/screens/PatternsScreen';

// IMPORTANT: Disable native screens - this fixes the type error
enableScreens(false);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Today') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Patterns') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Patterns" component={PatternsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewHunt"
          component={NewHuntScreen}
          options={{
            title: 'Log New Hunt',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="HuntDetails"
          component={HuntDetailsScreen}
          options={{ title: 'Hunt Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
