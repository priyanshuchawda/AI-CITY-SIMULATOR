import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar } from 'react-native';
import Dashboard from './src/components/Dashboard';
import CityView from './src/components/CityView';
import CityActions from './src/components/CityActions';
import AIMayorDashboard from './src/components/AIMayorDashboard';
import CityControls from './src/components/CityControls';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="CityView" component={CityView} />
          <Stack.Screen name="CityActions" component={CityActions} />
          <Stack.Screen name="AIMayorDashboard" component={AIMayorDashboard} />
          <Stack.Screen name="CityControls" component={CityControls} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;