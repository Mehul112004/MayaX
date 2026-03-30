import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from "react-native";
import Svg, {
  Path,
  Polygon,
  Ellipse,
  Rect,
  Line,
  Circle,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.View;

const { width, height } = Dimensions.get("window");

export default function DesignLoadingOverlay({
  isVisible,
  isBackendDone,
  onComplete,
  preferences,
}) {
  const animTime = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(12)).current;
  const [statusLabel, setStatusLabel] = useState("Sketching room structure...");
  const scaleOutAnim = useRef(new Animated.Value(1)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  // Watch for backend completion to trigger the fade-out gracefully
  useEffect(() => {
    if (isBackendDone && isVisible) {
      Animated.parallel([
        Animated.timing(scaleOutAnim, {
          toValue: 1.04,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }
  }, [isBackendDone, isVisible]);

  useEffect(() => {
    if (isVisible && !isBackendDone) {
      animTime.setValue(0);
      progressAnim.setValue(12);
      scaleOutAnim.setValue(1);
      fadeOutAnim.setValue(1);
      setStatusLabel("Sketching room structure...");

      // The main timeline runs from 0 to 4200 linearly and stays drawn.
      Animated.timing(animTime, {
        toValue: 4200,
        duration: 4200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      // Timers for Status and Progress Bar (Discrete Steps)
      const timers = [
        setTimeout(() => {
          setStatusLabel("Filling walls & floor...");
          Animated.timing(progressAnim, {
            toValue: 32,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 1300),
        setTimeout(() => {
          setStatusLabel("Placing sofa...");
          Animated.timing(progressAnim, {
            toValue: 50,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 1750),
        setTimeout(() => {
          setStatusLabel("Adding coffee table...");
          Animated.timing(progressAnim, {
            toValue: 63,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 2350),
        setTimeout(() => {
          setStatusLabel("Placing floor lamp...");
          Animated.timing(progressAnim, {
            toValue: 74,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 2770),
        setTimeout(() => {
          setStatusLabel("Adding plant...");
          Animated.timing(progressAnim, {
            toValue: 84,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 3100),
        setTimeout(() => {
          setStatusLabel("Refining palette...");
          Animated.timing(progressAnim, {
            toValue: 90,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 3700),
        setTimeout(() => {
          setStatusLabel("Finalizing high-res ML render...");
          Animated.timing(progressAnim, {
            toValue: 98,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }).start();
        }, 4200),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [isVisible, isBackendDone]);

  if (!isVisible) return null;

  // Helpers for interpolators (Drawing outlines length -> 0)
  const draw = (startMs, durationMs, length) =>
    animTime.interpolate({
      inputRange: [startMs - 1, startMs, startMs + durationMs, 4200],
      outputRange: [length, length, 0, 0],
      extrapolate: "clamp",
    });

  const fade = (startMs, durationMs) =>
    animTime.interpolate({
      inputRange: [startMs - 1, startMs, startMs + durationMs, 4200],
      outputRange: [0, 0, 1, 1],
      extrapolate: "clamp",
    });

  const slideY = (startMs) =>
    animTime.interpolate({
      inputRange: [startMs, startMs + 400],
      outputRange: [10, 0],
      extrapolate: "clamp",
    });

  const slideX = (startMs) =>
    animTime.interpolate({
      inputRange: [startMs, startMs + 400],
      outputRange: [-10, 0],
      extrapolate: "clamp",
    });

  const lineLen = 240;

  // Moodboard Config
  const swatches = [
    { start: 1400, color: "#d9cfc4" },
    { start: 1850, color: "#b3a9f5" },
    { start: 2450, color: "#9FE1CB" },
    { start: 2870, color: "#FAC775" },
    { start: 3200, color: "#97C459" },
  ];

  const tags = [
    { start: 1850, label: "Japandi", bg: "#EEEDFE", text: "#3C3489" },
    { start: 2450, label: "Linen", bg: "#E1F5EE", text: "#085041" },
    {
      start: 2870,
      label: "Oak wood",
      bg: "#f6f3ef",
      text: "#5F5E5A",
      border: "#c8bfae",
    },
    { start: 3200, label: "Warm light", bg: "#FAEEDA", text: "#633806" },
    { start: 3800, label: "Biophilic", bg: "#EAF3DE", text: "#27500A" },
  ];

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeOutAnim,
          transform: [{ scale: scaleOutAnim }],
        },
      ]}
    >
      {/* Sketch Canvas */}
      <View style={styles.sketchSection}>
        <Svg
          viewBox="0 0 260 340"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* FILLS */}
          <AnimatedPolygon
            points="20,55 130,18 130,190 20,280"
            fill="#e8e4de"
            opacity={fade(1600, 400)}
          />
          <AnimatedPolygon
            points="130,18 240,55 240,280 130,190"
            fill="#e4e0da"
            opacity={fade(1600, 400)}
          />
          <AnimatedPolygon
            points="20,280 130,190 240,280 130,330"
            fill="#d9d0c5"
            opacity={fade(1600, 400)}
          />

          {/* WALL OUTLINES (0 - 1600ms, 8 segments) */}
          <AnimatedPath
            d="M20 55 L130 18"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="120"
            strokeDashoffset={draw(0, 200, 120)}
          />
          <AnimatedPath
            d="M130 18 L240 55"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="120"
            strokeDashoffset={draw(200, 200, 120)}
          />
          <AnimatedPath
            d="M240 55 L240 280"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="230"
            strokeDashoffset={draw(400, 200, 230)}
          />
          <AnimatedPath
            d="M20 55 L20 280"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="230"
            strokeDashoffset={draw(600, 200, 230)}
          />
          <AnimatedPath
            d="M20 280 L240 280"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="230"
            strokeDashoffset={draw(800, 200, 230)}
          />
          <AnimatedPath
            d="M130 18 L130 190"
            stroke="#ddd"
            strokeWidth="1"
            strokeDasharray="180 5"
            strokeDashoffset={draw(1000, 200, 180)}
            fill="none"
          />
          <AnimatedPath
            d="M20 280 L130 330"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="130"
            strokeDashoffset={draw(1200, 200, 130)}
          />
          <AnimatedPath
            d="M240 280 L130 330"
            stroke="#c0b8ae"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="130"
            strokeDashoffset={draw(1400, 200, 130)}
          />

          {/* SOFA: 1750ms -> stroke(0-350) 1750-2100, fill(2100-2350) */}
          {/* Main Body */}
          <AnimatedPath
            d="M72 212 h96 v52 h-96 z"
            stroke="#7F77DD"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="300"
            strokeDashoffset={draw(1750, 350, 300)}
          />
          <AnimatedPath
            d="M72 212 h96 v52 h-96 z"
            fill="#b3a9f5"
            opacity={fade(2100, 250)}
          />
          {/* Backrest */}
          <AnimatedPath
            d="M72 212 h96 v14 h-96 z"
            stroke="#7F77DD"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="220"
            strokeDashoffset={draw(1750, 350, 220)}
          />
          <AnimatedPath
            d="M72 212 h96 v14 h-96 z"
            fill="#b3a9f5"
            opacity={fade(2100, 250)}
          />
          {/* Armrests */}
          <AnimatedPath
            d="M72 220 h10 v44 h-10 z"
            stroke="#7F77DD"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="110"
            strokeDashoffset={draw(1750, 350, 110)}
          />
          <AnimatedPath
            d="M72 220 h10 v44 h-10 z"
            fill="#b3a9f5"
            opacity={fade(2100, 250)}
          />
          <AnimatedPath
            d="M158 220 h10 v44 h-10 z"
            stroke="#7F77DD"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="110"
            strokeDashoffset={draw(1750, 350, 110)}
          />
          <AnimatedPath
            d="M158 220 h10 v44 h-10 z"
            fill="#b3a9f5"
            opacity={fade(2100, 250)}
          />

          {/* COFFEE TABLE: 2350, stroke 300(2350-2650), fill(2650-2900) */}
          <AnimatedPath
            d="M98 267 h60 v28 h-60 z"
            stroke="#1D9E75"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="180"
            strokeDashoffset={draw(2350, 300, 180)}
          />
          <AnimatedPath
            d="M98 267 h60 v28 h-60 z"
            fill="#9FE1CB"
            opacity={fade(2650, 250)}
          />

          {/* FLOOR LAMP: 2770, stroke 300(2770-3070), fill(3070-3320) */}
          <AnimatedPath
            d="M218 275 L218 198"
            stroke="#BA7517"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="80"
            strokeDashoffset={draw(2770, 300, 80)}
          />
          <AnimatedEllipse
            cx="218"
            cy="192"
            rx="13"
            ry="18"
            stroke="#BA7517"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset={draw(2770, 300, 100)}
          />
          <AnimatedEllipse
            cx="218"
            cy="192"
            rx="13"
            ry="18"
            fill="#FAC775"
            opacity={fade(3070, 250)}
          />

          {/* PLANT: 3100, stroke 300(3100-3400), fill(3400-3650) */}
          <AnimatedCircle
            cx="46"
            cy="238"
            r="16"
            stroke="#3B6D11"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="105"
            strokeDashoffset={draw(3100, 300, 105)}
          />
          <AnimatedCircle
            cx="46"
            cy="238"
            r="16"
            fill="#97C459"
            opacity={fade(3400, 250)}
          />
          <AnimatedPath
            d="M40 254 h12 v16 h-12 z"
            stroke="#3B6D11"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset={draw(3100, 300, 60)}
          />
          <AnimatedPath
            d="M40 254 h12 v16 h-12 z"
            fill="#97C459"
            opacity={fade(3400, 250)}
          />
        </Svg>
      </View>

      {/* Moodboard Strip */}
      <View style={styles.moodboardSection}>
        {/* Palette Row */}
        <View style={styles.swatchRow}>
          {swatches.map((s, i) => (
            <AnimatedView
              key={i}
              style={[
                styles.swatchCircle,
                { backgroundColor: s.color },
                {
                  opacity: fade(s.start, 400),
                  transform: [{ translateY: slideY(s.start) }],
                },
              ]}
            />
          ))}
        </View>

        {/* Tag Row */}
        <View style={styles.tagRow}>
          {tags.map((t, i) => (
            <AnimatedView
              key={i}
              style={[
                styles.tagPill,
                { backgroundColor: t.bg },
                t.border && { borderWidth: 1, borderColor: t.border },
                {
                  opacity: fade(t.start, 400),
                  transform: [{ translateX: slideX(t.start) }],
                },
              ]}
            >
              <Text style={[styles.tagText, { color: t.text }]}>{t.label}</Text>
            </AnimatedView>
          ))}
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{statusLabel}</Text>
        <View style={styles.progressBarBg}>
          <AnimatedView
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f6f3ef", // Warm off-white
    zIndex: 999,
  },
  sketchSection: {
    flex: 0.7,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  moodboardSection: {
    flex: 0.3,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e8e4de",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  swatchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    backgroundColor: "#ffffff",
  },
  statusText: {
    fontSize: 14,
    color: "#5F5E5A",
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "#f0ece6",
    borderRadius: 1.5,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#A34E5D",
    borderRadius: 1.5,
  },
});
