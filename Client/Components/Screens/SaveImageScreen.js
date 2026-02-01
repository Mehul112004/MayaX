import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SaveImageScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { image } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>M<Text style={{ color: '#A34E5D' }}>X</Text></Text>
            </View>

            <Text style={[styles.successText, { textDecorationLine: 'underline' }]}>Image Saved Successfully</Text>
            <View style={styles.content}>
                {/* Modal Card */}
                <View style={styles.card}>



                    {/* Image Preview */}
                    <View style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.savedImage} />
                        ) : (
                            <View style={[styles.savedImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: '#999' }}>No Image</Text>
                            </View>
                        )}
                    </View>

                    {/* Similar Items Button */}
                    <TouchableOpacity
                        style={styles.similarButton}
                        onPress={() => navigation.navigate('SimilarDesignScreen')}
                    >
                        <Text style={styles.similarButtonText}>Similar Items</Text>
                    </TouchableOpacity>



                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // Dark background behind the modal
        // justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    card: {
        width: width * 0.85,
        marginTop: height * 0.1,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
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
    successText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111',
        marginTop: 10,
    },
    imageContainer: {
        width: '100%',
        height: 350,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
    savedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    similarButton: {
        backgroundColor: '#1a1a1a',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    similarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SaveImageScreen;
