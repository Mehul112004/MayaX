import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../HomeHeader';
import DesignCard from '../DesignCard';
import { useDesigns } from '../../Context/DesignContext';

const HomeScreen = () => {
  const { designs, loading } = useDesigns();

  const renderItem = ({ item }) => (
    <DesignCard
      title={item.title}
      image={item.image}
      onPress={() => console.log('Pressed', item.title)}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A34E5D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Designs</Text>
        <FlatList
          data={designs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
