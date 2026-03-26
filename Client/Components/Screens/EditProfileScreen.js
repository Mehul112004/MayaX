import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { wp, hp } from "../../Utils/Common";
import { useAuth } from "../../Context/AuthContext";
import { updateProfile } from "../../Services/authService";

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Your name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      const profileData = {};

      // Only send changed fields
      if (name.trim() !== user?.name) {
        profileData.name = name.trim();
      }

      if (imageUri) {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
        profileData.image_base64 = base64;
      }

      if (Object.keys(profileData).length === 0) {
        navigation.goBack();
        return;
      }

      const result = await updateProfile(profileData);
      await updateUser(result.user);

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = imageUri || user?.avatar_url;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            {currentAvatar ? (
              <Image
                source={{ uri: currentAvatar }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Ionicons name="person" size={wp(12)} color="#bbb" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Photo</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
              />
            </View>

            {/* Read-only email field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.input, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>
                  {user?.email || "Not available"}
                </Text>
              </View>
            </View>

            {/* Read-only phone field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <View style={[styles.input, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>
                  {user?.phone || "Not set"}
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: wp(4.5),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(3),
    paddingBottom: hp(4),
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: hp(1),
    position: "relative",
  },
  avatarImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
  },
  placeholderAvatar: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoText: {
    textAlign: "center",
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#A34E5D",
    marginBottom: hp(4),
  },
  formContainer: {
    marginBottom: hp(4),
  },
  inputGroup: {
    marginBottom: hp(2.5),
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.8),
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.8),
    fontSize: wp(3.8),
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  readOnlyInput: {
    backgroundColor: "#f0f0f0",
  },
  readOnlyText: {
    fontSize: wp(3.8),
    color: "#888",
  },
  saveBtn: {
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    borderRadius: 16,
    marginTop: "auto",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "white",
    fontSize: wp(4.2),
    fontWeight: "600",
  },
});
