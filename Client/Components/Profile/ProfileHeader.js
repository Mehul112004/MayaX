import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileHeader = ({ profile }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.handle}>{profile.handle}</Text>
                <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
            </View>

            <View style={styles.profileInfo}>
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.bio}>{profile.bio}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    handle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    bio: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default ProfileHeader;
