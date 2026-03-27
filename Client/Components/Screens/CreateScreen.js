import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  Platform,
  UIManager,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import AccordionItem from "../Create/AccordionItem";
import { getPreferenceCategories } from "../../Services/preferencesService";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CreateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const prefill = route.params?.prefill || null;
  // 'form' | 'prompt' | 'camera' | 'result' | 'result_fullscreen'
  const [step, setStep] = useState("form");
  const [expandedSection, setExpandedSection] = useState(null);

  const [categories, setCategories] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  // Camera state
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [promptText, setPromptText] = useState("");

  // ---- Image Handlers ----

  const handleChooseFromGallery = async () => {
    setShowImageOptions(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error", error);
    }
  };

  const handleCropImage = async () => {
    setShowImageOptions(false);
    // Re-open the image in editing mode via ImagePicker
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Crop error", error);
    }
  };

  const handleRecapture = () => {
    setShowImageOptions(false);
    setStep("camera");
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Camera access is needed to take photos.",
        );
        return;
      }
    }
    setStep("camera");
  };

  // ---- Preferences ----

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getPreferenceCategories();

        const parsedData = data.map((item) => ({
          ...item,
          options:
            typeof item.options === "string"
              ? JSON.parse(item.options)
              : item.options,
        }));

        setCategories(parsedData);

        const initialPrefs = {};
        let firstUnfilledCategory = null;

        parsedData.forEach((cat) => {
          const paramValue = prefill?.[cat.category_name] || null;
          if (paramValue && cat.options && cat.options.includes(paramValue)) {
            initialPrefs[cat.category_name] = paramValue;
          } else {
            initialPrefs[cat.category_name] = null;
            if (!firstUnfilledCategory) {
              firstUnfilledCategory = cat.category_name;
            }
          }
        });
        setPreferences(initialPrefs);

        setExpandedSection(
          firstUnfilledCategory ||
            (parsedData.length > 0 ? parsedData[0].category_name : null),
        );
      } catch (error) {
        console.error("Failed to load generics preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [prefill]);

  useLayoutEffect(() => {
    if (step === "camera" || step === "result_fullscreen") {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: "#2e2a2aff",
          borderTopWidth: 0,
          elevation: 0,
        },
      });
    }
  }, [navigation, step]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSelect = (section, value) => {
    setPreferences((prev) => ({ ...prev, [section]: value }));

    setTimeout(() => {
      const currentIndex = categories.findIndex(
        (cat) => cat.category_name === section,
      );
      if (currentIndex !== -1 && currentIndex < categories.length - 1) {
        setExpandedSection(categories[currentIndex + 1].category_name);
      } else {
        setExpandedSection(null);
      }
    }, 450);
  };

  const isFormComplete =
    categories.length > 0 &&
    categories.every((cat) => preferences[cat.category_name] !== null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });
        setPhotoUri(photo.uri);
        setStep("prompt");
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  // =====================
  // STEP: CAMERA
  // =====================
  if (step === "camera") {
    if (!permission?.granted) {
      return (
        <SafeAreaView style={styles.cameraContainer}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#fff" }}>No access to camera</Text>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            style={styles.cameraPreview}
            facing="back"
            ref={cameraRef}
          >
            <View style={styles.focusFrame} />
          </CameraView>
        )}

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraBackButton}
            onPress={() => setStep("prompt")}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // =====================
  // STEP: PROMPT + IMAGE
  // =====================
  if (step === "prompt") {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={styles.promptHeader}>
            <TouchableOpacity
              onPress={() => {
                setStep("form");
                setPhotoUri(null);
                setPromptText("");
                setShowImageOptions(false);
              }}
              style={styles.promptBackBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.promptHeaderTitle}>Describe Your Design</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.promptContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Prompt Input */}
            <Text style={styles.promptLabel}>Your Prompt</Text>
            <View style={styles.promptInputContainer}>
              <TextInput
                style={styles.promptInput}
                placeholder="Describe the design you'd like to create..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={promptText}
                onChangeText={setPromptText}
              />
            </View>

            {/* Image Section */}
            <Text style={styles.promptLabel}>Reference Image</Text>

            {photoUri ? (
              // Image preview with options overlay
              <View style={styles.promptImageContainer}>
                <TouchableOpacity
                  onPress={() => setShowImageOptions(!showImageOptions)}
                  activeOpacity={0.9}
                  style={styles.promptImageWrapper}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.promptImage}
                  />
                </TouchableOpacity>

                {/* Remove Image Button */}
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setPhotoUri(null);
                    setShowImageOptions(false);
                  }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Options Overlay */}
                {showImageOptions && (
                  <View style={styles.imageOverlayOptions}>
                    <TouchableOpacity
                      style={styles.overlayOption}
                      onPress={handleCropImage}
                    >
                      <View style={styles.iconCircle}>
                        <Ionicons name="crop" size={24} color="#fff" />
                      </View>
                      <Text style={styles.overlayOptionText}>Crop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayOption}
                      onPress={handleChooseFromGallery}
                    >
                      <View style={styles.iconCircle}>
                        <Ionicons name="images" size={24} color="#fff" />
                      </View>
                      <Text style={styles.overlayOptionText}>Choose</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.overlayOption}
                      onPress={handleRecapture}
                    >
                      <View style={styles.iconCircle}>
                        <Ionicons
                          name="camera-reverse"
                          size={24}
                          color="#fff"
                        />
                      </View>
                      <Text style={styles.overlayOptionText}>Retake</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              // Add Image Buttons
              <View style={styles.addImageSection}>
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleOpenCamera}
                >
                  <View style={styles.addImageIconCircle}>
                    <Ionicons name="camera" size={28} color="#D97385" />
                  </View>
                  <Text style={styles.addImageText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleChooseFromGallery}
                >
                  <View style={styles.addImageIconCircle}>
                    <Ionicons name="images" size={28} color="#D97385" />
                  </View>
                  <Text style={styles.addImageText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.gradientButton,
                (!photoUri || !promptText.trim()) && styles.disabledButton,
              ]}
              disabled={!photoUri || !promptText.trim()}
              onPress={() => {
                setShowImageOptions(false);
                navigation.navigate("EditScreen", {
                  photoUri,
                  prompt: promptText,
                  preferences,
                });
              }}
            >
              <LinearGradient
                colors={["#A34E5D", "#D97385"]}
                style={StyleSheet.absoluteFill}
                borderRadius={25}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.saveButtonText}>Generate Design</Text>
              <Ionicons
                name="sparkles"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // =====================
  // STEP: RESULT
  // =====================
  if (step === "result") {
    return (
      <SafeAreaView style={styles.resultViewContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerResult}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                M<Text style={{ color: "#A34E5D" }}>X</Text>
              </Text>
              <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
            </View>
            <Text
              style={[styles.pageTitle, { textDecorationLine: "underline" }]}
            >
              Your Spectacular Design...
            </Text>
          </View>

          <View style={styles.resultContainer}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: "#888" }}>Generated Design Preview</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.expandIcon}
              onPress={() => setStep("result_fullscreen")}
            >
              <Ionicons name="resize-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.gradientButtonResult,
              { width: "80%", alignSelf: "center" },
            ]}
            onPress={() => navigation.navigate("EditScreen")}
          >
            <LinearGradient
              colors={["#A34E5D", "#D97385"]}
              style={StyleSheet.absoluteFill}
              borderRadius={25}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.saveButtonText}>Edit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================
  // STEP: RESULT FULLSCREEN
  // =====================
  if (step === "result_fullscreen") {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        ) : (
          <View style={styles.fullScreenImagePlaceholder}>
            <Text style={{ color: "#888" }}>Full Screen Preview</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.contractIcon}
          onPress={() => setStep("result")}
        >
          <Ionicons name="contract-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // =====================
  // STEP: FORM (default)
  // =====================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoTextDark}>
              M<Text style={{ color: "#D97385" }}>X</Text>
            </Text>
            <Text style={styles.logoSubtextDark}>DESIGN YOUR WAY</Text>
          </View>
          <Text style={styles.pageTitleDark}>Configure Your Space</Text>
          <Text style={styles.pageSubtitle}>
            Select your preferences below to personalize your design.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#D97385"
              style={{ marginTop: 50 }}
            />
          ) : categories.length === 0 ? (
            <Text style={{ color: "#888", textAlign: "center", marginTop: 50 }}>
              No structured preferences found.
            </Text>
          ) : (
            <>
              {categories.map((cat, index) => (
                <AccordionItem
                  key={cat.category_name}
                  title={cat.display_label}
                  iconName={cat.icon_name}
                  options={cat.options || []}
                  expanded={expandedSection === cat.category_name}
                  onToggle={() => toggleSection(cat.category_name)}
                  onSelect={(val) => handleSelect(cat.category_name, val)}
                  selectedValue={preferences[cat.category_name]}
                />
              ))}

              <TouchableOpacity
                style={[
                  styles.gradientButton,
                  !isFormComplete && styles.disabledButton,
                ]}
                disabled={!isFormComplete}
                onPress={() => setStep("prompt")}
              >
                <LinearGradient
                  colors={["#A34E5D", "#D97385"]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={25}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.saveButtonText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  resultViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerResult: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#333",
  },
  logoSubtext: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: "600",
    color: "#A34E5D",
  },
  logoTextDark: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },
  logoSubtextDark: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: "600",
    color: "#D97385",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  pageTitleDark: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  gradientButtonResult: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    zIndex: 1,
  },

  // ---- Camera ----
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  focusFrame: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    borderStyle: "dashed",
    borderRadius: 20,
  },
  cameraControls: {
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  cameraBackButton: {
    position: "absolute",
    right: 40,
    top: 40,
  },

  // ---- Prompt Screen ----
  promptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  promptBackBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  promptHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  promptContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  promptInputContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 28,
  },
  promptInput: {
    color: "#fff",
    fontSize: 16,
    padding: 16,
    minHeight: 130,
    lineHeight: 24,
  },

  // ---- Image Section in Prompt ----
  promptImageContainer: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1e1e1e",
    marginBottom: 28,
    position: "relative",
  },
  promptImageWrapper: {
    width: "100%",
    height: "100%",
  },
  promptImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  imageOverlayOptions: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    zIndex: 10,
  },
  overlayOption: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  overlayOptionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // ---- Add Image Buttons ----
  addImageSection: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },
  addImageButton: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(217,115,133,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addImageText: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // ---- Result ----
  resultContainer: {
    height: 400,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  expandIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 8,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  fullScreenImagePlaceholder: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  contractIcon: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 10,
    borderRadius: 10,
  },
});

export default CreateScreen;
