import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";   // ✅ Correct Icon Library
import { wp, hp } from "../../Utils/Common";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require("../../assets/Living room design.jpeg")}
        style={styles.bgImage}
      />

      {/* Middle Text */}
      <View style={styles.centerText}>
        <Text style={styles.title}>
          Maya<Text style={{ color: "#DAA06D" }}>X</Text>
        </Text>
        <Text style={styles.subText}>Design your way!</Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        
        {/* Google Sign In */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => navigation.navigate("Detail")}
        >
          <MaterialIcons
            name="google"
            size={wp(6)}
            color="#DB4437"
            style={{ marginRight: wp(2) }}
          />
          <Text style={styles.btnText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Terms & Policy */}
        <Text style={styles.policyText}>
          By continuing, you agree to our
          <Text style={styles.linkText}> Terms of Service </Text>
          and
          <Text style={styles.linkText}> Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  centerText: {
    position: "absolute",
    top: hp(35),
    width: wp(100),
    alignItems: "center",
  },
  title: {
    fontSize: wp(10),
    color: "white",
    fontWeight: "600",
  },
  subText: {
    fontSize: wp(4),
    color: "white",
    marginTop: hp(1),
  },
  bottomContainer: {
    position: "absolute",
    bottom: hp(8),
    width: wp(100),
    alignItems: "center",
  },
  googleBtn: {
    flexDirection: "row",
    width: wp(80),
    height: hp(6),
    backgroundColor: "white",
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  btnText: {
    fontSize: wp(4),
    color: "#000",
    fontWeight: "500",
  },
  policyText: {
    fontSize: wp(3),
    color: "white",
    textAlign: "center",
    width: wp(80),
    marginTop: hp(2),
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
