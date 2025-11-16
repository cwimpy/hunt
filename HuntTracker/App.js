import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './src/screens/HomeScreen';
import NewHuntScreen from './src/screens/NewHuntScreen';
import HuntDetailsScreen from './src/screens/HuntDetailsScreen';

// IMPORTANT: Disable native screens - this fixes the type error
enableScreens(false);

const Stack = createStackNavigator();

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
          name="Home"
          component={HomeScreen}
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
