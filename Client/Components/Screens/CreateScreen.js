import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert, Image, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';

import AccordionItem from '../Create/AccordionItem';
import { getPreferenceCategories } from '../../Services/preferencesService';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const CreateScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [step, setStep] = useState('form'); // 'form' | 'camera' | 'result' | 'result_fullscreen'
  const [expandedSection, setExpandedSection] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  // Camera state
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getPreferenceCategories();
        
        // Ensure options is parsed as an array if it isn't already (Supabase might return JSON string or array)
        const parsedData = data.map(item => ({
            ...item,
            options: typeof item.options === 'string' ? JSON.parse(item.options) : item.options
        }));

        setCategories(parsedData);
        
        // Initialize preferences state based on fetched categories
        const initialPrefs = {};
        parsedData.forEach(cat => {
            initialPrefs[cat.category_name] = null;
        });
        setPreferences(initialPrefs);
        
        // Auto expand first category
        if (parsedData.length > 0) {
            setExpandedSection(parsedData[0].category_name);
        }
      } catch (error) {
        console.error("Failed to load generics preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  useLayoutEffect(() => {
    if (step === 'camera' || step === 'result_fullscreen') {
      navigation.setOptions({
        tabBarStyle: { display: 'none' },
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
    setPreferences(prev => ({ ...prev, [section]: value }));
    
    // Auto-advance after showing the selection animation
    setTimeout(() => {
        const currentIndex = categories.findIndex(cat => cat.category_name === section);
        if (currentIndex !== -1 && currentIndex < categories.length - 1) {
            setExpandedSection(categories[currentIndex + 1].category_name);
        } else {
            setExpandedSection(null);
        }
    }, 450); // increased delay to enjoy the selection transition
  };

  const isFormComplete = categories.length > 0 && categories.every(cat => preferences[cat.category_name] !== null);

  const startCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission required", "Camera access is needed to continue.");
        return;
      }
    }
    setStep('camera');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
        });
        setPhotoUri(photo.uri);
        setStep('result');
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  if (step === 'camera') {
    if (!permission?.granted) {
      return (
        <SafeAreaView style={styles.cameraContainer}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>No access to camera</Text>
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
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('form')}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'result') {
    return (
      <SafeAreaView style={styles.resultViewContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerResult}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
              <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
            </View>
            <Text style={[styles.pageTitle, { textDecorationLine: 'underline' }]}>Your Spectacular Design...</Text>
          </View>

          <View style={styles.resultContainer}>
            {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ color: '#888' }}>Generated Design Preview</Text>
                </View>
            )}

            <TouchableOpacity
              style={styles.expandIcon}
              onPress={() => setStep('result_fullscreen')}
            >
              <Ionicons name="resize-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.gradientButtonResult, { width: '80%', alignSelf: 'center' }]}
            onPress={() => navigation.navigate('EditScreen')}
          >
            <LinearGradient
                colors={['#A34E5D', '#D97385']}
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

  if (step === 'result_fullscreen') {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
          {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          ) : (
            <View style={styles.fullScreenImagePlaceholder}>
              <Text style={{ color: '#888' }}>Full Screen Preview</Text>
            </View>
          )}

        <TouchableOpacity
          style={styles.contractIcon}
          onPress={() => setStep('result')}
        >
          <Ionicons name="contract-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoTextDark}>M<Text style={{ color: '#D97385' }}>X</Text></Text>
            <Text style={styles.logoSubtextDark}>DESIGN YOUR WAY</Text>
          </View>
          <Text style={styles.pageTitleDark}>Configure Your Space</Text>
          <Text style={styles.pageSubtitle}>Select your preferences below to personalize your design.</Text>
        </View>

        <View style={styles.formContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#D97385" style={{ marginTop: 50 }} />
            ) : categories.length === 0 ? (
                <Text style={{ color: '#888', textAlign: 'center', marginTop: 50 }}>No structured preferences found.</Text>
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
                        style={[styles.gradientButton, !isFormComplete && styles.disabledButton]}
                        disabled={!isFormComplete}
                        onPress={startCamera}
                    >
                        <LinearGradient
                            colors={['#A34E5D', '#D97385']}
                            style={StyleSheet.absoluteFill}
                            borderRadius={25}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <Text style={styles.saveButtonText}>Continue to Camera</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
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
    backgroundColor: '#121212',
  },
  resultViewContainer: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  content: {
    paddingBottom: 100, 
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerResult: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
  },
  logoSubtext: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '600',
    color: '#A34E5D',
  },
  logoTextDark: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  logoSubtextDark: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '600',
    color: '#D97385',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  pageTitleDark: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 25,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientButtonResult: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    zIndex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  focusFrame: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  cameraControls: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  backButton: {
    position: 'absolute',
    right: 40,
    top: 40,
  },
  resultContainer: {
    height: 400,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullScreenImagePlaceholder: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contractIcon: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 10,
  }
});

export default CreateScreen;