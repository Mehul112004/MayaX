import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDesigns } from '../../Context/DesignContext';

const { width } = Dimensions.get('window');

const EditScreen = () => {
    const navigation = useNavigation();
    const { mockEditOptions } = useDesigns();
    const [selectedOption, setSelectedOption] = useState(null);

    // Initialize with the first option
    useEffect(() => {
        if (mockEditOptions && mockEditOptions.length > 0) {
            setSelectedOption(mockEditOptions[0]);
        }
    }, [mockEditOptions]);

    const renderItem = ({ item }) => {
        const isSelected = selectedOption?.id === item.id;
        return (
            <TouchableOpacity
                style={[styles.sliderItem, isSelected && styles.selectedSliderItem]}
                onPress={() => setSelectedOption(item)}
            >
                <Image source={{ uri: item.image }} style={styles.sliderImage} />
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('SaveImageScreen', { image: selectedOption?.image })}
                    >
                        <Ionicons name="download-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Preview */}
            <View style={styles.previewContainer}>
                {selectedOption ? (
                    <Image source={{ uri: selectedOption.image }} style={styles.mainImage} resizeMode="cover" />
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={{ color: '#aaa' }}>Loading Preview...</Text>
                    </View>
                )}
            </View>

            {/* Bottom Slider Panel */}
            <View style={styles.bottomPanel}>
                <Text style={styles.panelTitle}>Variations</Text>
                <FlatList
                    data={mockEditOptions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        alignItems: 'center'
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111', // Dark background for edit mode
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    actionButton: {
        padding: 8,
        marginLeft: 15,
    },
    previewContainer: {
        flex: 1,
        width: width,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 180,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        backdropFilter: 'blur(10px)', // Works on some platforms, ignored on others
    },
    panelTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 20,
        marginBottom: 15,
    },
    // sliderContent removed in favor of inline dynamic padding
    sliderItem: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        position: 'relative',
    },
    selectedSliderItem: {
        borderColor: '#00ffd5', // Bright Cyan Highlight
        borderWidth: 3,
        transform: [{ translateY: -15 }, { scale: 1.1 }], // Float up and scale
        shadowColor: "#00ffd5",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
    },
    checkIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    }
});

export default EditScreen;