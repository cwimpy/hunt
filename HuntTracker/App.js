import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import HomeScreenSimple from './src/screens/HomeScreenSimple';

// Disable native screens to use JS-only implementation
enableScreens(false);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={HomeScreenSimple}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
