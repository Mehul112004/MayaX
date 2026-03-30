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
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getProjectDetails, likeProject, unlikeProject, updateProject, deleteProject } from '../../Services/projectService';
import { useAuth } from '../../Context/AuthContext';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.5;

const ProjectDetailsScreen = ({ navigation, route }) => {
    const { projectId, projectData } = route.params;
    const { user } = useAuth();
    const [project, setProject] = useState(projectData || null);
    const [loading, setLoading] = useState(!projectData);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showOriginal, setShowOriginal] = useState(false);

    // Owner controls
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
    const isOwner = user?.id && (project.user_id === user.id || creator.id === user.id);

    const handleDelete = () => {
        Alert.alert(
            'Delete Project',
            'Are you sure you want to delete this project? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProject(projectId);
                            Alert.alert('Deleted', 'Project has been removed.');
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete project.');
                        }
                    },
                },
            ]
        );
    };

    const handleOpenEdit = () => {
        setEditTitle(project.title || '');
        setEditDescription(project.description || '');
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) {
            Alert.alert('Error', 'Title is required.');
            return;
        }
        setIsSaving(true);
        try {
            const result = await updateProject(projectId, {
                title: editTitle.trim(),
                description: editDescription.trim(),
            });
            setProject(prev => ({ ...prev, title: editTitle.trim(), description: editDescription.trim() }));
            setShowEditModal(false);
        } catch (e) {
            Alert.alert('Error', 'Failed to update project.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOwnerMenu = () => {
        Alert.alert(
            'Project Options',
            '',
            [
                { text: 'Edit Details', onPress: handleOpenEdit },
                { text: 'Delete Project', onPress: handleDelete, style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

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

                    {/* Owner Menu Button */}
                    {isOwner && (
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={handleOwnerMenu}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
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

            {/* Edit Modal */}
            <Modal
                visible={showEditModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowEditModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Project</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Title</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editTitle}
                            onChangeText={setEditTitle}
                            placeholder="Project title"
                            placeholderTextColor="#666"
                            maxLength={50}
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                            value={editDescription}
                            onChangeText={setEditDescription}
                            placeholder="Describe your design..."
                            placeholderTextColor="#666"
                            multiline
                        />

                        <TouchableOpacity
                            style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
                            onPress={handleSaveEdit}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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

    // Owner Menu Button
    menuButton: {
        position: 'absolute',
        top: 55,
        right: 70,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Edit Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#aaa',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 14,
        color: '#fff',
        fontSize: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    saveButton: {
        backgroundColor: '#D97385',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ProjectDetailsScreen;
