import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../../Context/AuthContext';
import StartScreen from '../Screens/StartScreen';
import OnboardScreen from '../Screens/OnboardScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import CompleteProfileScreen from '../Screens/CompleteProfileScreen';
import EditProfileScreen from '../Screens/EditProfileScreen';
import BottomTabs from './BottomTabs';
import DetailsScreen from '../Screens/DetailsScreen';
import EditScreen from '../Screens/EditScreen';
import SaveImageScreen from '../Screens/SaveImageScreen';
import SimilarDesignScreen from '../Screens/SimilarDesignScreen';
import ProjectDetailsScreen from '../Screens/ProjectDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#A34E5D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth flow
          <>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Onboard" component={OnboardScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : !isOnboarded ? (
          // Onboarding flow
          <>
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
          </>
        ) : (
          // Main app flow
          <>
            <Stack.Screen name="HomeTabs" component={BottomTabs} />
            <Stack.Screen name="Detail" component={DetailsScreen} />
            <Stack.Screen name="EditScreen" component={EditScreen} />
            <Stack.Screen name="SaveImageScreen" component={SaveImageScreen} />
            <Stack.Screen name="SimilarDesignScreen" component={SimilarDesignScreen} />
            <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
