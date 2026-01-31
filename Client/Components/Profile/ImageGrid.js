import React from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_SIZE = width / COLUMN_COUNT;

const ImageGrid = ({ images }) => {
    return (
        <View style={styles.container}>
            {images.map((item) => (
                <View key={item.id} style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        width: '50%', // 2 columns
        height: 200, // Fixed height for masonry look simulation
        padding: 1, // small gap
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default ImageGrid;
