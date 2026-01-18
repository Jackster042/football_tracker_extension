/**
 * Video Card Component
 * Full-screen video card for feed with overlay elements
 * Based on design reference feed-video.png
 */

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { theme } from '../../theme';

interface VideoCardProps {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  timestamp?: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  thumbnail,
  title,
  description,
  timestamp = '1 hours ago',
  likes = 0,
  comments = 2,
  isLiked = false,
  onPress,
  onLike,
  onComment,
  onShare,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: thumbnail }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Gradient overlay for text readability */}
        <View style={styles.gradientOverlay} />

        {/* Play Button - Center */}
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <View style={styles.playIcon} />
          </View>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Description (Left) */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {title}
            </Text>
            {description && (
              <Text style={styles.readMore} numberOfLines={1}>
                {description}
              </Text>
            )}
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          {/* Action Buttons (Right) */}
          <View style={styles.actionsContainer}>
            {/* Share Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onShare}
              activeOpacity={0.7}
            >
              <View style={styles.shareIcon} />
            </TouchableOpacity>

            {/* Like Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onLike}
              activeOpacity={0.7}
            >
              <View style={[styles.likeIcon, isLiked && styles.likeIconActive]} />
              {likes > 0 && (
                <Text style={styles.actionText}>{likes}</Text>
              )}
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onComment}
              activeOpacity={0.7}
            >
              <View style={styles.commentIcon} />
              {comments > 0 && (
                <Text style={styles.actionText}>{comments}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 120, // Account for navigation
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: theme.colors.background.primary,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 6,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  descriptionContainer: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  description: {
    ...theme.typography.styles.body,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  readMore: {
    ...theme.typography.styles.body,
    fontSize: 13,
    color: theme.colors.primary.light,
    marginBottom: theme.spacing[1],
  },
  timestamp: {
    ...theme.typography.styles.caption,
    fontSize: 12,
    color: theme.colors.text.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  actionButton: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  shareIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  likeIcon: {
    width: 22,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 11,
  },
  likeIconActive: {
    backgroundColor: theme.colors.accent.like,
  },
  commentIcon: {
    width: 24,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  actionText: {
    ...theme.typography.styles.caption,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
