import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const AccordionItem = ({ title, options, expanded, onToggle, onSelect, selectedValue }) => {
    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [expanded]);

    return (
        <View style={[styles.container, expanded && styles.expandedContainer]}>
            <TouchableOpacity onPress={onToggle} style={styles.header} activeOpacity={0.8}>
                <Text style={styles.title}>{title}</Text>
                {selectedValue && (
                    <Ionicons name="checkmark-circle" size={20} color="black" />
                )}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.option,
                                selectedValue === option && styles.selectedOption
                            ]}
                            onPress={() => onSelect(option)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedValue === option && styles.selectedOptionText
                            ]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#b0b0b0', // Grey background matching design
        borderRadius: 25,
        marginBottom: 15,
        overflow: 'hidden',
    },
    expandedContainer: {
        backgroundColor: '#d0d0d0', // Slightly lighter when expanded? Or Keep generic.
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#b0b0b0', // Grey
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    content: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    option: {
        width: '90%',
        paddingVertical: 12,
        marginTop: 8,
        borderRadius: 15,
        backgroundColor: '#999', // Darker grey for options
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#fff', // White for selected
    },
    optionText: {
        color: '#fff',
        fontWeight: '500',
    },
    selectedOptionText: {
        color: '#333',
    }
});

export default AccordionItem;
