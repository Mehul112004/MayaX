import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 20 padding on sides + 8 gap -> (width - 40 - 8) / 2

const DesignCard = ({ title, image, onPress }) => {
    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradient}
            >
                <Text style={styles.title}>{title}</Text>
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
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
        fontWeight: '600',
        lineHeight: 20,
    },
});

export default DesignCard;
