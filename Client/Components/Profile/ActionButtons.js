import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ActionButtons = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EditProfile')}
            >
                <Text style={styles.text}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>Share Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        width: '48%',
        backgroundColor: '#eee', // Light grey background
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
        color: '#333',
        fontSize: 14,
    },
});

export default ActionButtons;
