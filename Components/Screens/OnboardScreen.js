import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";   // ✅ Correct Icon Import
import { wp, hp } from "../../Utils/Common";

export default function OnboardScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#C96876", "#A34E5D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.centerContent}>
        <Text style={styles.title}>
          Maya<Text style={{ color: "#FFD7A0" }}>X</Text>
        </Text>
        <Text style={styles.subtitle}>Design your way!</Text>
        <Text style={styles.desc}>Design your dream space</Text>
      </View>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name="home-outline" size={wp(7)} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  centerContent: {
    position: "absolute",
    top: hp(35),
    alignItems: "center",
  },
  title: {
    fontSize: wp(11),
    color: "white",
    fontWeight: "700",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: wp(4.2),
    color: "white",
    marginTop: hp(1),
  },
  desc: {
    fontSize: wp(4),
    color: "white",
    opacity: 0.9,
    marginTop: hp(2),
  },
  homeBtn: {
    position: "absolute",
    bottom: hp(10),
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
