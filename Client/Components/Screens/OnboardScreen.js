import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp } from "../../Utils/Common";

const { width } = Dimensions.get("window");

const onboardingImages = [
  { id: 1, image: 'https://images.unsplash.com/photo-1616486338812-3aeee7e36f58?auto=format&fit=crop&w=800&q=80', label: 'Bedroom' },
  { id: 2, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', label: 'Living Room' },
  { id: 3, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', label: 'Kitchen' },
  { id: 4, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', label: 'Office' },
  { id: 5, image: 'https://images.unsplash.com/photo-1584622640111-994a426fbf0a?auto=format&fit=crop&w=800&q=80', label: 'Bathroom' },
];

export default function OnboardScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header / Logo */}
      <View style={styles.header}>
        {/* MX Logo Text Representation */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
          <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
        </View>
      </View>

      {/* Carousel Section */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width - wp(10)} // Full width minus padding
          height={hp(60)} // Fixed height
          autoPlay={true}
          autoPlayInterval={1500} // 1.5s duration
          data={onboardingImages}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setCurrentIndex(index)}
          mode="parallax" // Or 'parallax' for nice effect
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              {/* Label Overlay */}
              <View style={styles.labelOverlay}>
                <Text style={styles.labelText}>{item.label}</Text>
              </View>
            </View>
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  width: index === currentIndex ? 8 : 6,
                  height: index === currentIndex ? 8 : 6,
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Footer / Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.startButtonText}>Let's Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
  },
  header: {
    marginTop: hp(2),
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333', // Deep Gray/Black
    letterSpacing: -1,
  },
  logoSubtext: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    color: '#A34E5D', // Brand color
    marginTop: -5,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // We want the pagination dots essentially inside the card area or just below?
    // In the image, dots are ON the image at bottom.
  },
  cardContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    // Shadow?
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  labelOverlay: {
    position: 'absolute',
    bottom: 40, // Space for dots
    left: 20,
    backgroundColor: 'rgba(50, 40, 40, 0.65)', // Semi-transparent brown/dark
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  labelText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 20, // Position dots *inside* the carousel view if possible? 
    // Actually with the carousel library rendering the dots is separate usually.
    // I placed them absolutely over the carousel container, this might not center relative to the item if I used parallax properly,
    // but centering visually over the carousel area is fine.
    // Wait, the dots in the image are ON the image (bottom center).
    // Since renderItem is isolated, passing current index to it is hard.
    // Easiest: Draw dots over the whole Carousel View at the bottom.
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    alignItems: 'center',
    // But text was overlayed on image, dots were on image. 
    // If Parallax is used, the image moves. 
    // Let's put dots absolutely positioned *within* the renderItem? No, loop logic makes index unique.
    // I'll keep dots centered on the screen bottom of the carousel area.
  },
  dot: {
    borderRadius: 4,
  },
  footer: {
    marginBottom: hp(5),
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#1a1a1a', // Dark button
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '85%',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
