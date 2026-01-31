import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../Screens/HomeScreen";
import CreateScreen from "../Screens/CreateScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import ActivityStack from "./ActivityStack";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Create") {
            iconName = "add-circle-outline";
          } else if (route.name === "Activity") {
            iconName = "time-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return (
            <Ionicons name={iconName} size={size ? size : 24} color={color} />
          );
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarStyle: {
          backgroundColor: "#A34E5D",
          borderTopWidth: 0,
          height: 55,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Activity" component={ActivityStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
