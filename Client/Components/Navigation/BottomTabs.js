import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import HomeScreen from "../Screens/HomeScreen";
import CreateScreen from "../Screens/CreateScreen";
import ProfileScreen from "../Screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: "#2e2a2aff", // Dark charcoal background
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#4a5568" : "transparent", // Rounded pill background
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Ionicons
                name={iconName}
                size={26}
                color="#f0e5e5ff" 
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="camera-outline" size={28} color="#2a2a2a" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});