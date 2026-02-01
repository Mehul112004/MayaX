import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDesigns } from '../../Context/DesignContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COLUMN_count = 2;
const ITEM_WIDTH = (width - 40) / COLUMN_count - 10;

const SimilarDesignScreen = () => {
    const navigation = useNavigation();
    const { mockSimilarDesigns } = useDesigns();

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Logo/Header */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
                <Text style={styles.logoSubtext}>DESIGN YOUR WAY</Text>
            </View>

            <Text style={styles.headerTitle}>Similar Designs</Text>

            <FlatList
                data={mockSimilarDesigns}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={COLUMN_count}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Arrow Indicator */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomGradient}
            >
                <Ionicons name="chevron-down" size={40} color="#fff" />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#333',
    },
    logoSubtext: {
        fontSize: 8,
        letterSpacing: 2,
        fontWeight: '600',
        color: '#A34E5D',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 100, // Increased padding to allow scrolling past gradient
    },
    card: {
        width: ITEM_WIDTH,
        marginBottom: 15,
        marginHorizontal: 5,
        borderRadius: 20,
        overflow: 'hidden',
        height: 220, // Taller images as per design
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
});

export default SimilarDesignScreen;
