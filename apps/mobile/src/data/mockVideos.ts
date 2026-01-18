/**
 * Mock Video Data
 * Sample video data for feed
 */

export interface Video {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const mockVideos: Video[] = [
  {
    id: 'video-1',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    title: "Back-to-back free-kick magic! Fans can't stop replaying these moments ⭐",
    description: 'Read More',
    timestamp: '1 hours ago',
    likes: 0,
    comments: 2,
    isLiked: false,
  },
  {
    id: 'video-2',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    title: "Not one, but TWO stunning free-kick goals in a single match! 🔥⚽...",
    description: 'Read More',
    timestamp: '1 hours ago',
    likes: 0,
    comments: 2,
    isLiked: false,
  },
  {
    id: 'video-3',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    title: "Incredible bicycle kick goal from outside the box!",
    description: 'Read More',
    timestamp: '2 hours ago',
    likes: 156,
    comments: 12,
    isLiked: true,
  },
  {
    id: 'video-4',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
    title: "Last-minute winner sends stadium into absolute chaos!",
    description: 'Read More',
    timestamp: '3 hours ago',
    likes: 342,
    comments: 45,
    isLiked: false,
  },
  {
    id: 'video-5',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    title: "Goalkeeper becomes hero with penalty shootout saves",
    description: 'Read More',
    timestamp: '5 hours ago',
    likes: 89,
    comments: 7,
    isLiked: false,
  },
];
