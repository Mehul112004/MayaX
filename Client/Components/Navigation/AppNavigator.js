import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartScreen from '../Screens/StartScreen';
import OnboardScreen from '../Screens/OnboardScreen';
import LoginScreen from '../Screens/LoginScreen';
import BottomTabs from './BottomTabs';
import DetailsScreen from '../Screens/DetailsScreen';
import EditScreen from '../Screens/EditScreen';
import SaveImageScreen from '../Screens/SaveImageScreen';
import SimilarDesignScreen from '../Screens/SimilarDesignScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Onboard" component={OnboardScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Detail" component={DetailsScreen} />
        <Stack.Screen name="HomeTabs" component={BottomTabs} />
        <Stack.Screen name="EditScreen" component={EditScreen} />
        <Stack.Screen name="SaveImageScreen" component={SaveImageScreen} />
        <Stack.Screen name="SimilarDesignScreen" component={SimilarDesignScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
