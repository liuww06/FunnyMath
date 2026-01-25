import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ContentScreen } from './src/screens/ContentScreen';
import { CONTENT_REGISTRY } from '@funnymath/content';

export type RootStackParamList = {
  Home: undefined;
  Content: { contentId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'FunnyMath' }}
          />
          {CONTENT_REGISTRY.map((content) => (
            <Stack.Screen
              key={content.id}
              name={content.id as keyof RootStackParamList}
              component={ContentScreen}
              initialParams={{ contentId: content.id }}
              options={{ title: content.title }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
