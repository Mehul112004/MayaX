import React, { useState, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ProfileProvider, useProfile } from "../../Context/ProfileContext";
import { useAuth } from "../../Context/AuthContext";

// Components
import ProfileHeader from "../Profile/ProfileHeader";
import ProfileStats from "../Profile/ProfileStats";
import ActionButtons from "../Profile/ActionButtons";
import ProfileTabs from "../Profile/ProfileTabs";
import ImageGrid from "../Profile/ImageGrid";

const { width } = Dimensions.get("window");

const ProfileContent = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { profile, loading, error, refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("Projects");
  const scrollViewRef = useRef(null);

  const handleProjectPress = (item) => {
    navigation.navigate("ProjectDetails", {
      projectId: item.id || item.project_id,
      projectData: item,
    });
  };

  // Refresh profile when screen comes into focus (e.g. after editing)
  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading profile</Text>
      </View>
    );
  }

  if (!profile) return null;

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: tabName === "Projects" ? 0 : width,
        animated: true,
      });
    }
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    const newTab = index === 0 ? "Projects" : "Inspirations";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert("Options", "What would you like to do?", [
      { text: "Log Out", onPress: () => signOut(), style: "destructive" },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <ProfileHeader profile={profile} onLogoutPress={handleLogoutPress} />
        <ProfileStats stats={profile?.stats} />
        <ActionButtons />

        <ProfileTabs activeTab={activeTab} onTabChange={handleTabPress} />

        {/* Horizontal Paging ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={{ width: width }}
        >
          <View style={{ width: width }}>
            <ImageGrid
              images={profile?.projects || []}
              onItemPress={handleProjectPress}
            />
          </View>
          <View style={{ width: width }}>
            <ImageGrid
              images={profile?.inspirations || []}
              onItemPress={handleProjectPress}
            />
          </View>
        </ScrollView>

        {/* Bottom spacing for TabBar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ProfileScreen;
