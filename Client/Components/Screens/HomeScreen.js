import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import HomeHeader from '../HomeHeader';
import DesignCard from '../DesignCard';
import ProjectCard from '../ProjectCard';
import { useDesigns } from '../../Context/DesignContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { fetchForYouFeed } from '../../Services/feedService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { designs, loading } = useDesigns();
  
  // New States for Feed Toggle
  const [activeTab, setActiveTab] = useState('Presets'); // 'Presets' | 'For You'
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [forYouData, setForYouData] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);

  // Fetch 'For You' Feed when toggled
  useEffect(() => {
      if (activeTab === 'For You' && forYouData.length === 0) {
          const loadFeed = async () => {
              setFeedLoading(true);
              try {
                  const data = await fetchForYouFeed();
                  setForYouData(data);
              } catch (e) {
                  console.error("Failed to load feed", e);
              } finally {
                  setFeedLoading(false);
              }
          };
          loadFeed();
      }
  }, [activeTab]);

  const handlePresetPress = (item) => {
    const prefParams = {
      Colors: item.color_scheme || null,
      Aesthetics: item.aesthetics || item.style || null,
      SpaceType: item.space_type || item.room_type || null,
    };
    navigation.navigate('Create', { prefill: prefParams });
  };

  const handleProjectPress = (item) => {
    navigation.navigate('ProjectDetails', {
      projectId: item.id,
      projectData: item,
    });
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'Presets') {
      return (
        <DesignCard
          title={item.title}
          image={item.image || item.image_url}
          onPress={() => handlePresetPress(item)}
        />
      );
    } else {
      return (
        <ProjectCard
          project={item}
          onPress={() => handleProjectPress(item)}
        />
      );
    }
  };

  const displayData = activeTab === 'Presets' ? designs : forYouData;
  const displayLoading = activeTab === 'Presets' ? loading : feedLoading;

  const handleSelectTab = (tab) => {
      setActiveTab(tab);
      setDropdownVisible(false);
  };

  const chevronStyle = useAnimatedStyle(() => {
    return {
        transform: [{ rotate: withTiming(dropdownVisible ? '180deg' : '0deg', { duration: 250, easing: Easing.out(Easing.exp) }) }]
    };
  });

  return (
    <View style={styles.container}>
      <HomeHeader />
      <View style={styles.content}>
        
        {/* Dropdown Header */}
        <View style={styles.headerRow}>
            <TouchableOpacity 
                style={styles.dropdownToggle} 
                onPress={() => setDropdownVisible(!dropdownVisible)}
                activeOpacity={0.7}
            >
                <Text style={styles.sectionTitle}>{activeTab}</Text>
                <Animated.View style={[styles.chevronContainer, chevronStyle]}>
                    <Ionicons name="chevron-down" size={24} color="#1a1a1a" />
                </Animated.View>
            </TouchableOpacity>
        </View>

        {dropdownVisible && (
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                <View style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]} />
            </TouchableWithoutFeedback>
        )}

        {dropdownVisible && (
            <Animated.View 
                entering={FadeIn.duration(200)} 
                exiting={FadeOut.duration(200)} 
                style={styles.dropdownMenu}
            >
                <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => handleSelectTab('Presets')}
                >
                    <Text style={[styles.dropdownText, activeTab === 'Presets' && styles.dropdownTextActive]}>Presets</Text>
                    {activeTab === 'Presets' && <Ionicons name="checkmark" size={20} color="#A34E5D" />}
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => handleSelectTab('For You')}
                >
                    <Text style={[styles.dropdownText, activeTab === 'For You' && styles.dropdownTextActive]}>For You</Text>
                    {activeTab === 'For You' && <Ionicons name="checkmark" size={20} color="#A34E5D" />}
                </TouchableOpacity>
            </Animated.View>
        )}

        {displayLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#A34E5D" />
            </View>
        ) : (
            <FlatList
              data={displayData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
        )}
      </View>
    </View>
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
    marginTop: 50, // lower indicator so it stays inside FlatList area intuitively
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
    zIndex: 20, // Higher than AbsoluteFill background
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  chevronContainer: {
    marginLeft: 8,
    marginTop: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 5,
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100, // Topmost level
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownTextActive: {
    color: '#A34E5D',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
