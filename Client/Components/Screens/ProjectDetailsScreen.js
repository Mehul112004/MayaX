import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getProjectDetails, likeProject, unlikeProject } from '../../Services/projectService';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.5;

const ProjectDetailsScreen = ({ navigation, route }) => {
    const { projectId, projectData } = route.params;
    const [project, setProject] = useState(projectData || null);
    const [loading, setLoading] = useState(!projectData);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showOriginal, setShowOriginal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            return () => StatusBar.setBarStyle('dark-content');
        }, [])
    );

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const data = await getProjectDetails(projectId);
                setProject(data);
                setLiked(data.is_liked || false);
                setLikeCount(data.likes || 0);
            } catch (error) {
                console.error('Failed to load project details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [projectId]);

    // Sync from projectData if API hasn't returned yet
    useEffect(() => {
        if (projectData && !project?.is_liked) {
            setLikeCount(projectData.likes || 0);
        }
    }, [projectData]);

    const handleToggleLike = async () => {
        const wasLiked = liked;
        // Optimistic update
        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

        try {
            if (wasLiked) {
                await unlikeProject(projectId);
            } else {
                await likeProject(projectId);
            }
        } catch (error) {
            // Revert on error
            setLiked(wasLiked);
            setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D97385" />
            </View>
        );
    }

    if (!project) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#888' }}>Project not found</Text>
            </View>
        );
    }

    const creator = project.user || {};
    const avatarUri = creator.avatar_url;
    const creatorName = creator.name || 'Unknown Creator';

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: showOriginal && project.original_image ? project.original_image : project.image_url }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(18,18,18,1)']}
                        locations={[0, 0.3, 0.7, 1]}
                        style={styles.imageOverlay}
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* View Original Button */}
                    {project.original_image && (
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPressIn={() => setShowOriginal(true)}
                            onPressOut={() => setShowOriginal(false)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name={showOriginal ? "eye-off" : "eye"} size={24} color="#fff" />
                        </TouchableOpacity>
                    )}

                    {/* Title over image */}
                    <View style={styles.imageTitleRow}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentSection}>
                    {/* Creator Row */}
                    <View style={styles.creatorRow}>
                        <View style={styles.creatorInfo}>
                            {avatarUri ? (
                                <Image source={{ uri: avatarUri }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Ionicons name="person" size={18} color="#888" />
                                </View>
                            )}
                            <View>
                                <Text style={styles.creatorLabel}>Created by</Text>
                                <Text style={styles.creatorName}>{creatorName}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={22} color="#aaa" />
                            <Text style={styles.statValue}>{formatCount(project.views || 0)}</Text>
                            <Text style={styles.statLabel}>Views</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="heart" size={22} color="#D97385" />
                            <Text style={styles.statValue}>{formatCount(likeCount)}</Text>
                            <Text style={styles.statLabel}>Likes</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {project.description && (
                        <View style={styles.descriptionSection}>
                            <Text style={styles.sectionLabel}>About</Text>
                            <Text style={styles.descriptionText}>{project.description}</Text>
                        </View>
                    )}

                    {/* Tags */}
                    <View style={styles.tagsSection}>
                        {project.room_type && (
                            <View style={styles.tag}>
                                <Ionicons name="home-outline" size={14} color="#D97385" />
                                <Text style={styles.tagText}>{project.room_type}</Text>
                            </View>
                        )}
                        {project.style && (
                            <View style={styles.tag}>
                                <Ionicons name="sparkles-outline" size={14} color="#D97385" />
                                <Text style={styles.tagText}>{project.style}</Text>
                            </View>
                        )}
                        {project.color_scheme && (
                            <View style={styles.tag}>
                                <Ionicons name="color-palette-outline" size={14} color="#D97385" />
                                <Text style={styles.tagText}>{project.color_scheme}</Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom spacing */}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Floating Like Button */}
            <TouchableOpacity
                style={[styles.likeButton, liked && styles.likeButtonActive]}
                onPress={handleToggleLike}
                activeOpacity={0.8}
            >
                <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={26}
                    color={liked ? "#fff" : "#D97385"}
                />
                <Text style={[styles.likeButtonText, liked && styles.likeButtonTextActive]}>
                    {liked ? 'Saved' : 'Save to Inspirations'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Hero Image
    imageContainer: {
        width: width,
        height: IMAGE_HEIGHT,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 55,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeButton: {
        position: 'absolute',
        top: 55,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitleRow: {
        position: 'absolute',
        bottom: 20,
        left: 24,
        right: 24,
    },
    projectTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 34,
    },

    // Content
    contentSection: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },

    // Creator
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    avatarPlaceholder: {
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorLabel: {
        fontSize: 12,
        color: '#777',
        marginBottom: 2,
    },
    creatorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 30,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginTop: 6,
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#333',
    },

    // Description
    descriptionSection: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: '#ccc',
        lineHeight: 22,
    },

    // Tags
    tagsSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    tagText: {
        fontSize: 13,
        color: '#ccc',
        marginLeft: 6,
    },

    // Like Button
    likeButton: {
        position: 'absolute',
        bottom: 36,
        left: 30,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 28,
        backgroundColor: '#1e1e1e',
        borderWidth: 1.5,
        borderColor: '#D97385',
    },
    likeButtonActive: {
        backgroundColor: '#D97385',
        borderColor: '#D97385',
    },
    likeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#D97385',
        marginLeft: 10,
    },
    likeButtonTextActive: {
        color: '#fff',
    },
});

export default ProjectDetailsScreen;
