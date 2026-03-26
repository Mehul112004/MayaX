import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileStats = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.number}>{stats?.projects ?? 0}</Text>
        <Text style={styles.label}>Projects</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.number}>{stats?.inspirations ?? 0}</Text>
        <Text style={styles.label}>Inspirations</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    width: "42%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#888",
  },
});

export default ProfileStats;
