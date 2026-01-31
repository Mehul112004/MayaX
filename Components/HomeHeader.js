import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeHeader = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <Text style={styles.logoText}>MayaX</Text>
            <TouchableOpacity>
                <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 0.5,
    },
});

export default HomeHeader;
