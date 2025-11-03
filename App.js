import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SaqueAniversarioScreen from './screens/SaqueAniversarioScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
          <Stack.Screen name="SaqueAniversario" component={SaqueAniversarioScreen} options={{ title: 'Saque-Aniversário' }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre o App' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
