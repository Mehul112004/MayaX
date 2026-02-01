import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../Utils/Common";

export default function StartScreen({ navigation }) {
  const indicator = useRef(new Animated.Value(0)).current; 
  useEffect(() => {
    Animated.timing(indicator, {
      toValue: wp(30),
      duration: 2000,
      useNativeDriver: false,
    }).start(() => navigation.replace("Onboard"));
  }, []);

  return (
    <LinearGradient
      colors={["#F9F7D9", "#ECCAF1", "#D48B95"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.centerView}>
        <Text style={styles.logoText}>Maya<Text style={{color:"#DAA06D"}}>X</Text></Text>
        <Text style={styles.subText}>Design your way!</Text>
      </View>

      <View style={styles.sliderTrack}>
        <Animated.View style={[styles.sliderFill, { width: indicator }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerView: {
    position: "absolute",
    top: hp(45),
    alignItems: "center",
  },
  logoText: {
    fontSize: wp(9),
    color: "white",
    fontWeight: "700",
  },
  subText: {
    fontSize: wp(4),
    color: "white",
    marginTop: hp(1),
  },
  sliderTrack: {
    position: "absolute",
    bottom: hp(10),
    width: wp(30),
    height: hp(0.7),
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: wp(2),
  },
  sliderFill: {
    height: hp(0.7),
    backgroundColor: "white",
    borderRadius: wp(2),
  },
});
