import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Get initials from a name string (matching backend logic).
 */
const getInitials = (name) => {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_COLORS = [
  "#D48B95",
  "#A34E5D",
  "#DAA06D",
  "#6B8F71",
  "#5B7FA5",
  "#8B6FB0",
  "#C97B4B",
  "#4A8F8F",
];
const pickColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const ProfileHeader = ({ profile, onLogoutPress }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const hasAvatar =
    profile?.avatar_url && !profile?.avatar_url?.includes("undefined");

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.handle}>
          {profile?.email || profile?.handle || ""}
        </Text>
        
        {/* Three dots button */}
        <View>
          <TouchableOpacity 
            onPress={() => setPopoverVisible(true)} 
            style={styles.dotsButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
          </TouchableOpacity>

          {/* Popover Menu using Modal for absolute positioning over everything */}
          <Modal
            visible={popoverVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setPopoverVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setPopoverVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.popoverContainer}>
                    <TouchableOpacity 
                      style={styles.popoverItem}
                      onPress={() => {
                        setPopoverVisible(false);
                        // Handle About Us ...
                      }}
                    >
                      <Ionicons name="information-circle-outline" size={20} color="#333" style={styles.popoverIcon} />
                      <Text style={styles.popoverText}>About Us</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.popoverDivider} />

                    <TouchableOpacity 
                      style={styles.popoverItem}
                      onPress={() => {
                        setPopoverVisible(false);
                        if (onLogoutPress) onLogoutPress();
                      }}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#E53935" style={styles.popoverIcon} />
                      <Text style={[styles.popoverText, { color: '#E53935' }]}>Log Out</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>

      <View style={styles.profileInfo}>
        {hasAvatar ? (
          <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.initialsAvatar,
              { backgroundColor: pickColor(profile?.name) },
            ]}
          >
            <Text style={styles.initialsText}>
              {getInitials(profile?.name)}
            </Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{profile?.name || "User"}</Text>
          <Text style={styles.bio}>{profile?.bio || profile?.email || ""}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dotsButton: {
    padding: 5,
  },
  handle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  initialsAvatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  bio: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Very light dim
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  popoverContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 65, // Position below the header
    marginRight: 20,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  popoverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  popoverIcon: {
    marginRight: 10,
  },
  popoverText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  popoverDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default ProfileHeader;
