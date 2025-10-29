import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";  
import { wp, hp } from "../../Utils/Common";

export default function DetailScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp(6)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Complete Your Profile</Text>
        <View style={{ width: wp(6) }} />
      </View>

      {/* Upload Box */}
      <View style={styles.uploadContainer}>
        <View style={styles.uploadCircle}>
          <Ionicons name="camera-outline" size={wp(8)} color="#8C8C8C" />
        </View>
        <Text style={styles.uploadTitle}>Upload a Profile Picture</Text>
        <Text style={styles.uploadSubtitle}>Personalize your experience</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Full name"
            value={name}
            onChangeText={setName}
          />
          <Ionicons name="person-outline" size={wp(5)} color="#8C8C8C" />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Ionicons name="call-outline" size={wp(5)} color="#8C8C8C" />
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your mail id"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Ionicons name="mail-outline" size={wp(5)} color="#8C8C8C" />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => navigation.navigate("HomeTabs")}
      >
        <Text style={styles.saveBtnText}>Save & Continue</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={() => navigation.navigate("HomeTabs")}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
      
      <View style={{ height: hp(3) }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: wp(6),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(4),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: "600",
    color: "#333",
  },
  uploadContainer: {
    alignItems: "center",
    marginTop: hp(5),
  },
  uploadCircle: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: wp(4.8),
    fontWeight: "600",
    marginTop: hp(2),
    color: "#000",
  },
  uploadSubtitle: {
    fontSize: wp(3.6),
    color: "#7A7A7A",
    marginTop: hp(0.5),
  },
  fieldContainer: {
    marginTop: hp(3),
  },
  label: {
    fontSize: wp(3.8),
    color: "#444",
    marginBottom: hp(1),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3),
    height: hp(6.3),
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    fontSize: wp(3.8),
    color: "#333",
  },
  saveBtn: {
    marginTop: hp(5),
    backgroundColor: "#E57C6F",
    height: hp(6.5),
    borderRadius: wp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: wp(4),
    fontWeight: "600",
  },
  skipText: {
    color: "#E57C6F",
    fontSize: wp(4),
    textAlign: "center",
    marginTop: hp(2),
  },
});
