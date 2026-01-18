/**
 * Feed Screen
 * Display videos and news content with vertical scrolling
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { FeedHeader, VideoCard } from '../components/feed';
import { CountrySelectionModal } from '../components/modals';
import { mockVideos, Video } from '../data/mockVideos';

export const FeedScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'news'>('videos');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Country');
  const [videos, setVideos] = useState(mockVideos);
  const flatListRef = useRef<FlatList>(null);

  const handleCountryPress = () => {
    setCountryModalVisible(true);
  };

  const handleSportPress = () => {
    console.log('Sport filter pressed');
    // TODO: Open sport selection modal
  };

  const handleCountrySelect = (country: { name: string }) => {
    setSelectedCountry(country.name);
    console.log('Country selected:', country.name);
  };

  const handleVideoPress = (videoId: string) => {
    console.log('Video pressed:', videoId);
  };

  const handleLike = (videoId: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );
  };

  const handleComment = (videoId: string) => {
    console.log('Comment on video:', videoId);
  };

  const handleShare = (videoId: string) => {
    console.log('Share video:', videoId);
  };

  const renderVideo = ({ item }: { item: Video }) => (
    <VideoCard
      id={item.id}
      thumbnail={item.thumbnail}
      title={item.title}
      description={item.description}
      timestamp={item.timestamp}
      likes={item.likes}
      comments={item.comments}
      isLiked={item.isLiked}
      onPress={() => handleVideoPress(item.id)}
      onLike={() => handleLike(item.id)}
      onComment={() => handleComment(item.id)}
      onShare={() => handleShare(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Feed Header */}
        <FeedHeader
          title="FEED"
          selectedCountry={selectedCountry}
          selectedSport="From"
          onCountryPress={handleCountryPress}
          onSportPress={handleSportPress}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Video Feed */}
        {activeTab === 'videos' && (
          <FlatList
            ref={flatListRef}
            data={videos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            snapToInterval={600} // Adjust based on device height
            decelerationRate="fast"
            style={styles.flatList}
          />
        )}

        {/* News Feed Placeholder */}
        {activeTab === 'news' && (
          <View style={styles.placeholder}>
            {/* TODO: Implement news feed in Task 4.2 */}
          </View>
        )}

        {/* Country Selection Modal */}
        <CountrySelectionModal
          visible={countryModalVisible}
          selectedCountry={selectedCountry}
          onSelect={handleCountrySelect}
          onClose={() => setCountryModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  flatList: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
