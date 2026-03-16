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
import * as FileSystem from "expo-file-system";
import { wp, hp } from "../../Utils/Common";
import { useAuth } from "../../Context/AuthContext";
import { completeProfile } from "../../Services/authService";

/**
 * Get initials from a name string.
 * "Mehul Sharma" → "MS", "Jane" → "J"
 */
const getInitials = (name) => {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Deterministically pick a background color based on name.
 */
const AVATAR_COLORS = [
  "#D48B95", "#A34E5D", "#DAA06D", "#6B8F71",
  "#5B7FA5", "#8B6FB0", "#C97B4B", "#4A8F8F",
];
const pickColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

export default function CompleteProfileScreen({ navigation }) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    try {
      setLoading(true);

      const profileData = {
        name: name.trim(),
        phone: phone.trim(),
      };

      // If user picked a custom image, convert to base64
      if (imageUri) {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        profileData.image_base64 = base64;
      }

      const result = await completeProfile(profileData);
      await updateUser(result.user);

      navigation.reset({
        index: 0,
        routes: [{ name: "HomeTabs" }],
      });
    } catch (error) {
      console.error("Complete profile error:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initials = getInitials(name);
  const bgColor = pickColor(name);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
            <Text style={styles.headerSubtitle}>
              Tell us a bit about yourself
            </Text>
          </View>

          {/* Avatar Section */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.initialsAvatar, { backgroundColor: bgColor }]}>
                <Text style={styles.initialsText}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to add a photo</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueBtn, loading && styles.continueBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.continueBtnText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              </>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(8),
    paddingTop: hp(6),
    paddingBottom: hp(4),
  },
  header: {
    marginBottom: hp(4),
  },
  headerTitle: {
    fontSize: wp(7),
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: hp(0.5),
  },
  headerSubtitle: {
    fontSize: wp(3.8),
    color: "#888",
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
  initialsAvatar: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: wp(10),
    fontWeight: "700",
    color: "white",
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
  avatarHint: {
    textAlign: "center",
    fontSize: wp(3.2),
    color: "#aaa",
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
  continueBtn: {
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    borderRadius: 16,
    marginTop: "auto",
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    color: "white",
    fontSize: wp(4.2),
    fontWeight: "600",
  },
});
