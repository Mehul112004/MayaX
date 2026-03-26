import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, LinearTransition, Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const AccordionItem = ({ title, iconName, options, expanded, onToggle, onSelect, selectedValue }) => {
    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: withTiming(expanded ? '180deg' : '0deg', { duration: 300, easing: Easing.out(Easing.exp) }) }]
        };
    });

    return (
        <Animated.View layout={LinearTransition.duration(400)} style={styles.container}>
            <TouchableOpacity onPress={onToggle} style={styles.header} activeOpacity={0.8}>
                <View style={styles.headerLeft}>
                    {iconName && <Ionicons name={iconName} size={22} color="#fff" style={styles.headerIcon} />}
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.headerRight}>
                    {selectedValue ? (
                        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.badge}>
                             <Ionicons name="checkmark" size={12} color="#fff" />
                        </Animated.View>
                    ) : null}
                    <Animated.View style={animatedChevronStyle}>
                        <Ionicons 
                            name="chevron-down" 
                            size={20} 
                            color="#aaa" 
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            {expanded && (
                <Animated.View 
                    entering={FadeIn.duration(400)} 
                    exiting={FadeOut.duration(300)} 
                    style={styles.content}
                >
                    <View style={styles.chipContainer}>
                    {options.map((option) => {
                        const isSelected = selectedValue === option;
                        return (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.chip,
                                    isSelected && styles.selectedChip
                                ]}
                                onPress={() => onSelect(option)}
                                activeOpacity={0.7}
                            >
                                {isSelected ? (
                                    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={StyleSheet.absoluteFill}>
                                        <LinearGradient
                                            colors={['#A34E5D', '#D97385']}
                                            style={StyleSheet.absoluteFill}
                                            borderRadius={20}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        />
                                    </Animated.View>
                                ) : null}
                                <Text style={[
                                    styles.chipText,
                                    isSelected && styles.selectedChipText
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    </View>
                </Animated.View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(30,30,30,0.6)', 
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    header: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#A34E5D',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    content: {
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 5,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    selectedChip: {
        borderColor: 'transparent',
    },
    chipText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '500',
        zIndex: 1,
    },
    selectedChipText: {
        color: '#fff',
        fontWeight: '700',
    }
});

export default AccordionItem;
