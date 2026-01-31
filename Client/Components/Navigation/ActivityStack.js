import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityScreen from '../Screens/ActivityScreen';
import RoomtypeScreen from '../Screens/RoomtypeScreen';
import AestheticScreen from '../Screens/AestheticScreen';
import ColorpreferenceScreen from '../Screens/ColorpreferenceScreen';

const Stack = createNativeStackNavigator();

export default function ActivityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivityMain" component={ActivityScreen} />
      <Stack.Screen name="Roomtype" component={RoomtypeScreen} />
      <Stack.Screen name="Aesthetic" component={AestheticScreen} />
      <Stack.Screen name="ColorPreference" component={ColorpreferenceScreen} />
    </Stack.Navigator>
  );
}
