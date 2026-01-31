import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileTabs = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Projects' && styles.activeTab]}
                onPress={() => onTabChange('Projects')}
            >
                <Ionicons
                    name="grid-outline"
                    size={20}
                    color={activeTab === 'Projects' ? '#008080' : '#888'} // Teal for active
                />
                <Text style={[styles.text, activeTab === 'Projects' && styles.activeText]}>Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'Inspirations' && styles.activeTab]}
                onPress={() => onTabChange('Inspirations')}
            >
                <Ionicons
                    name="heart-outline"
                    size={20}
                    color={activeTab === 'Inspirations' ? '#008080' : '#888'}
                />
                <Text style={[styles.text, activeTab === 'Inspirations' && styles.activeText]}>Inspirations</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        flexDirection: 'column', // Stack icon and text
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
        gap: 5
    },
    activeTab: {
        borderBottomColor: '#008080', // Teal underline
    },
    text: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    activeText: {
        color: '#008080',
        fontWeight: '600',
    },
});

export default ProfileTabs;
