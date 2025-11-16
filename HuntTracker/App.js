import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import HomeScreenSimple from './src/screens/HomeScreenSimple';

enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreenSimple}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
