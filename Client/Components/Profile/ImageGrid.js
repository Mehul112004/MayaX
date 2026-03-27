import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_SIZE = width / COLUMN_COUNT;

const ImageGrid = ({ images }) => {
  return (
    <View style={styles.container}>
      {(images || []).map((item) => (
        <View key={item?.id} style={styles.imageContainer}>
          <Image source={{ uri: item?.image }} style={styles.image} />

          {/* Likes Count Overlay */}
          {item?.likes_count !== undefined && (
            <View style={styles.likesOverlay}>
              <Ionicons name="heart" size={12} color="white" />
              <Text style={styles.likesText}>{item.likes_count}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "50%", // 2 columns
    height: 200, // Fixed height for masonry look simulation
    padding: 1, // small gap
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  likesOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  likesText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ImageGrid;
