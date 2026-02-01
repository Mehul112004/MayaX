import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AccordionItem from '../Create/AccordionItem';

const DATA = {
  Colors: ['Minimal & Calm', 'Bold & Vibrant', 'Elegant & Dark'],
  Aesthetics: ['Minimal', 'Modern & Classic', 'Royal & Heritage'],
  SpaceType: ['Bedroom', 'Living Room', 'Kitchen']
};

const CreateScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState('form'); // 'form' | 'camera'
  const [expandedSection, setExpandedSection] = useState(null);
  const [preferences, setPreferences] = useState({
    Colors: null,
    Aesthetics: null,
    SpaceType: null,
  });

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
  };

  const isFormComplete = preferences.Colors && preferences.Aesthetics && preferences.SpaceType;

  if (step === 'camera') {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        {/* Simulated Camera View */}
        <View style={styles.cameraPreview}>
          <Text style={styles.cameraText}>Camera Preview</Text>
          <View style={styles.focusFrame} />
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => setStep('result')}
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
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
              <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
            </View>
            <Text style={[styles.pageTitle, { textDecorationLine: 'underline' }]}>Your Spectacular Design...</Text>
          </View>

          {/* Result Image */}
          <View style={styles.resultContainer}>
            {/* Placeholder for the generated design - using a random interior image */}
            <View style={styles.imagePlaceholder}>
              {/* In a real app, this would be the Captured Image or API Result */}
              <Text style={{ color: '#888' }}>Generated Design Preview</Text>
            </View>

            <TouchableOpacity
              style={styles.expandIcon}
              onPress={() => setStep('result_fullscreen')}
            >
              <Ionicons name="resize-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={[styles.saveButton, { width: '80%', alignSelf: 'center' }]}
            onPress={() => navigation.navigate('EditScreen')}
          >
            <Text style={styles.saveButtonText}>Edit</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'result_fullscreen') {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.fullScreenImagePlaceholder}>
          <Text style={{ color: '#888' }}>Full Screen Preview</Text>
        </View>

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
            <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
          </View>
          <Text style={styles.pageTitle}>Tell us what you like...</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <AccordionItem
            title="Colors"
            options={DATA.Colors}
            expanded={expandedSection === 'Colors'}
            onToggle={() => toggleSection('Colors')}
            onSelect={(val) => handleSelect('Colors', val)}
            selectedValue={preferences.Colors}
          />
          <AccordionItem
            title="Aesthetics"
            options={DATA.Aesthetics}
            expanded={expandedSection === 'Aesthetics'}
            onToggle={() => toggleSection('Aesthetics')}
            onSelect={(val) => handleSelect('Aesthetics', val)}
            selectedValue={preferences.Aesthetics}
          />
          <AccordionItem
            title="Space Type"
            options={DATA.SpaceType}
            expanded={expandedSection === 'SpaceType'}
            onToggle={() => toggleSection('SpaceType')}
            onSelect={(val) => handleSelect('SpaceType', val)}
            selectedValue={preferences.SpaceType}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, !isFormComplete && styles.disabledButton]}
            disabled={!isFormComplete}
            onPress={() => setStep('camera')}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 100, // Space for nav bar
  },
  header: {
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
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  saveButton: {
    backgroundColor: '#555',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222', // Placeholder grey
    margin: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#444'
  },
  cameraText: {
    color: '#fff',
    marginBottom: 20,
  },
  focusFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
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
    backgroundColor: '#fff',
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
  // Result Screen Styles
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