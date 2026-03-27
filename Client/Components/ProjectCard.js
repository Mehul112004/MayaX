import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Same width as DesignCard for grid consistency

const ProjectCard = ({ project, onPress }) => {
    const creator = project.user || {};
    const avatarUri = creator.avatar_url;
    const creatorName = creator.name || 'Unknown';

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={{ uri: project.image_url || project.image }} style={styles.image} resizeMode="cover" />
            
            {/* Overlay for Title and Creator */}
            <LinearGradient
                colors={['transparent', 'rgba(18,18,18,0.9)']}
                style={styles.gradient}
            >
                <Text style={styles.title} numberOfLines={1}>{project.title}</Text>
                
                <View style={styles.creatorRow}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={10} color="#888" />
                        </View>
                    )}
                    <Text style={styles.creatorName} numberOfLines={1}>{creatorName}</Text>
                </View>
            </LinearGradient>

            {/* Likes Badge */}
            <View style={styles.likesBadge}>
                <Ionicons name="heart" size={12} color="#D97385" />
                <Text style={styles.likesText}>{project.likes || 0}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1e1e1e', // Dark theme base
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        justifyContent: 'flex-end',
        padding: 12,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 6,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 18,
        height: 18,
        borderRadius: 9,
        marginRight: 6,
    },
    avatarPlaceholder: {
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorName: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '500',
    },
    likesBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    likesText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ProjectCard;
